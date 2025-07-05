import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthLoginLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href={route('home')} className="flex items-center gap-2 font-medium">
                        <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                        </div>
                        <span className="sr-only">{title}</span>
                    </Link>


                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">{description}</p>
                        </div>
                    {children}
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                src="/assets/213213.png"
                alt="Image"
                className="absolute inset-0 h-20 w-auto object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
