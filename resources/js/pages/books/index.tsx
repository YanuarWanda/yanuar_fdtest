import { formatDate } from '@/lib/utils';
import { BreadcrumbItem, PaginatedLink, PaginatedResource } from '@/types';
import { UserResource } from '@/types/users';
import { Head, Link, router } from '@inertiajs/react';
import { Book, Calendar, ChevronLeft, ChevronRight, Plus, Search, Star, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

import PaginationInfo from '@/components/shared/pagination-info';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

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

interface BooksPageProps {
    books: PaginatedResource<BookResource>;
    filters: {
        search?: string;
        author?: string;
        rating?: string;
        date_from?: string;
        date_to?: string;
    };
    authors: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Books',
        href: route('books.index'),
    },
];

export default function BooksIndex({ books, filters, authors }: BooksPageProps) {
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

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleAuthorFilter = (value: string) => {
        if (value === getAuthorDisplayValue()) {
            return;
        }

        const url = new URL(window.location.href);

        if (value === 'all') {
            url.searchParams.delete('author');
        } else {
            url.searchParams.set('author', value);
        }

        const currentAuthor = filters.author || 'all';
        if (value !== currentAuthor) {
            url.searchParams.delete('page');
        }

        router.visit(url.toString(), {
            preserveState: true,
        });
    };

    const handleMinRatingFilter = (value: string) => {
        if (value === getMinRatingDisplayValue()) {
            return;
        }

        const url = new URL(window.location.href);

        if (value === 'all') {
            url.searchParams.delete('rating');
        } else {
            url.searchParams.set('rating', value);
        }

        const currentRating = filters.rating || 'all';
        if (value !== currentRating) {
            url.searchParams.delete('page');
        }

        router.visit(url.toString(), {
            preserveState: true,
        });
    };

    const handleDateFromFilter = (value: string) => {
        const url = new URL(window.location.href);
        const currentDateFrom = filters.date_from || '';

        if (value) {
            url.searchParams.set('date_from', value);
        } else {
            url.searchParams.delete('date_from');
        }

        if (value !== currentDateFrom) {
            url.searchParams.delete('page');
        }

        router.visit(url.toString(), {
            preserveState: true,
        });
    };

    const handleDateToFilter = (value: string) => {
        const url = new URL(window.location.href);
        const currentDateTo = filters.date_to || '';

        if (value) {
            url.searchParams.set('date_to', value);
        } else {
            url.searchParams.delete('date_to');
        }

        // Only reset page if date filter actually changed
        if (value !== currentDateTo) {
            url.searchParams.delete('page');
        }

        router.visit(url.toString(), {
            preserveState: true,
        });
    };

    const clearFilters = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('search');
        url.searchParams.delete('author');
        url.searchParams.delete('rating');
        url.searchParams.delete('date_from');
        url.searchParams.delete('date_to');
        url.searchParams.delete('page');

        setSearchTerm('');

        router.visit(url.toString(), {
            preserveState: true,
        });
    };

    const getAuthorDisplayValue = () => {
        return filters.author || 'all';
    };

    const getMinRatingDisplayValue = () => {
        return filters.rating || 'all';
    };

    const navigateToCreate = () => router.get(route('books.create'));
    const navigateToView = (book: BookResource) => router.get(route('books.show', book.id));
    const navigateToEdit = (book: BookResource) => router.get(route('books.edit', book.id));

    const hasActiveFilters = Boolean(filters.search || filters.author || filters.rating || filters.date_from || filters.date_to);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Books" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Books</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your personal book collection</p>
                    </div>
                    <Button onClick={navigateToCreate} className="flex cursor-pointer items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Book
                    </Button>
                </div>

                <BookFilters
                    search={searchTerm}
                    selectedAuthor={getAuthorDisplayValue()}
                    minRating={getMinRatingDisplayValue()}
                    dateFrom={filters.date_from || ''}
                    dateTo={filters.date_to || ''}
                    authors={authors}
                    hasActiveFilters={hasActiveFilters}
                    onSearchChange={setSearchTerm}
                    onAuthorChange={handleAuthorFilter}
                    onMinRatingChange={handleMinRatingFilter}
                    onDateFromChange={handleDateFromFilter}
                    onDateToChange={handleDateToFilter}
                    onClearFilters={clearFilters}
                    onClearSearch={handleClearSearch}
                />

                <div className="hidden md:block">
                    {books.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {books.data.map((book: BookResource) => (
                                <BookCard key={book.id} book={book} onView={navigateToView} onEdit={navigateToEdit} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState hasFilters={hasActiveFilters} onCreate={navigateToCreate} onClearFilters={clearFilters} />
                    )}
                </div>

                <div className="space-y-4 md:hidden">
                    {books.data.length > 0 ? (
                        books.data.map((book: BookResource) => (
                            <BookCardMobile key={book.id} book={book} onView={navigateToView} onEdit={navigateToEdit} />
                        ))
                    ) : (
                        <EmptyStateMobile hasFilters={hasActiveFilters} onCreate={navigateToCreate} onClearFilters={clearFilters} />
                    )}
                </div>

                {books.meta.links && <Pagination links={books.meta.links} filters={filters} />}

                {books.meta.total > 0 && <PaginationInfo meta={books.meta} resourceName="Books" />}
            </div>
        </AppLayout>
    );
}

