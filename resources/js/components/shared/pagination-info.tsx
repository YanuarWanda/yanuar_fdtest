import { PaginationMeta } from '@/types';

export interface PaginationInfoProps {
    meta: PaginationMeta;
    resourceName: string;
}

export default function PaginationInfo({ meta, resourceName }: PaginationInfoProps) {
    return (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {(meta.current_page - 1) * meta.per_page + 1} to {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total}{' '}
            {resourceName}
        </div>
    );
}
