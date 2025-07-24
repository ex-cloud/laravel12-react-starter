import { usePage, Link } from '@inertiajs/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import type { MenuItem } from '@/types/menu';
import { cn } from '@/lib/utils';

function toLucideIconName(str: string): string {
  return str
    .split(/[-_]/g)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

type SharedData = {
  auth: {
    user?: {
      name: string;
      email: string;
    };
  };
};

export default function DropdownMenuMobile({ items = [] }: { items: MenuItem[] }) {
  const { url } = usePage();
  const { auth } = usePage<SharedData>().props;

  const groupedItems = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const group = item.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon2" aria-label="Open Mobile Menu">
          <Icons.AlignLeft className="h-10 w-10" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-40">
        {Object.entries(groupedItems).map(([group, groupItems], groupIndex) => (
          <div key={group}>
            {group !== 'default' && (
              <DropdownMenuLabel className="capitalize">{group}</DropdownMenuLabel>
            )}

            {groupItems.map((item) => {
              const iconKey = toLucideIconName(item.icon?.trim() || 'circle');
              const IconComponent = (Icons[iconKey as keyof typeof Icons] ??
                Icons.Circle) as React.FC<React.SVGProps<SVGSVGElement>>;

              const isActive = url === item.url;

              if (!Icons[iconKey as keyof typeof Icons]) {
                console.warn(`⚠️ Icon not found: ${iconKey}, fallback to Circle.`);
              }

              return item.children?.length ? (
                <DropdownMenuSub key={item.id}>
                  <DropdownMenuSubTrigger className={cn('flex items-center', isActive && 'text-primary font-semibold')}>
                    <IconComponent className="mr-2 h-4 w-4" />
                    {item.title}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {item.children.map((child) => (
                      <DropdownMenuItem asChild key={child.id}>
                        <Link
                          href={child.url || '#'}
                          className={cn('w-full', url === child.url && 'text-primary font-semibold')}
                        >
                          {child.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem asChild key={item.id}>
                  <Link
                    href={item.url || '#'}
                    className={cn('w-full flex items-center', isActive && 'text-primary font-semibold')}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Icons.Link className="mr-2 h-4 w-4" />
                    <span>
                        Social media
                    </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuGroup>
                    <DropdownMenuSubContent>
                        <DropdownMenuLabel className='text-xs tracking-tight text-gray-600'>Say Hi</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <a
                                href="https://youtube.com"
                                className="w-full flex items-center text-xs tracking-tight"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Icons.Youtube className="mr-2 h-4 w-4" />
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
                                <Icons.Instagram className="mr-2 h-4 w-4" />
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
                                <Icons.Facebook className="mr-2 h-4 w-4" />
                                Facebook
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuGroup>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            {auth?.user ? (
              <>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Link
                            href="/dashboard"
                            className="w-full flex items-center text-primary tracking-tight"
                        >
                            <Icons.LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/settings/profile"
                                className="w-full flex items-center text-primary tracking-tight"
                            >
                                <Icons.UserRoundPen className="h-4 w-4" />
                                Your Account
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/logout"
                    method="post"
                    className="w-full flex items-center text-primary tracking-tight"
                  >
                    <Icons.LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href={route('login')}
                    className="w-full flex items-center text-primary"
                  >
                    <Icons.Key className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={route('register')}
                    className="w-full flex items-center text-primary"
                  >
                    <Icons.UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            {groupIndex < Object.keys(groupedItems).length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
