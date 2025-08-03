import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge and combine CSS classes with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Extract initials from a full name
 */
export function getInitials(fullName: string): string {
    const names = fullName.trim().split(' ');

    if (names.length === 0) return '';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();

    const firstInitial = names[0].charAt(0);
    const lastInitial = names[names.length - 1].charAt(0);

    return `${firstInitial}${lastInitial}`.toUpperCase();
}

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};