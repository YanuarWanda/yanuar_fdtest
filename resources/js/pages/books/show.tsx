import { formatDate } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { UserResource } from '@/types/users';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Book, Calendar, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface BookShowProps {
    book: {
        data: BookResource;
    };
}

export default function BookShow({ book }: BookShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Books',
            href: '/books',
        },
        {
            title: book.data.title,
            href: `/books/${book.data.id}`,
        },
    ];

    const handleBack = () => {
        router.get('/books');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={book.data.title} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-3 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline" onClick={handleBack} className="flex w-fit items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Books
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <BookThumbnail book={book} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">{book.data.title}</CardTitle>
                                <p className="text-lg text-gray-600 dark:text-gray-400">by {book.data.author}</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Rating</h3>
                                    <StarRating rating={book.data.rating} />
                                </div>

                                <div>
                                    <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Description</h3>
                                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">{book.data.description}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Added</h4>
                                        <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            {formatDate(book.data.created_at)}
                                        </div>
                                    </div>
                                    {book.data.updated_at !== book.data.created_at && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Last Updated</h4>
                                            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {formatDate(book.data.updated_at)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

interface BookThumbnailProps {
    book: {
        data: BookResource;
    };
}

function BookThumbnail({ book }: BookThumbnailProps) {
    if (book.data.thumbnail_url) {
        return <img src={book.data.thumbnail_url} alt={book.data.title} className="mx-auto aspect-[2/3] w-full max-w-sm rounded-lg object-cover" />;
    }

    return (
        <div className="mx-auto flex aspect-[2/3] w-full max-w-sm items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <Book className="h-16 w-16 text-gray-400" />
        </div>
    );
}

interface StarRatingProps {
    rating: number;
}

function StarRating({ rating }: StarRatingProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">({rating}/5)</span>
        </div>
    );
}
