import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import { Transition } from '@headlessui/react';
import { Form, Head, Link } from '@inertiajs/react';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Zure osagaiak
import Footer from '@/components/footer';
import Header from '@/Components/Header';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    // Alboko menuko estilotarako klaseak
    const navItemClasses = "block px-4 py-2 text-sm font-medium rounded-md transition-colors";
    const activeClasses = "bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white";
    const inactiveClasses = "text-neutral-500 hover:text-black dark:hover:text-white";

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
            <Head title="Pasahitzaren ezarpenak" />
            
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
                            <Link href="/settings/password" className={`${navItemClasses} ${activeClasses}`}>
                                Pasahitza
                            </Link>
                            <Link href="/settings/two-factor" className={`${navItemClasses} ${inactiveClasses}`}>
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
                                title="Pasahitza eguneratu"
                                description="Ziurtatu zure kontuak pasahitz luze eta ausazko bat erabiltzen duela seguru mantentzeko"
                            />

                            <Form
                                {...PasswordController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                resetOnError={[
                                    'password',
                                    'password_confirmation',
                                    'current_password',
                                ]}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) {
                                        passwordInput.current?.focus();
                                    }
                                    if (errors.current_password) {
                                        currentPasswordInput.current?.focus();
                                    }
                                }}
                                className="space-y-6"
                            >
                                {({ errors, processing, recentlySuccessful }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="current_password">Oraingo pasahitza</Label>
                                            <Input
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                name="current_password"
                                                type="password"
                                                className="mt-1 block w-full"
                                                autoComplete="current-password"
                                                placeholder="Oraingo pasahitza"
                                            />
                                            <InputError message={errors.current_password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Pasahitz berria</Label>
                                            <Input
                                                id="password"
                                                ref={passwordInput}
                                                name="password"
                                                type="password"
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                placeholder="Pasahitz berria"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">Berretsi pasahitza</Label>
                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type="password"
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                placeholder="Berretsi pasahitza"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button disabled={processing}>
                                                Gorde pasahitza
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-neutral-600">Gordeta</p>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}