import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Book, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

export default function BookCreate() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Books',
            href: route('books.index'),
        },
        {
            title: 'Create',
            href: route('books.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        author: '',
        description: '',
        rating: '1',
        thumbnail: null as File | null,
    });

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('thumbnail', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('books.store'), {
            onSuccess: () => {
                reset();
                setImagePreview(null);
            },
            onError: (errors: Record<string, string>) => {
                console.log('Validation errors:', errors);
            },
        });
    };

    const handleCancel = () => {
        router.get(route('books.index'));
    };

    const handleBack = () => {
        router.get(route('books.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Book" />

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
                            <CardHeader>
                                <CardTitle className="text-lg">Book Cover Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <BookThumbnailPreview imagePreview={imagePreview} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Create New Book</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className={errors.title ? 'border-red-500' : ''}
                                            placeholder="Enter book title"
                                            required
                                        />
                                        {errors.title && <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="author">Author</Label>
                                        <Input
                                            id="author"
                                            type="text"
                                            value={data.author}
                                            onChange={(e) => setData('author', e.target.value)}
                                            className={errors.author ? 'border-red-500' : ''}
                                            placeholder="Enter author name"
                                            required
                                        />
                                        {errors.author && <p className="text-sm text-red-600 dark:text-red-400">{errors.author}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
                                            placeholder="Enter book description"
                                            rows={4}
                                            required
                                        />
                                        {errors.description && <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rating">Rating</Label>
                                        <Select value={data.rating} onValueChange={(value) => setData('rating', value)}>
                                            <SelectTrigger className={errors.rating ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select rating" />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                        {errors.rating && <p className="text-sm text-red-600 dark:text-red-400">{errors.rating}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="thumbnail">Cover Image (Optional)</Label>
                                        <Input
                                            id="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className={errors.thumbnail ? 'border-red-500' : ''}
                                        />
                                        {errors.thumbnail && <p className="text-sm text-red-600 dark:text-red-400">{errors.thumbnail}</p>}
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Accepted formats: JPEG, PNG, JPG, WebP (max 2MB)</p>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button type="submit" disabled={processing} className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            {processing ? 'Creating...' : 'Create Book'}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

interface BookThumbnailPreviewProps {
    imagePreview?: string | null;
}

function BookThumbnailPreview({ imagePreview }: BookThumbnailPreviewProps) {
    if (imagePreview) {
        return <img src={imagePreview} alt="Book cover preview" className="mx-auto aspect-[2/3] w-full max-w-sm rounded-lg object-cover" />;
    }

    return (
        <div className="mx-auto flex aspect-[2/3] w-full max-w-sm items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
                <Book className="mx-auto mb-2 h-16 w-16 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Upload an image to see preview</p>
            </div>
        </div>
    );
}
