<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');

        // Create the main test user with known credentials
        $this->command->info('👤 Creating main test user...');
        $mainUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@bookmanagement.com',
            'email_verified_at' => now(),
        ]);
        $this->command->info("✅ Main user created: {$mainUser->email} (password: password)");

        // Create 9 additional random users
        $this->command->info('👥 Creating 9 additional users...');
        $users = User::factory(9)->create([
            'email_verified_at' => now(),
        ]);

        // Combine all users (main user + 9 others)
        $allUsers = collect([$mainUser])->concat($users);
        $this->command->info("✅ Total users created: {$allUsers->count()}");

        // Create 100 unique books distributed among all users
        $this->command->info('📚 Creating 100 unique books...');

        // Distribute books among users (10-12 books per user approximately)
        $booksPerUser = [12, 11, 10, 10, 10, 10, 10, 10, 9, 8]; // Total: 100 books

        foreach ($allUsers as $index => $user) {
            $bookCount = $booksPerUser[$index];

            // Create books for this user with varied ratings and dates
            Book::factory($bookCount)
                ->forUser($user)
                ->create()
                ->each(function ($book, $bookIndex) use ($user, $bookCount) {
                    // Add some variety to creation dates (last 2 years)
                    $randomDate = now()->subDays(rand(1, 730));
                    $book->update([
                        'created_at' => $randomDate,
                        'updated_at' => $randomDate,
                    ]);
                });

            $this->command->info("📖 Created {$bookCount} books for {$user->name}");
        }

        // Create some special books with known data for testing
        $this->command->info('📋 Creating special test books...');

        // High-rated classics
        Book::factory()->forUser($mainUser)->create([
            'title' => 'The Great Gatsby',
            'author' => 'F. Scott Fitzgerald',
            'description' => 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
            'rating' => 5,
        ]);

        Book::factory()->forUser($mainUser)->create([
            'title' => 'To Kill a Mockingbird',
            'author' => 'Harper Lee',
            'description' => 'A gripping tale of racial injustice and childhood innocence in the American South.',
            'rating' => 5,
        ]);

        // Popular fantasy series
        Book::factory()->forUser($users->random())->create([
            'title' => 'Harry Potter and the Philosopher\'s Stone',
            'author' => 'J.K. Rowling',
            'description' => 'The magical story of a young wizard discovering his destiny at Hogwarts School of Witchcraft and Wizardry.',
            'rating' => 5,
        ]);

        Book::factory()->forUser($users->random())->create([
            'title' => 'The Fellowship of the Ring',
            'author' => 'J.R.R. Tolkien',
            'description' => 'The first volume of the epic Lord of the Rings trilogy, following Frodo\'s quest to destroy the One Ring.',
            'rating' => 5,
        ]);

        // Modern bestsellers
        Book::factory()->forUser($users->random())->create([
            'title' => 'The Da Vinci Code',
            'author' => 'Dan Brown',
            'description' => 'A thrilling mystery involving ancient secrets, religious conspiracies, and hidden codes.',
            'rating' => 4,
        ]);

        $totalBooks = Book::count();
        $this->command->info("✅ Total books created: {$totalBooks}");

        $this->command->info('🎉 Database seeding completed successfully!');
        $this->command->info('');
        $this->command->info('📋 Seeding Summary:');
        $this->command->info("   👤 Users: {$allUsers->count()}");
        $this->command->info("   📚 Books: {$totalBooks}");
        $this->command->info('');
        $this->command->info('🔑 Test Credentials:');
        $this->command->info('   Email: admin@bookmanagement.com');
        $this->command->info('   Password: password');
    }
}
