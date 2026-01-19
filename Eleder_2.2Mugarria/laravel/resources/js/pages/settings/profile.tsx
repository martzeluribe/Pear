import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Zure osagaiak
import Footer from '@/components/footer';
import Header from '@/Components/Header';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    // Alboko menuko estilotarako klaseak
    const navItemClasses = "block px-4 py-2 text-sm font-medium rounded-md transition-colors";
    const activeClasses = "bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white";
    const inactiveClasses = "text-neutral-500 hover:text-black dark:hover:text-white";

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
            <Head title="Profilaren ezarpenak" />
            
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
                            <Link href="/settings/profile" className={`${navItemClasses} ${activeClasses}`}>
                                Profila
                            </Link>
                            <Link href="/settings/password" className={`${navItemClasses} ${inactiveClasses}`}>
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

                    {/* EDUKI NAGUSIA */}
                    <div className="flex-1 max-w-2xl space-y-10">
                        <section className="space-y-6">
                            <HeadingSmall
                                title="Profilaren informazioa"
                                description="Eguneratu zure izena eta helbide elektronikoa"
                            />

                            <Form
                                {...ProfileController.update.form()}
                                options={{ preserveScroll: true }}
                                className="space-y-6"
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Izena</Label>
                                            <Input
                                                id="name"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.name}
                                                name="name"
                                                required
                                                autoComplete="name"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Helbide elektronikoa</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                defaultValue={auth.user.email}
                                                name="email"
                                                required
                                                autoComplete="username"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Zure helbide elektronikoa egiaztatu gabe dago.{' '}
                                                    <Link href={send()} as="button" className="underline hover:text-black dark:hover:text-white">
                                                        Egin klik hemen berriro bidaltzeko.
                                                    </Link>
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4">
                                            <Button disabled={processing}>Gorde</Button>
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

                        <hr className="border-neutral-200 dark:border-neutral-800" />

                        <section>
                            <DeleteUser />
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}