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
            <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-6">
                {children}
            </main>
            <Toaster position="top-right" richColors />
        </div>
    );
}
