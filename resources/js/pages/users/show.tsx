import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Mail, User as UserIcon, XCircle } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface UserShowProps {
    user: User;
}

export default function UserShow({ user }: UserShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: user.name,
            href: `/users/${user.id}`,
        },
    ];

    const getInitials = useInitials();
    const isEmailVerified = user.email_verified_at !== null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
                        <p className="text-muted-foreground">View user details and account information</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src="" alt={user.name} />
                                    <AvatarFallback className="text-lg font-medium">{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-semibold">{user.name}</h2>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Email Verification</span>
                                <Badge variant={isEmailVerified ? 'default' : 'destructive'}>
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

                            {isEmailVerified && (
                                <div className="text-sm text-muted-foreground">
                                    <Calendar className="mr-1 inline h-4 w-4" />
                                    Verified on {formatDate(user.email_verified_at!)}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                Account Information
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                <p className="mt-1 rounded bg-muted px-2 py-1 font-mono text-sm">{user.id}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                                <p className="mt-1 text-sm">{formatDate(user.created_at)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                <p className="mt-1 text-sm">{formatDate(user.updated_at)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
