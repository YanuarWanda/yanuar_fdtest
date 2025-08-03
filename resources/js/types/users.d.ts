import { User } from "@/types";

export interface UserResource extends User {
    is_verified: boolean;
    joined_date: string;
    verification_status: 'verified' | 'unverified';
}