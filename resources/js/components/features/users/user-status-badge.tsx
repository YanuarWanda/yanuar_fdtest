import { type User } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export default function UserStatusBadge({ user }: { user: User }) {
    const isEmailVerified = user.email_verified_at !== null;

    return (
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
    );
}
