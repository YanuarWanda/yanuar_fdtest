<?php

namespace Tests;

use App\Models\User;
use App\Models\Book;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait TestHelpers
{
    /**
     * Create a test user with optional attributes.
     */
    protected function createUser(array $attributes = []): User
    {
        return User::factory()->create($attributes);
    }

    /**
     * Create a verified test user.
     */
    protected function createVerifiedUser(array $attributes = []): User
    {
        return User::factory()->verified()->create($attributes);
    }

    /**
     * Create an unverified test user.
     */
    protected function createUnverifiedUser(array $attributes = []): User
    {
        return User::factory()->unverified()->create($attributes);
    }

    /**
     * Create a test book for a specific user.
     */
    protected function createBookForUser(User $user, array $attributes = []): Book
    {
        return Book::factory()->for($user)->create($attributes);
    }

    /**
     * Create multiple books for a user.
     */
    protected function createBooksForUser(User $user, int $count = 3, array $attributes = []): \Illuminate\Database\Eloquent\Collection
    {
        return Book::factory()->for($user)->count($count)->create($attributes);
    }

    /**
     * Create a fake image file for testing uploads.
     */
    protected function createFakeImage(string $name = 'test-image.jpg', int $kilobytes = 100): UploadedFile
    {
        return UploadedFile::fake()->image($name, 800, 600)->size($kilobytes);
    }

    /**
     * Create a fake non-image file for testing validation.
     */
    protected function createFakeDocument(string $name = 'document.pdf'): UploadedFile
    {
        return UploadedFile::fake()->create($name, 100, 'application/pdf');
    }

    /**
     * Set up storage fake for file testing.
     */
    protected function setupStorageFake(): void
    {
        Storage::fake('public');
    }

    /**
     * Assert that a file exists in fake storage.
     */
    protected function assertFileExistsInStorage(string $path): void
    {
        $this->assertTrue(Storage::disk('public')->exists($path), "File {$path} does not exist in storage.");
    }

    /**
     * Assert that a file doesn't exist in fake storage.
     */
    protected function assertFileDoesntExistInStorage(string $path): void
    {
        $this->assertFalse(Storage::disk('public')->exists($path), "File {$path} should not exist in storage.");
    }

    /**
     * Create test data for book filtering.
     */
    protected function createFilterTestData(): array
    {
        $user = $this->createUser();

        return [
            'user' => $user,
            'books' => [
                // Book 1: Rating 5, Author "John Doe"
                $this->createBookForUser($user, [
                    'title' => 'Laravel Advanced',
                    'author' => 'John Doe',
                    'rating' => 5,
                    'created_at' => now()->subDays(1),
                ]),
                // Book 2: Rating 3, Author "Jane Smith"
                $this->createBookForUser($user, [
                    'title' => 'PHP Basics',
                    'author' => 'Jane Smith',
                    'rating' => 3,
                    'created_at' => now()->subDays(3),
                ]),
                // Book 3: Rating 4, Author "John Doe"
                $this->createBookForUser($user, [
                    'title' => 'Vue.js Guide',
                    'author' => 'John Doe',
                    'rating' => 4,
                    'created_at' => now()->subDays(5),
                ]),
            ]
        ];
    }

    /**
     * Create book with specific date for date filtering tests.
     */
    protected function createBookWithDate(User $user, string $date, array $attributes = []): Book
    {
        return $this->createBookForUser($user, array_merge([
            'created_at' => $date,
        ], $attributes));
    }
}
