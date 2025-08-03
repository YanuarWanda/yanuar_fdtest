import { PaginatedResource, type BreadcrumbItem } from '@/types';
import { UserResource } from '@/types/users';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Filter, Search, User as UserIcon, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import UsersDesktopContent from '@/components/features/users/users-desktop-content';
import UsersMobileContent from '@/components/features/users/users-mobile.content';
import PaginationInfo from '@/components/shared/pagination-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

interface UsersIndexProps {
    users: PaginatedResource<UserResource>;
    filters: {
        search?: string;
        status?: 'verified' | 'unverified';
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
];

export default function UsersTable({ users, filters }: UsersIndexProps) {
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

    const handleStatusFilter = (value: string) => {
        const url = new URL(window.location.href);
        const currentStatus = filters.status || 'all';

        if (value === 'all') {
            url.searchParams.delete('status');
        } else {
            url.searchParams.set('status', value);
        }

        if (value !== currentStatus) {
            url.searchParams.delete('page');
        }

        router.visit(url.toString());
    };

    const getFilterDisplayValue = () => {
        switch (filters.status) {
            case 'verified':
                return 'verified';
            case 'unverified':
                return 'unverified';
            default:
                return 'all';
        }
    };

    const getPaginationContent = (label: string) => {
        const cleanLabel = label
            .replace(/&laquo;/g, '')
            .replace(/&raquo;/g, '')
            .replace(/&hellip;/g, '...')
            .trim();

        switch (cleanLabel) {
            case 'Previous':
                return (
                    <>
                        <ChevronLeft className="h-4 w-4" />
                    </>
                );
            case 'Next':
                return (
                    <>
                        <ChevronRight className="h-4 w-4" />
                    </>
                );
            case '...':
                return <span>...</span>;
            default:
                return <span>{cleanLabel}</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Users</h1>
                            <p className="text-sm text-muted-foreground sm:text-base">Manage and view all registered users</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={getFilterDisplayValue()} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-[140px] sm:w-[160px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="unverified">Unverified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pr-9 pl-9"
                            />
                            {searchTerm && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearSearch}
                                    className="absolute top-1 right-1 h-7 w-7 p-0 hover:bg-transparent"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <UsersDesktopContent users={users.data} />

                <UsersMobileContent users={users.data} />

                {users.meta.total === 0 && (
                    <div className="px-4 py-8 text-center sm:py-12">
                        <UserIcon className="mx-auto mb-4 h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
                        <h3 className="mb-2 text-base font-medium sm:text-lg">{filters.search ? 'No users found' : 'No users found'}</h3>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            {filters.search ? `No users found matching "${filters.search}"` : 'There are no registered users yet.'}
                        </p>
                        {filters.search && (
                            <Button variant="outline" size="sm" onClick={handleClearSearch} className="mt-4">
                                Clear search
                            </Button>
                        )}
                    </div>
                )}

                {users.meta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 px-2 sm:gap-2">
                        {users.meta.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                asChild={!!link.url}
                                disabled={!link.url}
                                className="h-8 min-w-[32px] text-xs sm:h-9 sm:min-w-[40px] sm:text-sm"
                            >
                                {link.url ? <Link href={link.url}>{getPaginationContent(link.label)}</Link> : getPaginationContent(link.label)}
                            </Button>
                        ))}
                    </div>
                )}

                {users.meta.total > 0 && <PaginationInfo meta={users.meta} resourceName="Users" />}
            </div>
        </AppLayout>
    );
}
