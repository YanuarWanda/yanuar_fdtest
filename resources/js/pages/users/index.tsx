import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Mail, User, XCircle } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
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

export default function UsersTable({ users }: UsersIndexProps) {
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Users</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Manage and view all registered users ({users.total} total)</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">All Users</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-2 py-3 text-left font-medium">User</th>
                                        <th className="px-2 py-3 text-left font-medium">Email</th>
                                        <th className="px-2 py-3 text-left font-medium">Status</th>
                                        <th className="px-2 py-3 text-left font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => {
                                        const isEmailVerified = user.email_verified_at !== null;

                                        return (
                                            <tr key={user.id} className="border-b hover:bg-muted/50">
                                                <td className="px-2 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <Badge variant={isEmailVerified ? 'default' : 'destructive'} className="text-xs">
                                                        {isEmailVerified ? (
                                                            <>
                                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                                Verified
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="mr-1 h-3 w-3" />
                                                                Unverified
                                                            </>
                                                        )}
                                                    </Badge>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(user.created_at)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-3 p-3 md:hidden">
                            {users.data.map((user) => {
                                const isEmailVerified = user.email_verified_at !== null;

                                return (
                                    <div key={user.id} className="space-y-3 rounded-lg border bg-card p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                    <p className="truncate font-medium">{user.name}</p>
                                                </div>
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                    <span className="truncate text-sm text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                            <Badge variant={isEmailVerified ? 'default' : 'destructive'} className="ml-2 flex-shrink-0 text-xs">
                                                {isEmailVerified ? (
                                                    <>
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Verified
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="mr-1 h-3 w-3" />
                                                        Unverified
                                                    </>
                                                )}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between border-t pt-2">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>Joined {formatDate(user.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {users.data.length === 0 && (
                            <div className="px-4 py-8 text-center sm:py-12">
                                <User className="mx-auto mb-4 h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
                                <h3 className="mb-2 text-base font-medium sm:text-lg">No users found</h3>
                                <p className="text-sm text-muted-foreground sm:text-base">There are no registered users yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {users.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 px-2 sm:gap-2">
                        {users.links.map((link, index) => (
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
            </div>
        </AppLayout>
    );
}
