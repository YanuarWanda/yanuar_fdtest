<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('books/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('books/thumbnails', 'public');
            $validated['thumbnail'] = $path;
        }

        $validated['user_id'] = Auth::id();

        $book = Book::create($validated);

        return redirect()->route('books.show', $book)->with('success', 'Book created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book): Response
    {
        if ($book->user_id !== Auth::id()) {
            abort(404);
        }

        return Inertia::render('books/show', [
            'book' => new BookResource($book),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book): Response
    {
        if ($book->user_id !== Auth::id()) {
            abort(404);
        }

        return Inertia::render('books/edit', [
            'book' => new BookResource($book),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Handles both PUT and PATCH requests.
     */
    public function update(Request $request, Book $book): \Illuminate\Http\RedirectResponse
    {
        if ($book->user_id !== Auth::id()) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($book->thumbnail) {
                Storage::disk('public')->delete($book->thumbnail);
            }

            $path = $request->file('thumbnail')->store('books/thumbnails', 'public');
            $validated['thumbnail'] = $path;

            Log::info('File uploaded successfully:', ['path' => $path]);
        } else {
            unset($validated['thumbnail']);
        }

        $book->update($validated);

        return redirect()->route('books.show', $book)->with('success', 'Book updated successfully!');
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