interface BookFiltersProps {
    search: string;
    selectedAuthor: string;
    minRating: string;
    dateFrom: string;
    dateTo: string;
    authors: string[];
    hasActiveFilters: boolean;
    onSearchChange: (value: string) => void;
    onAuthorChange: (value: string) => void;
    onMinRatingChange: (value: string) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    onClearFilters: () => void;
    onClearSearch: () => void;
}

function BookFilters({
    search,
    selectedAuthor,
    minRating,
    dateFrom,
    dateTo,
    authors,
    hasActiveFilters,
    onSearchChange,
    onAuthorChange,
    onMinRatingChange,
    onDateFromChange,
    onDateToChange,
    onClearFilters,
    onClearSearch,
}: BookFiltersProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
            <div className="relative flex-1">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pr-9 pl-9"
                />
                {search && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClearSearch}
                        className="absolute top-1 right-1 h-7 w-7 p-0 hover:bg-transparent"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="w-full sm:w-48">
                <Select value={selectedAuthor} onValueChange={onAuthorChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by author" />
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
            </div>

            <div className="w-full sm:w-48">
                <Select value={minRating} onValueChange={onMinRatingChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by rating" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Rating</SelectItem>
                        {Array.from({ length: 5 }, (_, i) => {
                            const rating = i + 1;
                            return (
                                <SelectItem key={rating} value={rating.toString()}>
                                    {rating} Stars
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1 sm:w-36">
                <label className="text-xs text-gray-600 dark:text-gray-400">From Date</label>
                <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => onDateFromChange(e.target.value)}
                    className="w-full"
                    title="Filter books created from this date"
                />
            </div>

            <div className="flex flex-col gap-1 sm:w-36">
                <label className="text-xs text-gray-600 dark:text-gray-400">To Date</label>
                <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => onDateToChange(e.target.value)}
                    className="w-full"
                    title="Filter books created until this date"
                />
            </div>

            {hasActiveFilters && (
                <Button variant="outline" onClick={onClearFilters} className="cursor-pointer whitespace-nowrap">
                    Clear Filters
                </Button>
            )}
        </div>
    );
}

interface BookCardProps {
    book: BookResource;
    onView: (book: BookResource) => void;
    onEdit: (book: BookResource) => void;
}

function BookCard({ book, onView, onEdit }: BookCardProps) {
    return (
        <Card className="group cursor-pointer transition-shadow hover:shadow-lg">
            <div onClick={() => onView(book)}>
                <CardHeader className="pb-3">
                    <BookThumbnail book={book} size="large" />
                    <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{book.description}</p>
                    <StarRating rating={book.rating} size="medium" />
                    <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1 h-3 w-3" />
                        Added {formatDate(book.created_at)}
                    </div>
                </CardContent>
            </div>
            <div className="px-6 pb-4">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(book);
                        }}
                        className="flex-1"
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(book);
                        }}
                        className="flex-1"
                    >
                        View
                    </Button>
                </div>
            </div>
        </Card>
    );
}

interface BookCardMobileProps {
    book: BookResource;
    onView: (book: BookResource) => void;
    onEdit: (book: BookResource) => void;
}

function BookCardMobile({ book, onView, onEdit }: BookCardMobileProps) {
    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardContent className="px-4">
                <div className="flex gap-4">
                    <BookThumbnail book={book} size="small" />
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-gray-900 dark:text-gray-100">{book.title}</h3>
                        <p className="truncate text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                        <StarRating rating={book.rating} size="small" />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Added {formatDate(book.created_at)}</p>
                    </div>
                </div>
                <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(book)} className="flex-1">
                        Edit
                    </Button>
                    <Button size="sm" onClick={() => onView(book)} className="flex-1">
                        View
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface BookThumbnailProps {
    book: BookResource;
    size: 'small' | 'medium' | 'large';
}

