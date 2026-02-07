import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserBadge {
    principal: Principal;
    uniqueId: string;
    badge: string;
}
export interface Registrant {
    id: string;
    interests: Array<string>;
    name: string;
    email: string;
    skillLevel: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addRegistrant(registrant: Registrant): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteRegistrant(principal: Principal): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrCreateUserBadge(): Promise<UserBadge>;
    getRegistrant(principal: Principal): Promise<Registrant | null>;
    getTotalNumberOfRegistrants(): Promise<bigint>;
    getUserBadge(principal: Principal): Promise<UserBadge | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllRegistrants(): Promise<Array<Registrant>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchRegistrants(searchTerm: string): Promise<Array<Registrant>>;
}
