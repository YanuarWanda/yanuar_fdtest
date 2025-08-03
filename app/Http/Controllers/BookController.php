<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|AnonymousResourceCollection
    {
        $filters = $request->only(['search', 'author', 'rating']);

        $perPage = min(
            $request->get('per_page', config('book.pagination.per_page')),
            config('book.pagination.max_per_page')
        );

        $books = Book::withUser()
            ->ownedBy(Auth::id())
            ->filtered($filters)
            ->latest()
            ->paginate($perPage);

        return Inertia::render('books/index', [
            'books' => BookResource::collection($books),
            'filters' => $filters,
            'authors' => $this->getAuthorsForUser(Auth::id()),
        ]);
    }

    /**
     * Get all unique authors for the authenticated user's books.
     */
    private function getAuthorsForUser(int $userId): array
    {
        return Book::where('user_id', $userId)
            ->distinct()
            ->pluck('author')
            ->filter()
            ->sort()
            ->values()
            ->toArray();
    }
}
