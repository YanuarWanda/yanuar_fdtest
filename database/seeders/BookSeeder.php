<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $users = User::factory(5)->create();
        }

        $users->each(function (User $user) {
            $bookCount = rand(3, 8);

            Book::factory($bookCount)
                ->forUser($user)
                ->create();

            Book::factory(2)
                ->forUser($user)
                ->highRated()
                ->create();

            Book::factory(1)
                ->forUser($user)
                ->lowRated()
                ->create();
        });
    }
}