function BookThumbnail({ book, size }: BookThumbnailProps) {
    const sizeClasses = {
        small: 'h-20 w-16',
        medium: 'h-32 w-24',
        large: 'h-48 w-full',
    };

    const iconSizes = {
        small: 'h-6 w-6',
        medium: 'h-8 w-8',
        large: 'h-12 w-12',
    };

    if (book.thumbnail_url) {
        return (
            <img
                src={book.thumbnail_url}
                alt={book.title}
                className={`${sizeClasses[size]} ${size === 'large' ? 'mb-3' : ''} ${size === 'small' ? 'flex-shrink-0' : ''} rounded${size === 'large' ? '-md' : ''} object-cover`}
            />
        );
    }

    return (
        <div
            className={`${sizeClasses[size]} ${size === 'large' ? 'mb-3' : ''} ${size === 'small' ? 'flex-shrink-0' : ''} flex items-center justify-center rounded${size === 'large' ? '-md' : ''} bg-gray-100 dark:bg-gray-800`}
        >
            <Book className={`${iconSizes[size]} text-gray-400`} />
        </div>
    );
}

interface StarRatingProps {
    rating: number;
    size: 'small' | 'medium';
}

function StarRating({ rating, size }: StarRatingProps) {
    const starSize = size === 'small' ? 'h-3 w-3' : 'h-4 w-4';
    const textSize = size === 'small' ? 'text-xs' : 'text-sm';
    const margin = size === 'small' ? 'mt-1' : 'mb-3';

    return (
        <div className={`${margin} flex items-center ${size === 'medium' ? 'justify-between' : 'gap-1'}`}>
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`${starSize} ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className={`ml-1 ${textSize} text-gray-600 dark:text-gray-400`}>({rating}/5)</span>
            </div>
        </div>
    );
}

interface EmptyStateProps {
    hasFilters: boolean;
    onCreate: () => void;
    onClearFilters: () => void;
}

function EmptyState({ hasFilters, onCreate, onClearFilters }: EmptyStateProps) {
    return (
        <Card>
            <CardContent className="py-12 text-center">
                <Book className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">{hasFilters ? 'No books found' : 'No books yet'}</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {hasFilters ? 'Try adjusting your search criteria.' : 'Start building your personal library by adding your first book.'}
                </p>
                {!hasFilters ? (
                    <Button onClick={onCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Book
                    </Button>
                ) : (
                    <Button variant="outline" onClick={onClearFilters}>
                        Clear Filters
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function EmptyStateMobile({ hasFilters, onCreate }: EmptyStateProps) {
    return (
        <Card>
            <CardContent className="py-8 text-center">
                <Book className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <h3 className="mb-1 font-medium text-gray-900 dark:text-gray-100">{hasFilters ? 'No books found' : 'No books yet'}</h3>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    {hasFilters ? 'Try adjusting your filters.' : 'Add your first book to get started.'}
                </p>
                {!hasFilters && (
                    <Button size="sm" onClick={onCreate}>
                        <Plus className="mr-1 h-3 w-3" />
                        Add Book
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function Pagination({
    links,
    filters,
}: {
    links: PaginatedLink[];
    filters: { search?: string; author?: string; rating?: string; date_from?: string; date_to?: string };
}) {
    const getPaginationContent = (label: string) => {
        const cleanLabel = label
            .replace(/&laquo;/g, '')
            .replace(/&raquo;/g, '')
            .replace(/&hellip;/g, '...')
            .trim();

        switch (cleanLabel) {
            case 'Previous':
                return <ChevronLeft className="h-4 w-4" />;
            case 'Next':
                return <ChevronRight className="h-4 w-4" />;
            case '...':
                return <span>...</span>;
            default:
                return <span>{cleanLabel}</span>;
        }
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
        if (filters.date_from) {
            url.searchParams.set('date_from', filters.date_from);
        }
        if (filters.date_to) {
            url.searchParams.set('date_to', filters.date_to);
        }

        return url.toString();
    };
    return (
        <div className="flex items-center justify-center gap-1 px-2 sm:gap-2">
            {links.map((link, index) => (
                <Button
                    key={index}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    asChild={!!link.url}
                    disabled={!link.url}
                    className="h-8 min-w-[32px] text-xs sm:h-9 sm:min-w-[40px] sm:text-sm"
                >
                    {link.url ? <Link href={getUrlWithFilters(link.url)}>{getPaginationContent(link.label)}</Link> : getPaginationContent(link.label)}
                </Button>
            ))}
        </div>
    );
}
