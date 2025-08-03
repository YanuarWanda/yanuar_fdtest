import { User } from "@/types";

export interface UserResource extends User {
    initials: string;
    is_verified: boolean;
    joined_date: string;
    verification_status: 'verified' | 'unverified';
}