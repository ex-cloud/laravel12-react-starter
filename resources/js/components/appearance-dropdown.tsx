import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const getCurrentIcon = () => {
        switch (appearance) {
            case 'dark':
                return <Moon className="h-5 w-5" />;
            case 'light':
                return <Sun className="h-5 w-5 text-amber-400" />;
            default:
                return <Monitor className="h-5 w-5 text-sky-400" />;
        }
    };

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="cs" size="icon" className="h-8 w-8 rounded-md cursor-pointer">
                        {getCurrentIcon()}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateAppearance('light')}>
                        <span className="flex items-center gap-2 cursor-pointer">
                            <Sun className="h-5 w-5" />
                            Light
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateAppearance('dark')}>
                        <span className="flex items-center gap-2 cursor-pointer">
                            <Moon className="h-5 w-5" />
                            Dark
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateAppearance('system')}>
                        <span className="flex items-center gap-2 cursor-pointer">
                            <Monitor className="h-5 w-5" />
                            System
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
