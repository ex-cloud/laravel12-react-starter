import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-12">
            <div className="w-full max-w-md space-y-8">
                <Link href={route('home')} className="flex flex-col gap-2 items-center justify-center lg:items-start">
                    <div className="mb-1 flex h-9 w-auto rounded-md items-center justify-center lg:items-start">
                        <AppLogoIcon className="size-14 fill-current text-[var(--foreground)] dark:text-white" />
                    </div>
                </Link>
                <div className="flex flex-col gap-8 border  bg-card p-6 rounded-lg dark:bg-card-dark">
                    <div className='flex items-center justify-between'>
                        <div className="flex flex-col gap-4">
                            <span className="sr-only">{title}</span>
                            <div className="space-y-1">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                        </div>
                        <AppearanceToggleDropdown />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
