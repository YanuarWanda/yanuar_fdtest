<?php

use App\Models\Book;
use App\Models\User;

test('it belongs to a user', function () {
    $user = $this->createUser();
    $book = $this->createBookForUser($user);

    expect($book->user)->toBeInstanceOf(User::class);
    expect($book->user->id)->toBe($user->id);
});

test('it has fillable attributes', function () {
    $fillable = [
        'user_id',
        'title',
        'author',
        'description',
        'thumbnail',
        'rating',
    ];

    $book = new Book();
    expect($book->getFillable())->toBe($fillable);
});

test('it casts attributes correctly', function () {
    $book = $this->createBookForUser($this->createUser(), [
        'rating' => '4',
    ]);

    expect($book->rating)->toBeInt();
    expect($book->rating)->toBe(4);
    expect($book->created_at)->toBeInstanceOf(\Carbon\Carbon::class);
    expect($book->updated_at)->toBeInstanceOf(\Carbon\Carbon::class);
});

test('has by author scope', function () {
    $user = $this->createUser();
    $book1 = $this->createBookForUser($user, ['author' => 'Stephen King']);
    $book2 = $this->createBookForUser($user, ['author' => 'J.K. Rowling']);
    $book3 = $this->createBookForUser($user, ['author' => 'Stephen King']);

    $stephenKingBooks = Book::byAuthor('Stephen King')->get();

    expect($stephenKingBooks)->toHaveCount(2);
    $stephenKingBooks->each(function ($book) {
        expect($book->author)->toContain('Stephen King');
    });
});

test('has with rating scope', function () {
    $user = $this->createUser();
    $this->createBookForUser($user, ['rating' => 3]);
    $this->createBookForUser($user, ['rating' => 4]);
    $this->createBookForUser($user, ['rating' => 5]);

    $fourStarBooks = Book::withRating(4)->get();

    expect($fourStarBooks)->toHaveCount(1);
    expect($fourStarBooks->first()->rating)->toBe(4);
});

test('has search scope', function () {
    $user = $this->createUser();
    $book1 = $this->createBookForUser($user, [
        'title' => 'The Great Gatsby',
        'author' => 'F. Scott Fitzgerald',
    ]);
    $book2 = $this->createBookForUser($user, [
        'title' => 'To Kill a Mockingbird',
        'author' => 'Harper Lee',
    ]);

    $gatsbyResults = Book::search('gatsby')->get();
    $authorResults = Book::search('harper')->get();

    expect($gatsbyResults)->toHaveCount(1);
    expect($gatsbyResults->first()->id)->toBe($book1->id);
    expect($authorResults)->toHaveCount(1);
    expect($authorResults->first()->id)->toBe($book2->id);
});

test('search scope is case insensitive', function () {
    $user = $this->createUser();
    $book = $this->createBookForUser($user, [
        'title' => 'The Great Gatsby',
    ]);

    $results = Book::search('GATSBY')->get();

    expect($results)->toHaveCount(1);
    expect($results->first()->id)->toBe($book->id);
});

test('has owned by scope', function () {
    $user1 = $this->createUser();
    $user2 = $this->createUser();
    $this->createBooksForUser($user1, 2);
    $this->createBooksForUser($user2, 3);

    $user1Books = Book::ownedBy($user1->id)->get();
    $user2Books = Book::ownedBy($user2->id)->get();

    expect($user1Books)->toHaveCount(2);
    expect($user2Books)->toHaveCount(3);

    $user1Books->each(function ($book) use ($user1) {
        expect($book->user_id)->toBe($user1->id);
    });
});

test('has with user scope', function () {
    $user = $this->createUser();
    $book = $this->createBookForUser($user);

    $booksWithUser = Book::withUser()->where('id', $book->id)->first();

    expect($booksWithUser->relationLoaded('user'))->toBeTrue();
    expect($booksWithUser->user->id)->toBe($user->id);
});

test('has latest scope', function () {
    $user = $this->createUser();
    $oldBook = $this->createBookForUser($user, ['created_at' => now()->subDays(5)]);
    $newBook = $this->createBookForUser($user, ['created_at' => now()]);

    $latestBooks = Book::latest()->get();

    expect($latestBooks->first()->id)->toBe($newBook->id);
    expect($latestBooks->last()->id)->toBe($oldBook->id);
});

test('has by date created scope', function () {
    $user = $this->createUser();
    $oldBook = $this->createBookForUser($user, ['created_at' => '2023-01-01 12:00:00']);
    $newBook = $this->createBookForUser($user, ['created_at' => '2024-01-01 12:00:00']);

    $booksFrom2024 = Book::byDateCreated('2024-01-01')->get();
    $booksRange = Book::byDateCreated('2023-01-01', '2023-12-31')->get();

    expect($booksFrom2024)->toHaveCount(1);
    expect($booksFrom2024->first()->id)->toBe($newBook->id);
    expect($booksRange)->toHaveCount(1);
    expect($booksRange->first()->id)->toBe($oldBook->id);
});

