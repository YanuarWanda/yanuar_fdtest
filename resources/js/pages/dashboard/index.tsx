import { getInitials } from '@/lib/utils';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle, Mail, XCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const {
        auth: { user },
    } = usePage<SharedData>().props;
    const isEmailVerified = user.email_verified_at !== null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3 sm:p-6">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-xs font-medium sm:text-sm">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-1">
                                <span className="text-lg font-semibold sm:text-xl">Welcome back, {user.name}!</span>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">{user.email}</span>
                                    </div>
                                    <Badge variant={isEmailVerified ? 'default' : 'destructive'} className="w-fit">
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
                            </div>
                        </CardTitle>
                    </CardHeader>

                    {!isEmailVerified && (
                        <CardContent className="pt-0">
                            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 sm:p-4 dark:border-orange-800 dark:bg-orange-950">
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 sm:h-5 sm:w-5 dark:text-orange-400" />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">Email Verification Required</h4>
                                        <p className="mt-1 text-xs text-orange-700 sm:text-sm dark:text-orange-300">
                                            Please check your email and click the verification link to verify your account.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
