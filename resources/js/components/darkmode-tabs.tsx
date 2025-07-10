import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function DarkModeTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; className: string }[] = [
        { value: 'light', icon: Sun, className: 'text-amber-400' },
        { value: 'dark', icon: Moon, className: 'text-gray-400' },
        { value: 'system', icon: Monitor, className: 'text-sky-400' },
    ];

    return (
        <div className={cn(
                'inline-flex items-center justify-center gap-1 border border-bg-muted rounded-full bg-white p-1 dark:bg-transparent', 
                className
            )} 
            {...props}
        >
            {tabs.map(({ value, icon: Icon, className: iconColor }) => {
                const isActive = appearance === value;
                return (
                    <button
                        key={value}
                        onClick={() => updateAppearance(value)}
                        className={cn(
                            'h-6 w-6 flex items-center justify-center rounded-full transition-all ',
                            isActive
                                ? 'ring ring-blue-600 text-white'
                                : 'border border-bg-muted text-neutral-400'
                        )}
                        aria-label={value}
                    >
                        <Icon className={cn('h-4 w-4', iconColor)} />
                    </button>
                );
            })}
        </div>
    );
}
