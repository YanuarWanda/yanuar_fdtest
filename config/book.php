<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Book Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for book management.
    |
    */

    'defaults' => [
        'rating' => 1,
        'thumbnail_disk' => 'public',
        'thumbnail_path' => 'books/thumbnails',
    ],

    'validation' => [
        'title' => [
            'required',
            'string',
            'max:255',
        ],
        'author' => [
            'required',
            'string',
            'max:255',
        ],
        'description' => [
            'required',
            'string',
            'max:2000',
        ],
        'rating' => [
            'required',
            'integer',
            'min:1',
            'max:5',
        ],
        'thumbnail' => [
            'nullable',
            'image',
            'mimes:jpeg,png,jpg,webp',
            'max:2048', // 2MB
        ],
    ],

    'pagination' => [
        'per_page' => 10,
        'max_per_page' => 50,
    ],

    'rating' => [
        'min' => 1,
        'max' => 5,
        'step' => 1,
        'stars' => [
            'full' => '★',
            'empty' => '☆',
        ],
    ],
];
