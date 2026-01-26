import { Head, Link } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';

// Zure osagaiak
import Footer from '@/components/footer';
import Header from '@/Components/Header';

export default function Appearance() {
    // Alboko menuko estilotarako klaseak
    const navItemClasses = "block px-4 py-2 text-sm font-medium rounded-md transition-colors";
    const activeClasses = "bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white";
    const inactiveClasses = "text-neutral-500 hover:text-black dark:hover:text-white";

    return (
        /* Edukiontzi nagusia Flex egiturarekin pantaila osoko gutxieneko altuera ziurtatzeko */
        <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
            <Head title="Itxuraren ezarpenak" />
            
            <Header />

            {/* flex-grow klaseak edukia zabaltzen du eta footer-a beheraino bultzatzen du */}
            <main className="flex-grow container mx-auto px-4 py-10">
                
                {/* Ezarpenen izenburua */}
                <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Ezarpenak</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Kudeatu zure profilaren eta kontuaren ezarpenak
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-10">
                    
                    {/* EZKERREKO ALBOKO MENUA */}
                    <aside className="w-full md:w-64 space-y-1">
                        <nav className="space-y-1">
                            <Link href="/settings/profile" className={`${navItemClasses} ${inactiveClasses}`}>
                                Profila
                            </Link>
                            <Link href="/settings/password" className={`${navItemClasses} ${inactiveClasses}`}>
                                Pasahitza
                            </Link>
                            <Link href="/settings/two-factor" className={`${navItemClasses} ${inactiveClasses}`}>
                                Bi urratseko autentifikazioa
                            </Link>
                            <Link href="/settings/appearance" className={`${navItemClasses} ${activeClasses}`}>
                                Itxura
                            </Link>
                        </nav>
                    </aside>

                    {/* EDUKI NAGUSIA (ESKUINEAN) */}
                    <div className="flex-1 max-w-2xl space-y-10">
                        <section className="space-y-6">
                            <HeadingSmall
                                title="Itxuraren ezarpenak"
                                description="Eguneratu zure kontuaren itxura ezarpenak"
                            />
                            
                            <div className="mt-6">
                                <AppearanceTabs />
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}