// resources/js/Layouts/FrontLayout.tsx
import Header from '@/components/Section/Header';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import 'sonner';

type FrontLayoutProps = {
    children: React.ReactNode;
};

export default function FrontLayout({ children }: FrontLayoutProps): React.ReactElement {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="mx-auto">
                {children}
            </main>
            <Toaster position="top-right" richColors />
        </div>
    );
}
