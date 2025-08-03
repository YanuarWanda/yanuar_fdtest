<?php

use App\Models\Book;
use App\Models\User;
use App\Policies\BookPolicy;

beforeEach(function () {
    $this->policy = new BookPolicy();
    $this->user = $this->createUser();
    $this->otherUser = $this->createUser();
});

test('user can view any books', function () {
    expect($this->policy->viewAny($this->user))->toBeTrue();
});

test('user can view any book', function () {
    $book = $this->createBookForUser($this->otherUser);

    expect($this->policy->view($this->user, $book))->toBeTrue();
});

test('user can create books', function () {
    expect($this->policy->create($this->user))->toBeTrue();
});

test('owner can update their book', function () {
    $book = $this->createBookForUser($this->user);

    expect($this->policy->update($this->user, $book))->toBeTrue();
});

test('non owner cannot update book', function () {
    $book = $this->createBookForUser($this->otherUser);

    expect($this->policy->update($this->user, $book))->toBeFalse();
});

test('owner can delete their book', function () {
    $book = $this->createBookForUser($this->user);

    expect($this->policy->delete($this->user, $book))->toBeTrue();
});

test('non owner cannot delete book', function () {
    $book = $this->createBookForUser($this->otherUser);

    expect($this->policy->delete($this->user, $book))->toBeFalse();
});

test('owner can restore their book', function () {
    $book = $this->createBookForUser($this->user);

    expect($this->policy->restore($this->user, $book))->toBeTrue();
});

test('non owner cannot restore book', function () {
    $book = $this->createBookForUser($this->otherUser);

    expect($this->policy->restore($this->user, $book))->toBeFalse();
});

test('owner can force delete their book', function () {
    $book = $this->createBookForUser($this->user);

    expect($this->policy->forceDelete($this->user, $book))->toBeTrue();
});

test('non owner cannot force delete book', function () {
    $book = $this->createBookForUser($this->otherUser);

    expect($this->policy->forceDelete($this->user, $book))->toBeFalse();
});

test('policy methods return boolean values', function () {
    $book = $this->createBookForUser($this->user);

    $methods = [
        'viewAny' => [$this->user],
        'view' => [$this->user, $book],
        'create' => [$this->user],
        'update' => [$this->user, $book],
        'delete' => [$this->user, $book],
        'restore' => [$this->user, $book],
        'forceDelete' => [$this->user, $book],
    ];

    foreach ($methods as $method => $args) {
        $result = $this->policy->$method(...$args);
        expect($result)->toBeBool("Method {$method} should return a boolean value");
    }
});

test('null user cannot perform actions', function () {
    $book = $this->createBookForUser($this->user);

    // Test with null user (guest)
    expect($this->policy->viewAny(null))->toBeFalse();
    expect($this->policy->view(null, $book))->toBeFalse();
    expect($this->policy->create(null))->toBeFalse();
    expect($this->policy->update(null, $book))->toBeFalse();
    expect($this->policy->delete(null, $book))->toBeFalse();
    expect($this->policy->restore(null, $book))->toBeFalse();
    expect($this->policy->forceDelete(null, $book))->toBeFalse();
});

test('policy correctly identifies ownership', function () {
    $userBook = $this->createBookForUser($this->user);
    $otherUserBook = $this->createBookForUser($this->otherUser);

    // User can modify their own book
    expect($this->policy->update($this->user, $userBook))->toBeTrue();
    expect($this->policy->delete($this->user, $userBook))->toBeTrue();

    // User cannot modify other user's book
    expect($this->policy->update($this->user, $otherUserBook))->toBeFalse();
    expect($this->policy->delete($this->user, $otherUserBook))->toBeFalse();

    // Other user can modify their own book
    expect($this->policy->update($this->otherUser, $otherUserBook))->toBeTrue();
    expect($this->policy->delete($this->otherUser, $otherUserBook))->toBeTrue();

    // Other user cannot modify user's book
    expect($this->policy->update($this->otherUser, $userBook))->toBeFalse();
    expect($this->policy->delete($this->otherUser, $userBook))->toBeFalse();
});

test('policy works with different user types', function () {
    $verifiedUser = $this->createVerifiedUser();
    $unverifiedUser = $this->createUnverifiedUser();

    $verifiedUserBook = $this->createBookForUser($verifiedUser);
    $unverifiedUserBook = $this->createBookForUser($unverifiedUser);

    // Both verified and unverified users should have same permissions
    expect($this->policy->viewAny($verifiedUser))->toBeTrue();
    expect($this->policy->viewAny($unverifiedUser))->toBeTrue();

    expect($this->policy->create($verifiedUser))->toBeTrue();
    expect($this->policy->create($unverifiedUser))->toBeTrue();

    expect($this->policy->update($verifiedUser, $verifiedUserBook))->toBeTrue();
    expect($this->policy->update($unverifiedUser, $unverifiedUserBook))->toBeTrue();

    // Cross-user permissions should still be denied
    expect($this->policy->update($verifiedUser, $unverifiedUserBook))->toBeFalse();
    expect($this->policy->update($unverifiedUser, $verifiedUserBook))->toBeFalse();
});

test('policy handles edge cases', function () {
    // Test with different user IDs to ensure proper comparison
    $user1 = $this->createUser();
    $user2 = $this->createUser();

    $book1 = $this->createBookForUser($user1);
    $book2 = $this->createBookForUser($user2);

    // Ensure ID comparison works correctly
    expect($this->policy->update($user1, $book1))->toBeTrue();
    expect($this->policy->update($user1, $book2))->toBeFalse();
    expect($this->policy->update($user2, $book2))->toBeTrue();
    expect($this->policy->update($user2, $book1))->toBeFalse();
});
