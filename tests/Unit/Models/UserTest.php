<?php

use App\Models\Book;
use App\Models\User;

test('it has many books', function () {
    $user = $this->createUser();
    $this->createBooksForUser($user, 3);

    expect($user->books)->toHaveCount(3);
    expect($user->books->first())->toBeInstanceOf(Book::class);
});

test('it has fillable attributes', function () {
    $fillable = [
        'name',
        'email',
        'password',
    ];

    $user = new User();
    expect($user->getFillable())->toBe($fillable);
});

test('it has hidden attributes', function () {
    $hidden = [
        'password',
        'remember_token',
    ];

    $user = new User();
    expect($user->getHidden())->toBe($hidden);
});

test('it casts attributes correctly', function () {
    $user = $this->createUser([
        'email_verified_at' => '2024-01-01 10:00:00',
        'password' => 'password123',
    ]);

    expect($user->email_verified_at)->toBeInstanceOf(\Carbon\Carbon::class);
    expect($user->created_at)->toBeInstanceOf(\Carbon\Carbon::class);
    expect($user->updated_at)->toBeInstanceOf(\Carbon\Carbon::class);
    expect(password_verify('password123', $user->password))->toBeTrue();
});

test('it can get user initials', function () {
    $testCases = [
        'John Doe' => 'JD',
        'Jane Smith' => 'JS',
        'Alice' => 'A',
        'Bob Johnson Smith' => 'BJ',
        'Mary-Anne O\'Connor' => 'MO',
        '' => '',
    ];

    foreach ($testCases as $name => $expectedInitials) {
        $user = $this->createUser(['name' => $name]);
        expect($user->initials)->toBe($expectedInitials);
    }
});

test('it handles special characters in initials', function () {
    $user = $this->createUser(['name' => 'José María']);
    expect($user->initials)->toBe('JM');
});

test('it trims whitespace for initials', function () {
    $user = $this->createUser(['name' => '  John   Doe  ']);
    expect($user->initials)->toBe('JD');
});

test('password is hashed when creating user', function () {
    $plainPassword = 'password123';
    $user = User::create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => $plainPassword,
    ]);

    expect($user->password)->not->toBe($plainPassword);
    expect(password_verify($plainPassword, $user->password))->toBeTrue();
});

test('it can check user verification status', function () {
    $verifiedUser = $this->createVerifiedUser();
    $unverifiedUser = $this->createUnverifiedUser();

    expect($verifiedUser->email_verified_at)->not->toBeNull();
    expect($unverifiedUser->email_verified_at)->toBeNull();
});

test('books relationship returns only user books', function () {
    $user1 = $this->createUser();
    $user2 = $this->createUser();

    $this->createBooksForUser($user1, 2);
    $this->createBooksForUser($user2, 3);

    expect($user1->books)->toHaveCount(2);
    expect($user2->books)->toHaveCount(3);

    $user1->books->each(function ($book) use ($user1) {
        expect($book->user_id)->toBe($user1->id);
    });
});

test('deleting user deletes associated books', function () {
    $user = $this->createUser();
    $books = $this->createBooksForUser($user, 3);

    expect(Book::where('user_id', $user->id)->get())->toHaveCount(3);

    $user->delete();

    expect(Book::where('user_id', $user->id)->get())->toHaveCount(0);
});

test('user factory creates valid user', function () {
    $user = User::factory()->create();

    expect($user->name)->not->toBeNull();
    expect($user->email)->not->toBeNull();
    expect($user->password)->not->toBeNull();

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
    ]);
});

test('user factory verified state works', function () {
    $verifiedUser = User::factory()->verified()->create();
    $unverifiedUser = User::factory()->unverified()->create();

    expect($verifiedUser->email_verified_at)->not->toBeNull();
    expect($unverifiedUser->email_verified_at)->toBeNull();
});

test('user factory with name state works', function () {
    $user = User::factory()->withName('Custom Name')->create();

    expect($user->name)->toBe('Custom Name');
});
