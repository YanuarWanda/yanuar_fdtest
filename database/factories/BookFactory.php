<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $authors = [
            'J.K. Rowling',
            'Stephen King',
            'Agatha Christie',
            'J.R.R. Tolkien',
            'George R.R. Martin',
            'Neil Gaiman',
            'Margaret Atwood',
            'Haruki Murakami',
            'Paulo Coelho',
            'Dan Brown',
            'John Grisham',
            'Ernest Hemingway',
            'F. Scott Fitzgerald',
            'Jane Austen',
            'Mark Twain',
            'Charles Dickens'
        ];

        return [
            'user_id' => User::factory(),
            'title' => $this->generateBookTitle(),
            'author' => $this->faker->randomElement($authors),
            'description' => $this->generateDescription(),
            'thumbnail' => null, // Will be set separately if needed
            'rating' => $this->faker->numberBetween(1, 5),
        ];
    }

    /**
     * Generate a realistic book title.
     */
    private function generateBookTitle(): string
    {
        $titlePatterns = [
            'The {{adjective}} {{noun}}',
            '{{noun}} of {{noun}}',
            'The {{noun}} and the {{noun}}',
            '{{adjective}} {{noun}}',
            'The Last {{noun}}',
            'A {{adjective}} {{noun}}',
            'The {{noun}} Chronicles',
            'Beyond the {{noun}}',
            'Tales of {{adjective}} {{noun}}',
            'The {{noun}} Diaries'
        ];

        $adjectives = [
            'Silent',
            'Hidden',
            'Lost',
            'Ancient',
            'Forgotten',
            'Secret',
            'Dark',
            'Golden',
            'Mysterious',
            'Enchanted',
            'Broken',
            'Sacred',
            'Eternal',
            'Wild',
            'Burning'
        ];

        $nouns = [
            'Shadow',
            'Kingdom',
            'Warrior',
            'Dragon',
            'Castle',
            'Forest',
            'Ocean',
            'Mountain',
            'Journey',
            'Quest',
            'Story',
            'Dream',
            'Heart',
            'Soul',
            'Mind',
            'Spirit',
            'Dawn',
            'Night',
            'Star',
            'Moon',
            'Sun',
            'Fire',
            'Ice',
            'Wind',
            'Storm',
            'River'
        ];

        $pattern = $this->faker->randomElement($titlePatterns);
        $title = str_replace('{{adjective}}', $this->faker->randomElement($adjectives), $pattern);
        $title = str_replace('{{noun}}', $this->faker->randomElement($nouns), $title);

        return $title;
    }

    /**
     * Generate a realistic book description.
     */
    private function generateDescription(): string
    {
        $descriptions = [
            'A gripping tale that will keep you on the edge of your seat from beginning to end.',
            'An epic adventure through mystical lands filled with danger and wonder.',
            'A heartwarming story about love, loss, and the power of human connection.',
            'A thrilling mystery that unravels dark secrets hidden for generations.',
            'An inspiring journey of self-discovery and personal transformation.',
            'A captivating narrative that explores the depths of human nature.',
            'A beautifully written story that celebrates the triumph of hope over despair.',
            'An unforgettable tale of courage, friendship, and the bonds that unite us.'
        ];

        return $this->faker->randomElement($descriptions) . ' ' .
            $this->faker->paragraph(3) . ' ' .
            'This compelling story will resonate with readers long after the final page.';
    }

    /**
     * Create a book with a high rating.
     */
    public function highRated(): static
    {
        return $this->state(fn(array $attributes) => [
            'rating' => $this->faker->numberBetween(4, 5),
        ]);
    }

    /**
     * Create a book with a low rating.
     */
    public function lowRated(): static
    {
        return $this->state(fn(array $attributes) => [
            'rating' => $this->faker->numberBetween(1, 2),
        ]);
    }

    /**
     * Create a book with a specific author.
     */
    public function byAuthor(string $author): static
    {
        return $this->state(fn(array $attributes) => [
            'author' => $author,
        ]);
    }

    /**
     * Create a book for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn(array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Create a book with a thumbnail.
     */
    public function withThumbnail(): static
    {
        return $this->state(fn(array $attributes) => [
            'thumbnail' => 'books/thumbnails/test-thumbnail.jpg',
        ]);
    }

    /**
     * Create a book with specific creation date.
     */
    public function createdAt(string $date): static
    {
        return $this->state(fn(array $attributes) => [
            'created_at' => $date,
            'updated_at' => $date,
        ]);
    }

    /**
     * Create a book for testing search functionality.
     */
    public function searchable(string $title, string $author): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => $title,
            'author' => $author,
        ]);
    }
}
