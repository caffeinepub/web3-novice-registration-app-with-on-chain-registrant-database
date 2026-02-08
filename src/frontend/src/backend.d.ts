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
export interface PublicRegistrant {
    id: string;
    cryptoAddress?: string;
    interests: Array<string>;
    instagram?: string;
    name: string;
    sector: Sector;
    email: string;
    website?: string;
    facebook?: string;
    skillLevel: string;
    telegram?: string;
}
export interface Registrant {
    id: string;
    cryptoAddress?: string;
    interests: Array<string>;
    instagram?: string;
    name: string;
    sector: Sector;
    email: string;
    website?: string;
    facebook?: string;
    isPublic: boolean;
    skillLevel: string;
    telegram?: string;
}
export interface UserProfile {
    name: string;
}
export enum Sector {
    professionLiberal = "professionLiberal",
    etudiant = "etudiant",
    artiste = "artiste",
    aucuneActivite = "aucuneActivite",
    sportif = "sportif",
    fonctionnaire = "fonctionnaire",
    services = "services",
    marchand = "marchand",
    association = "association"
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
    getPublicRegistrantsBySector(optSector: Sector | null): Promise<Array<PublicRegistrant>>;
    getPublicRegistrantsCountBySector(optSector: Sector | null): Promise<bigint>;
    getRegistrant(principal: Principal): Promise<Registrant | null>;
    getTotalNumberOfRegistrants(): Promise<bigint>;
    getUserBadge(principal: Principal): Promise<UserBadge | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllRegistrants(): Promise<Array<Registrant>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchRegistrants(searchTerm: string): Promise<Array<Registrant>>;
}
