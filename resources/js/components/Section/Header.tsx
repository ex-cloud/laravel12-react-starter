import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Facebook, House, Instagram, LayoutDashboard, PanelLeftDashed, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import AppearanceToggleDropdown from '../appearance-dropdown';
import DropdownMenuMobile from '../ui/DropdownMenuMobile';
import type { MenuItem } from '@/types/menu';
import { cn } from '@/lib/utils';
import AppLogoIcon from '../app-logo-icon';

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
        transition={{ duration: 0.25 }}
        className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md transition-all h-14",
        scrolled ? "bg-white/95 dark:bg-background/80 border-b " : "bg-transparent"
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 flex h-full w-full items-center justify-between gap-4 transition-all">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-2">
            <div className="md:hidden">
                <DropdownMenuMobile items={items} />
            </div>

            <div className='hidden lg:flex items-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-1 text-xl font-semibold tracking-tight">
                            <AppLogoIcon className='h-8 w-8'/>
                            K2NET
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-60">
                        <DropdownMenuLabel className='text-xs tracking-tight text-gray-600'>Links</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Link
                                        href='/'
                                        className="w-full flex items-center text-xs tracking-tight"
                                    >
                                        <House className="mr-2 h-4 w-4" />
                                        Home
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuLabel className='text-xs tracking-tight text-gray-600'>Say Hi</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <a
                                        href="https://youtube.com"
                                        className="w-full flex items-center text-xs tracking-tight"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Youtube className="mr-2 h-4 w-4" />
                                        Youtube
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a
                                        href="https://instagram.com"
                                        className="w-full flex items-center text-xs tracking-tight"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Instagram className="mr-2 h-4 w-4" />
                                        Instagram
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a
                                        href="https://facebook.com"
                                        className="w-full flex items-center text-xs tracking-tight"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Facebook className="mr-2 h-4 w-4" />
                                        Facebook
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
            <div className='md:hidden flex items-center mt-2'>
                <div className='absolute h-1 dark:h-3 w-full top-0 left-0 rounded-b-full animate-in duration-600 delay-200 bg-gradient-to-tr from-sky-500 via-sky-600 to-sky-400 dark:from-[#154D5F]/50 dark:to-[#04021D]/70 blur-xl'/>
                <Link href='/'>
                    <AppLogoIcon className='relative z-10 h-10 w-10'/>
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
                        'transition-colors dark:hover:text-white hover:text-gray-500/50',
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
                <div className='hidden lg:flex'>
                    {auth?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="User Menu" className='cursor-pointer'>
                                <LayoutDashboard className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className='text-[13px] font-medium tracking-tight'>
                                        <PanelLeftDashed />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/settings/profile" className='text-[13px] font-medium tracking-tight'>
                                        <PanelLeftDashed />
                                        Your account
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                <Link href="/logout" method="post" as="button" className='text-[13px] font-medium tracking-tight'>
                                        <PanelLeftDashed />
                                    Logout
                                </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (

                            <div className="hidden lg:flex gap-3">
                                <AppearanceToggleDropdown />
                                <Button size={'sm'}>
                                    <Link
                                        href={route('login')}
                                        className="text-sm leading-normal"
                                    >
                                        Log in
                                    </Link>
                                </Button>
                            </div>
                    )}
                </div>
                {/* <div className="block h-5 w-px dark:bg-muted-foreground bg-border"></div> */}
                <AppearanceToggleDropdown className='lg:hidden' />
            </div>
        </div>
      </div>
    </motion.header>
  );
}
