import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}
export type PageProps<T extends object = Record<string, never>> = {
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
} & T;

export interface User {
    id: string;
    name: string;
    username?: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    profile?: Profile;
    [key: string]: unknown; // This allows for additional properties...
}
export interface Profile {
    user_id: string;
    birthdate?: string;
    gender?: string;
    marital_status?: string;
    phone?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
    articles_count?: number;
}
