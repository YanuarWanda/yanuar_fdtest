<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's initials.
     */
    public function getInitialsAttribute(): string
    {
        if (empty($this->name)) {
            return '';
        }

        $words = preg_split('/\s+/', trim($this->name));
        $words = array_filter($words);

        if (empty($words)) {
            return '';
        }

        $initials = '';
        $count = 0;

        foreach ($words as $word) {
            if (!empty($word) && $count < 2) {
                $initials .= strtoupper(substr($word, 0, 1));
                $count++;
            }
        }

        return $initials;
    }

    /**
     * Scope a query to search users by name or email.
     */
    public function scopeSearch($query, ?string $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->whereRaw('LOWER(name) LIKE LOWER(?)', ["%{$search}%"])
                ->orWhereRaw('LOWER(email) LIKE LOWER(?)', ["%{$search}%"]);
        });
    }

    /**
     * Scope a query to filter users by verification status.
     */
    public function scopeByStatus($query, ?string $status)
    {
        if (empty($status)) {
            return $query;
        }

        return match ($status) {
            'verified' => $query->whereNotNull('email_verified_at'),
            'unverified' => $query->whereNull('email_verified_at'),
            default => $query,
        };
    }

    /**
     * Scope a query to get users with basic information.
     */
    public function scopeWithBasicInfo($query)
    {
        return $query->select('id', 'name', 'email', 'email_verified_at', 'created_at');
    }

    /**
     * Get the books for the user.
     */
    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }
}
