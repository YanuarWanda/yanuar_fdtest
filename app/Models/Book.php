<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'author',
        'description',
        'thumbnail',
        'rating',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the book.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full URL for the book thumbnail.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) {
            return null;
        }

        return asset('storage/' . $this->thumbnail);
    }

    /**
     * Scope a query to only include books by a specific author.
     */
    public function scopeByAuthor(Builder $query, ?string $author): Builder
    {
        if (empty($author)) {
            return $query;
        }

        return $query->where('author', 'ILIKE', "%{$author}%");
    }

    /**
     * Scope a query to only include books with a specific rating.
     */
    public function scopeWithRating(Builder $query, ?int $rating): Builder
    {
        if (empty($rating)) {
            return $query;
        }

        return $query->where('rating', '=', $rating);
    }

    /**
     * Scope a query to filter books by date created range.
     */
    public function scopeByDateCreated(Builder $query, ?string $dateFrom = null, ?string $dateTo = null): Builder
    {
        if (empty($dateFrom) && empty($dateTo)) {
            return $query;
        }

        if (!empty($dateFrom) && !empty($dateTo)) {
            // Both dates provided - filter between range
            return $query->whereBetween('created_at', [
                $dateFrom . ' 00:00:00',
                $dateTo . ' 23:59:59'
            ]);
        }

        if (!empty($dateFrom)) {
            // Only from date - filter from date onwards
            return $query->where('created_at', '>=', $dateFrom . ' 00:00:00');
        }

        if (!empty($dateTo)) {
            // Only to date - filter up to date
            return $query->where('created_at', '<=', $dateTo . ' 23:59:59');
        }

        return $query;
    }

    /**
     * Scope a query to search books by title or author.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($query) use ($search) {
            $query->where('title', 'ILIKE', "%{$search}%")
                ->orWhere('author', 'ILIKE', "%{$search}%");
        });
    }

    /**
     * Scope a query to only include books owned by a specific user.
     */
    public function scopeOwnedBy(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to include the user relationship.
     */
    public function scopeWithUser(Builder $query): Builder
    {
        return $query->with('user');
    }

    /**
     * Scope a query to order books by creation date (newest first).
     */
    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Scope a query to get books with all applied filters.
     */
    public function scopeFiltered(Builder $query, array $filters = []): Builder
    {
        return $query
            ->search($filters['search'] ?? null)
            ->byAuthor($filters['author'] ?? null)
            ->withRating($filters['rating'] ?? null)
            ->byDateCreated($filters['date_from'] ?? null, $filters['date_to'] ?? null);
    }

    /**
     * Get formatted rating with stars.
     */
    public function getFormattedRatingAttribute(): string
    {
        $rating = $this->rating;
        $fullStars = $rating;
        $emptyStars = 5 - $fullStars;

        return str_repeat('★', $fullStars) .
            str_repeat('☆', $emptyStars) .
            " ({$rating}/5)";
    }
}
