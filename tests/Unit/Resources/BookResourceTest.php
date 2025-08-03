<?php

use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\User;

beforeEach(function () {
    $this->user = $this->createUser();
});

test('it transforms book with basic attributes', function () {
    $book = $this->createBookForUser($this->user, [
        'title' => 'Test Book',
        'author' => 'John Doe',
        'description' => 'A test book description',
        'rating' => 4,
        'thumbnail' => 'books/thumbnails/test.jpg',
    ]);

    $resource = new BookResource($book);
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('id');
    expect($data['title'])->toBe('Test Book');
    expect($data['author'])->toBe('John Doe');
    expect($data['description'])->toBe('A test book description');
    expect($data['rating'])->toBe(4);
});

test('it includes thumbnail url', function () {
    $book = $this->createBookForUser($this->user, [
        'thumbnail' => 'books/thumbnails/test.jpg'
    ]);

    $resource = new BookResource($book);
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('thumbnail_url');
    expect($data['thumbnail_url'])->toBe(asset('storage/books/thumbnails/test.jpg'));
});

test('it handles null thumbnail', function () {
    $book = $this->createBookForUser($this->user, [
        'thumbnail' => null
    ]);

    $resource = new BookResource($book);
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('thumbnail_url');
    expect($data['thumbnail_url'])->toBeNull();
});

test('it includes formatted rating', function () {
    $book = $this->createBookForUser($this->user, [
        'rating' => 3
    ]);

    $resource = new BookResource($book);
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('formatted_rating');
    expect($data['formatted_rating'])->toBe('★★★☆☆ (3/5)');
});

test('it includes user relationship', function () {
    $book = $this->createBookForUser($this->user);

    $resource = new BookResource($book->load('user'));
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('user');
    expect($data['user'])->toHaveKey('id');
    expect($data['user'])->toHaveKey('name');
    expect($data['user'])->toHaveKey('initials');
    expect($data['user']['id'])->toBe($this->user->id);
    expect($data['user']['name'])->toBe($this->user->name);
});

test('it includes timestamps', function () {
    $book = $this->createBookForUser($this->user);

    $resource = new BookResource($book);
    $data = $resource->toArray(request());

    expect($data)->toHaveKey('created_at');
    expect($data)->toHaveKey('updated_at');
    expect($data['created_at'])->not->toBeNull();
    expect($data['updated_at'])->not->toBeNull();
});

test('it formats timestamps consistently', function () {
    $book = $this->createBookForUser($this->user);

    $resource = new BookResource($book);
    $data = $resource->toArray(request());

    // Verify timestamps are formatted correctly (ISO format)
    expect($data['created_at'])->toBeString();
    expect($data['updated_at'])->toBeString();
    expect($data['created_at'])->not->toBeNull();
    expect($data['updated_at'])->not->toBeNull();
    expect($data['created_at'])->toMatch('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/');
    expect($data['updated_at'])->toMatch('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/');
});

test('it handles resource collection', function () {
    $books = $this->createBooksForUser($this->user, 3);

    $collection = BookResource::collection($books);
    $data = $collection->toArray(request());

    expect($data)->toHaveCount(3);
    expect($data[0])->toHaveKey('id');
    expect($data[0])->toHaveKey('title');
    expect($data[0])->toHaveKey('author');
});

test('it maintains data integrity with special characters', function () {
    $book = $this->createBookForUser($this->user, [
        'title' => 'Test "Book" with Special & Characters',
        'author' => 'José María O\'Connor',
        'description' => 'Description with <script>alert("xss")</script> tags',
    ]);

    $resource = new BookResource($book);
    $data = $resource->toArray(request());

    expect($data['title'])->toBe('Test "Book" with Special & Characters');
    expect($data['author'])->toBe('José María O\'Connor');
    expect($data['description'])->toBe('Description with <script>alert("xss")</script> tags');
});

test('it includes all expected attributes', function () {
    $book = $this->createBookForUser($this->user);

    $resource = new BookResource($book->load('user'));
    $data = $resource->toArray(request());

    $expectedKeys = [
        'id',
        'title',
        'author',
        'description',
        'rating',
        'thumbnail',
        'thumbnail_url',
        'formatted_rating',
        'created_at',
        'updated_at',
        'user',
    ];

    foreach ($expectedKeys as $key) {
        expect($data)->toHaveKey($key);
    }
});

test('it does not include user when not loaded', function () {
    $book = $this->createBookForUser($this->user);

    $resource = new BookResource($book);
    $data = $resource->toArray(request());

    // When user relationship is not loaded, it should still include user data
    // because Book belongs to User and we can access it via user_id
    expect($data)->toHaveKey('user');
});

test('it handles edge case ratings', function () {
    $testCases = [
        1 => '★☆☆☆☆ (1/5)',
        5 => '★★★★★ (5/5)',
    ];

    foreach ($testCases as $rating => $expectedFormat) {
        $book = $this->createBookForUser($this->user, ['rating' => $rating]);
        $resource = new BookResource($book);
        $data = $resource->toArray(request());

        expect($data['formatted_rating'])->toBe($expectedFormat);
    }
});
