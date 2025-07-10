import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import AppearanceToggleDropdown from '../appearance-dropdown';
import DropdownMenuMobile from '../ui/DropdownMenuMobile';
import type { MenuItem } from '@/types/menu';
import { cn } from '@/lib/utils';

type PageProps = {
  menu?: {
    items?: MenuItem[];
  };
  url?: string;
};

type SharedData = {
  auth: {
    user?: {
      name: string;
      email: string;
      // tambahkan field lain jika perlu
    };
  };
};

export default function AppHeader() {
  const { menu, url } = usePage<PageProps>().props;
  const { auth } = usePage<SharedData>().props;
  const items = menu?.items ?? [];

  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 30);
  });

  return (
    <motion.header
      initial={false}
      animate={{
        height: scrolled ? 56 : 58,
        // backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
      }}
      transition={{ duration: 0.25 }}
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md transition-all",
        scrolled ? "bg-white/95 dark:bg-background/80 shadow" : "bg-white/70 dark:bg-background/50"
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 flex h-full w-full items-center justify-between gap-4 transition-all">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-2">
            <div className="md:hidden">
                <DropdownMenuMobile items={items} />
            </div>
            <Link href="/" className="text-xl font-semibold tracking-tight">
                MyApp
            </Link>
        </div>

        {/* Middle: Desktop nav */}
        {/* Right: Menu + Auth */}
        <div className="flex items-center gap-6">
            {/* Menu nav pindah ke kanan */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
            {items.length ? (
                items.map((item) => (
                <div key={item.id} className="relative group">
                    <Link
                    href={item.url}
                    className={cn(
                        'transition-colors hover:text-white',
                        url === item.url && 'text-primary font-semibold'
                    )}
                    >
                    {item.title}
                    </Link>

                    {item.children && item.children.length > 0 && (
                    <div
                        className={cn(
                        'absolute left-0 top-full mt-2 hidden group-hover:block',
                        'bg-white dark:bg-background shadow-lg rounded p-2 min-w-[10rem] z-40',
                        'animate-in fade-in zoom-in-95 duration-150'
                        )}
                    >
                        {item.children.map((child) => (
                        <Link
                            key={child.id}
                            href={child.url}
                            className="block px-4 py-2 hover:bg-muted rounded"
                        >
                            {child.title}
                        </Link>
                        ))}
                    </div>
                    )}
                </div>
                ))
            ) : (
                // <div className="text-muted-foreground text-sm">No menu available</div>
                <div></div>
            )}
            </nav>


            {/* Right: Auth & theme toggle */}
            <div className="flex items-center gap-2">
            
                <div className="hidden md:block h-5 w-px dark:bg-muted-foreground bg-border"></div>
                {/* User / Auth */}
                {auth?.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="User Menu" className='cursor-pointer'>
                            <User className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                            <Link href="/dashboard">Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Account</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                            <Link href="/settings/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                            <Link href="/logout" method="post" as="button">
                                Logout
                            </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                        <Link
                            href={route('login')}
                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route('register')}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Register
                        </Link>
                        </div>
                    )}
                <div className="block h-5 w-px dark:bg-muted-foreground bg-border"></div>
                <AppearanceToggleDropdown />
            </div>
        </div>
      </div>
    </motion.header>
  );
}
