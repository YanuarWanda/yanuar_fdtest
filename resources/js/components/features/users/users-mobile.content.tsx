import { formatDate } from '@/lib/utils';
import { UserResource } from '@/types/users';
import { Calendar, Mail, UserIcon } from 'lucide-react';

import UserStatusBadge from '@/components/features/users/user-status-badge';

export default function UsersMobileContent({ users }: { users: UserResource[] }) {
    return (
        <div className="space-y-3 p-3 md:hidden">
            {users.map((user) => (
                <div key={user.id} className="space-y-3 rounded-lg border bg-card p-4">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                                <UserIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                <p className="truncate font-medium">{user.name}</p>
                            </div>
                            <div className="mb-2 flex items-center gap-2">
                                <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                <span className="truncate text-sm text-muted-foreground">{user.email}</span>
                            </div>
                        </div>
                        <UserStatusBadge user={user} />
                    </div>

                    <div className="flex items-center justify-between border-t pt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Joined {formatDate(user.created_at)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
