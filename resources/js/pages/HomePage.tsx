// resources/js/Pages/HomePage.tsx
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

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

            <div className="h-[800px] bg-white dark:bg-background text-black dark:text-white flex items-center justify-center px-8 py-20">
                <div className="max-w-screen-2xl w-full px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-2">
                    {/* Kiri - Teks */}
                    <div className="flex-[1.5] space-y-6">
                        <div className="flex flex-col">
                            <div className='text-4xl tracking-tighter lg:leading-none leading-10 lg:text-[76px] font-extrabold'>Solusi Internet untuk,</div>
                            <BorderTrailWrapper
                                style={{
                                    boxShadow:
                                        '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
                                    }}
                                    size={120}
                                >
                                <div className="text-sky-400 font-extrabold text-xl lg:text-[38px] tracking-tight">
                                    Rumah, Sekolah & Komunitas
                                </div>
                            </BorderTrailWrapper>
                        </div>

                        <p className="text-xl text-gray-500 leading-relaxed">
                            Koneksi stabil, layanan terkelola,<br />
                            dan dukungan profesional untuk kebutuhan digital Anda.
                        </p>
                        <Button type='button' className="mt-4 bg-sky-500 text-black hover:text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition cursor-pointer">
                            <Link href='#'>Get Started →</Link>
                        </Button>
                    </div>

                    {/* Kanan - Card */}
                    <div className="flex-[1] relative">
                        <div className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-sm relative z-10">
                            <h2 className="text-lg font-semibold">Note Summarizer</h2>
                            <p className="text-sm text-gray-500 mt-2">Generating Summary <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Beta</span></p>
                            <p className="text-sm mt-4">
                                The new algorithm I'm working on for NASA is focused on optimizing satellite
                                data processing for real-time use...
                            </p>
                            <div className="flex justify-between mt-4 text-gray-400 text-sm">
                                <span>👍</span>
                                <span>👎</span>
                            </div>
                        </div>

                        {/* Floating menu */}
                        <div className="absolute right-[-2rem] bottom-[-2rem] bg-white text-black rounded-xl shadow-xl p-4 w-48 z-0">
                            <ul className="space-y-2 text-sm">
                            <li className="flex justify-between items-center">
                                Cut <span className="text-gray-400">⌘X</span>
                            </li>
                            <li className="flex justify-between items-center">
                                Duplicate <span className="text-gray-400">D</span>
                            </li>
                            <li className="flex justify-between items-center">
                                Delete <span className="text-gray-400">⌘Del</span>
                            </li>
                            <li className="flex justify-between items-center">
                                Comment <span className="text-gray-400">⇧⌘C</span>
                            </li>
                            <li className="flex justify-between items-center">
                                Format Options
                            </li>
                            <li className="flex justify-between items-center">
                                Colors
                            </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-full text-[#031e1e] flex items-center justify-center px-8 py-20 bg-white">
                    <div className="max-w-screen-2xl w-full px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-24">
                    {/* Kiri - Teks */}
                    <div className="flex-1 space-y-6">
                        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                            Solusi Internet,<br />
                            <span className="text-[#00ffe3]">untuk Rumah, Sekolah</span> & Komunitas
                        </h1>
                        {/* Solusi Internet Andal untuk Rumah, Sekolah, & Komunitas */}
                        {/* Koneksi stabil, layanan terkelola, dan dukungan profesional untuk kebutuhan digital Anda. */}
                        <p className="text-lg text-gray-300">
                            Koneksi stabil, layanan terkelola,<br />
                            dan dukungan profesional untuk kebutuhan digital Anda.
                        </p>
                        <Button type='button' className="mt-4 bg-[#00ffe3] text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition cursor-pointer">
                            <Link href='#'>Get Started →</Link>
                        </Button>
                    </div>

                    {/* Kanan - Card */}
                    <div className="flex-1 relative">
                    <div className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-sm relative z-10">
                        <h2 className="text-lg font-semibold">Note Summarizer</h2>
                        <p className="text-sm text-gray-500 mt-2">Generating Summary <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Beta</span></p>
                        <p className="text-sm mt-4">
                        The new algorithm I'm working on for NASA is focused on optimizing satellite
                        data processing for real-time use...
                        </p>
                        <div className="flex justify-between mt-4 text-gray-400 text-sm">
                        <span>👍</span>
                        <span>👎</span>
                        </div>
                    </div>

                    {/* Floating menu */}
                    <div className="absolute right-[-2rem] bottom-[-2rem] bg-white text-black rounded-xl shadow-xl p-4 w-48 z-0">
                        <ul className="space-y-2 text-sm">
                        <li className="flex justify-between items-center">
                            Cut <span className="text-gray-400">⌘X</span>
                        </li>
                        <li className="flex justify-between items-center">
                            Duplicate <span className="text-gray-400">D</span>
                        </li>
                        <li className="flex justify-between items-center">
                            Delete <span className="text-gray-400">⌘Del</span>
                        </li>
                        <li className="flex justify-between items-center">
                            Comment <span className="text-gray-400">⇧⌘C</span>
                        </li>
                        <li className="flex justify-between items-center">
                            Format Options
                        </li>
                        <li className="flex justify-between items-center">
                            Colors
                        </li>
                        </ul>
                    </div>
                    </div>
                </div>

            </div>
        </>
    );
}

// Pakai layout dinamis
import FrontLayout from '@/layouts/frontend/front-layout';
import { BorderTrailWrapper } from '@/components/ui/border-trail-wrapper';
HomePage.layout = (page: React.ReactNode) => <FrontLayout>{page}</FrontLayout>;
