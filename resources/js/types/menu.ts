// types/menu.ts
export type MenuItem = {
    id: string | number;
    title: string;
    url: string;
    icon?: string; // e.g., 'Settings', 'Github', 'User'
    group?: string;
    children?: MenuItem[];
  };
