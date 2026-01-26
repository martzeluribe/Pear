import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { disable, enable } from '@/routes/two-factor';
import { Form, Head, Link } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

// Zure osagaiak
import Footer from '@/components/footer';
import Header from '@/Components/Header';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    // Alboko menuko estilotarako klaseak
    const navItemClasses = "block px-4 py-2 text-sm font-medium rounded-md transition-colors";
    const activeClasses = "bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white";
    const inactiveClasses = "text-neutral-500 hover:text-black dark:hover:text-white";

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
            <Head title="Bi urratseko autentifikazioa" />
            
            <Header />

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
                            <Link href="/settings/two-factor" className={`${navItemClasses} ${activeClasses}`}>
                                Bi urratseko autentifikazioa
                            </Link>
                            <Link href="/settings/appearance" className={`${navItemClasses} ${inactiveClasses}`}>
                                Itxura
                            </Link>
                        </nav>
                    </aside>

                    {/* EDUKI NAGUSIA (ESKUINEAN) */}
                    <div className="flex-1 max-w-2xl space-y-10">
                        <section className="space-y-6">
                            <HeadingSmall
                                title="Bi urratseko autentifikazioa"
                                description="Kudeatu zure bi urratseko autentifikazioaren ezarpenak"
                            />

                            {twoFactorEnabled ? (
                                <div className="flex flex-col items-start justify-start space-y-4">
                                    <Badge variant="default">Aktibatuta</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Bi urratseko autentifikazioa aktibatuta dagoela, saioa hastean 
                                        segurtasun-PIN bat eskatuko zaizu. PIN hori zure telefonoan 
                                        TOTP onartzen duen aplikazio batetik lor dezakezu.
                                    </p>

                                    <TwoFactorRecoveryCodes
                                        recoveryCodesList={recoveryCodesList}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={errors}
                                    />

                                    <div className="relative inline">
                                        <Form {...disable.form()}>
                                            {({ processing }) => (
                                                <Button
                                                    variant="destructive"
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    <ShieldBan className="mr-2 h-4 w-4" /> Desaktibatu 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-start justify-start space-y-4">
                                    <Badge variant="destructive">Desaktibatuta</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Bi urratseko autentifikazioa aktibatzen duzunean, saioa hastean 
                                        segurtasun-PIN bat eskatuko zaizu. PIN hori zure telefonoan 
                                        TOTP onartzen duen aplikazio batetik lor dezakezu.
                                    </p>

                                    <div>
                                        {hasSetupData ? (
                                            <Button onClick={() => setShowSetupModal(true)}>
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Jarraitu konfigurazioarekin
                                            </Button>
                                        ) : (
                                            <Form
                                                {...enable.form()}
                                                onSuccess={() => setShowSetupModal(true)}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                                        Aktibatu 2FA
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                </div>
                            )}

                            <TwoFactorSetupModal
                                isOpen={showSetupModal}
                                onClose={() => setShowSetupModal(false)}
                                requiresConfirmation={requiresConfirmation}
                                twoFactorEnabled={twoFactorEnabled}
                                qrCodeSvg={qrCodeSvg}
                                manualSetupKey={manualSetupKey}
                                clearSetupData={clearSetupData}
                                fetchSetupData={fetchSetupData}
                                errors={errors}
                            />
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}