import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Eye, Mail, User, XCircle } from 'lucide-react';

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
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                        <p className="text-muted-foreground">Manage and view all registered users ({users.total} total)</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-2 py-3 text-left font-medium">User</th>
                                        <th className="px-2 py-3 text-left font-medium">Email</th>
                                        <th className="px-2 py-3 text-left font-medium">Status</th>
                                        <th className="px-2 py-3 text-left font-medium">Joined</th>
                                        <th className="px-2 py-3 text-right font-medium">Actions</th>
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
                                                <td className="px-2 py-3 text-right">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/users/${user.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {users.data.length === 0 && (
                            <div className="py-12 text-center">
                                <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium">No users found</h3>
                                <p className="text-muted-foreground">There are no registered users yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {users.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {users.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                asChild={!!link.url}
                                disabled={!link.url}
                                className="min-w-[40px]"
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