test('has filtered scope', function () {
    $user = $this->createUser();
    $book1 = $this->createBookForUser($user, [
        'title' => 'Test Book',
        'author' => 'John Doe',
        'rating' => 5,
        'created_at' => '2024-01-01 12:00:00'
    ]);
    $book2 = $this->createBookForUser($user, [
        'title' => 'Another Book',
        'author' => 'Jane Smith',
        'rating' => 3,
        'created_at' => '2023-01-01 12:00:00'
    ]);

    $filteredBooks = Book::filtered([
        'search' => 'test',
        'author' => 'john',
        'rating' => 5,
        'date_from' => '2024-01-01'
    ])->get();

    expect($filteredBooks)->toHaveCount(1);
    expect($filteredBooks->first()->id)->toBe($book1->id);
});

test('has formatted rating attribute', function () {
    $user = $this->createUser();
    $testCases = [
        1 => '★☆☆☆☆ (1/5)',
        2 => '★★☆☆☆ (2/5)',
        3 => '★★★☆☆ (3/5)',
        4 => '★★★★☆ (4/5)',
        5 => '★★★★★ (5/5)',
    ];

    foreach ($testCases as $rating => $expectedFormat) {
        $book = $this->createBookForUser($user, ['rating' => $rating]);
        expect($book->formatted_rating)->toBe($expectedFormat);
    }
});

test('formatted rating handles zero rating', function () {
    $user = $this->createUser();
    $book = $this->createBookForUser($user, ['rating' => 0]);

    expect($book->formatted_rating)->toBe('☆☆☆☆☆ (0/5)');
});

test('has thumbnail url attribute', function () {
    $user = $this->createUser();
    $bookWithThumbnail = $this->createBookForUser($user, [
        'thumbnail' => 'books/thumbnails/test.jpg'
    ]);
    $bookWithoutThumbnail = $this->createBookForUser($user, [
        'thumbnail' => null
    ]);

    expect($bookWithThumbnail->thumbnail_url)->toContain('storage/books/thumbnails/test.jpg');
    expect($bookWithoutThumbnail->thumbnail_url)->toBeNull();
});

test('combines multiple scopes correctly', function () {
    $user1 = $this->createUser();
    $user2 = $this->createUser();

    $this->createBookForUser($user1, [
        'rating' => 5,
        'created_at' => now()->subDays(5)
    ]);
    $this->createBookForUser($user1, [
        'rating' => 3,
        'created_at' => now()->subDays(5)
    ]);
    $this->createBookForUser($user2, [
        'rating' => 5,
        'created_at' => now()->subDays(5)
    ]);

    $results = Book::ownedBy($user1->id)->withRating(5)->latest()->get();

    expect($results)->toHaveCount(1);
    expect($results->first()->user_id)->toBe($user1->id);
    expect($results->first()->rating)->toBe(5);
});

test('factory creates valid book', function () {
    $user = $this->createUser();
    $book = Book::factory()->for($user)->create();

    expect($book->title)->not->toBeNull();
    expect($book->author)->not->toBeNull();
    expect($book->description)->not->toBeNull();
    expect($book->rating)->toBeInt();
    expect($book->rating)->toBeGreaterThan(0);
    expect($book->rating)->toBeLessThan(6);
    expect($book->user_id)->toBe($user->id);

    $this->assertDatabaseHas('books', [
        'id' => $book->id,
        'title' => $book->title,
        'author' => $book->author,
        'user_id' => $user->id,
    ]);
});

test('factory with author state works', function () {
    $user = $this->createUser();
    $book = Book::factory()->for($user)->byAuthor('Custom Author')->create();

    expect($book->author)->toBe('Custom Author');
});

test('handles empty search term', function () {
    $user = $this->createUser();
    $this->createBooksForUser($user, 3);

    $results = Book::search('')->get();

    expect($results)->toHaveCount(3);
});

test('search handles special characters', function () {
    $user = $this->createUser();
    $book = $this->createBookForUser($user, [
        'title' => 'Book with "quotes" & symbols!',
    ]);

    $results = Book::search('quotes')->get();

    expect($results)->toHaveCount(1);
    expect($results->first()->id)->toBe($book->id);
});

test('scope methods return query builder', function () {
    expect(Book::byAuthor('test'))->toBeInstanceOf(\Illuminate\Database\Eloquent\Builder::class);
    expect(Book::withRating(5))->toBeInstanceOf(\Illuminate\Database\Eloquent\Builder::class);
    expect(Book::search('test'))->toBeInstanceOf(\Illuminate\Database\Eloquent\Builder::class);
    expect(Book::ownedBy(1))->toBeInstanceOf(\Illuminate\Database\Eloquent\Builder::class);
});
