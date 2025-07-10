// resources/js/Pages/HomePage.tsx
import { Head } from '@inertiajs/react';

export default function HomePage() {
    return (
        <>
            <Head title="Home Page">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-rose-300">
                <div className="container mx-auto flex items-center justify-center py-20">
                    <h1 className="text-4xl font-bold text-gray-800">Hello, world!</h1>
                </div>
            </div>
            <div className="min-h-screen bg-rose-300">
                <div className="container mx-auto flex items-center justify-center py-20">
                    <h1 className="text-4xl font-bold text-gray-800">Hello, world!</h1>
                </div>
            </div>
        </>
    );
}

// Pakai layout dinamis
import FrontLayout from '@/layouts/frontend/front-layout';
HomePage.layout = (page: React.ReactNode) => <FrontLayout>{page}</FrontLayout>;
