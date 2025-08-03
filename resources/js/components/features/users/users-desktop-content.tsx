import { formatDate } from '@/lib/utils';
import { Calendar, Mail } from 'lucide-react';

import UserStatusBadge from '@/components/features/users/user-status-badge';
import { UserResource } from '@/types/users';

export default function UsersDesktopContent({ users }: { users: UserResource[] }) {
    return (
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
                    {users.map((user) => (
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
                                <UserStatusBadge user={user} />
                            </td>
                            <td className="px-2 py-3">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(user.created_at)}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
