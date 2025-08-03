import { formatDate } from '@/lib/utils';
import { PaginatedLink, PaginatedResource, type SharedData } from '@/types';
import { UserResource } from '@/types/users';
import { Head, Link, router } from '@inertiajs/react';
import { Book, ChevronLeft, ChevronRight, LogIn, Search, Star, UserPlus, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookResource {
    id: number;
    title: string;
    author: string;
    description: string;
    rating: number;
    formatted_rating: string;
    thumbnail: string | null;
    thumbnail_url: string | null;
    user: UserResource;
    created_at: string;
    updated_at: string;
}

interface WelcomePageProps extends SharedData {
    books: PaginatedResource<BookResource>;
    filters: {
        search?: string;
        author?: string;
        rating?: string;
    };
    authors: string[];
}

export default function Welcome({ auth, books, filters, authors }: WelcomePageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = useCallback(
        (value: string) => {
            if (value.trim() === (filters.search || '')) {
                return;
            }

            const url = new URL(window.location.href);

            if (value.trim()) {
                url.searchParams.set('search', value.trim());
            } else {
                url.searchParams.delete('search');
            }

            url.searchParams.delete('page');

            router.visit(url.toString(), {
                preserveState: true,
            });
        },
        [filters.search],
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, handleSearch]);

    const handleAuthorFilter = (value: string) => {
        // Don't navigate if the filter hasn't changed
        if (value === getAuthorDisplayValue()) {
            return;
        }

        const url = new URL(window.location.href);

        if (value === 'all') {
            url.searchParams.delete('author');
        } else {
            url.searchParams.set('author', value);
        }

        url.searchParams.delete('page');

        router.visit(url.toString(), {
            preserveState: true,
        });
    };

    const handleRatingFilter = (value: string) => {
        // Don't navigate if the filter hasn't changed
        if (value === getRatingDisplayValue()) {
            return;
        }

        const url = new URL(window.location.href);

        if (value === 'all') {
            url.searchParams.delete('rating');
        } else {
            url.searchParams.set('rating', value);
        }

        url.searchParams.delete('page');

        router.visit(url.toString(), {
            preserveState: true,
        });
    };

    const clearFilters = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('search');
        url.searchParams.delete('author');
        url.searchParams.delete('rating');
        url.searchParams.delete('page');

        setSearchTerm('');

        router.visit(url.toString(), {
            preserveState: true,
        });
    };

    const getAuthorDisplayValue = () => {
        return filters.author || 'all';
    };

    const getRatingDisplayValue = () => {
        return filters.rating || 'all';
    };

    const hasActiveFilters = Boolean(filters.search || filters.author || filters.rating);

    return (
        <>
            <Head title="Welcome - Book Collection">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="bg-white shadow-sm dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Book className="h-8 w-8 text-blue-600" />
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Book Collection</h1>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <LogIn className="h-4 w-4" />
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Discover Amazing Books</h2>
                        <p className="text-gray-600 dark:text-gray-400">Browse through our collection of books shared by our community</p>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Search & Filter Books
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 md:flex-row md:items-end">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Search books by title or author..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-4 md:flex-row md:gap-2">
                                    <Select value={getAuthorDisplayValue()} onValueChange={handleAuthorFilter}>
                                        <SelectTrigger className="w-full md:w-48">
                                            <SelectValue placeholder="All Authors" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Authors</SelectItem>
                                            {authors.map((author) => (
                                                <SelectItem key={author} value={author}>
                                                    {author}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={getRatingDisplayValue()} onValueChange={handleRatingFilter}>
                                        <SelectTrigger className="w-full md:w-48">
                                            <SelectValue placeholder="All Ratings" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Ratings</SelectItem>
                                            {Array.from({ length: 5 }, (_, i) => {
                                                const rating = i + 1;
                                                return (
                                                    <SelectItem key={rating} value={rating.toString()}>
                                                        {rating} Star{rating !== 1 ? 's' : ''}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {hasActiveFilters && (
                                        <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                                            <X className="h-4 w-4" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {books.data.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>

                    {books.data.length === 0 && (
                        <div className="py-12 text-center">
                            <Book className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No books found</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {hasActiveFilters ? 'Try adjusting your filters to see more results.' : 'No books have been added yet.'}
                            </p>
                        </div>
                    )}

                    {books.data.length > 0 && books.meta.links && (
                        <div className="mt-8 flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Showing books from our collection</div>
                            <div className="flex items-center gap-2">
                                {Array.isArray(books.meta.links) &&
                                    books.meta.links.map((link, index) => <PaginationButton key={index} link={link} filters={filters} />)}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

interface BookCardProps {
    book: BookResource;
}

function BookCard({ book }: BookCardProps) {
    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-800">
                {book.thumbnail_url ? (
                    <img src={book.thumbnail_url} alt={book.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Book className="h-16 w-16 text-gray-400" />
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="mb-1 line-clamp-2 text-lg font-semibold">{book.title}</h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                <div className="mb-2 flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < book.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">({book.rating})</span>
                </div>
                <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{book.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>Created by {book.user.name}</span>
                    <span>{formatDate(book.created_at)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

interface PaginationButtonProps {
    link: PaginatedLink;
    filters: {
        search?: string;
        author?: string;
        rating?: string;
    };
}

function PaginationButton({ link, filters }: PaginationButtonProps) {
    const getPaginationContent = (label: string) => {
        if (label.includes('Previous')) {
            return <ChevronLeft className="h-4 w-4" />;
        }
        if (label.includes('Next')) {
            return <ChevronRight className="h-4 w-4" />;
        }
        return label;
    };

    const getUrlWithFilters = (baseUrl: string) => {
        const url = new URL(baseUrl);

        // Preserve current filters
        if (filters.search) {
            url.searchParams.set('search', filters.search);
        }
        if (filters.author) {
            url.searchParams.set('author', filters.author);
        }
        if (filters.rating) {
            url.searchParams.set('rating', filters.rating);
        }

        return url.toString();
    };

    if (!link.url) {
        return <span className="flex h-8 w-8 items-center justify-center text-gray-400">{getPaginationContent(link.label)}</span>;
    }

    return (
        <Link
            href={getUrlWithFilters(link.url)}
            className={`flex h-8 w-8 items-center justify-center rounded text-sm transition-colors ${
                link.active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
        >
            {getPaginationContent(link.label)}
        </Link>
    );
}
