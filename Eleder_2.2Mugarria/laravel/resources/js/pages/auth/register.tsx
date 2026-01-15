import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
// Quitamos AuthLayout
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';

export default function Register() {
    return (
        // 1. Estructura principal igual que el Login
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Head title="Erregistratu" />

            {/* Header arriba */}
            <Header />

            {/* 2. Zona central con py-32 para dar espacio vertical (arriba/abajo) */}
            <main className="flex flex-1 flex-col items-center py-32">
                
                {/* 3. Tarjeta blanca centrada */}
                <div className="w-full max-w-[400px] rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                    
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    
                                    {/* Campo Izena (Name) */}
                                    <div className="grid gap-2">
                                        <Label 
                                            htmlFor="name"
                                            className="text-sm font-semibold text-gray-800"
                                        >
                                            Izena
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            placeholder="Value"
                                            className="h-10 rounded-md border-gray-300 placeholder:text-gray-300 focus:border-gray-400 focus:ring-0"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Campo Emaila */}
                                    <div className="grid gap-2">
                                        <Label 
                                            htmlFor="email"
                                            className="text-sm font-semibold text-gray-800"
                                        >
                                            Emaila
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            placeholder="Value"
                                            className="h-10 rounded-md border-gray-300 placeholder:text-gray-300 focus:border-gray-400 focus:ring-0"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Campo Pasahitza */}
                                    <div className="grid gap-2">
                                        <Label 
                                            htmlFor="password"
                                            className="text-sm font-semibold text-gray-800"
                                        >
                                            Pasahitza
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            placeholder="Value"
                                            className="h-10 rounded-md border-gray-300 placeholder:text-gray-300 focus:border-gray-400 focus:ring-0"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Campo Errepikatu pasahitza (Confirm Password) */}
                                    <div className="grid gap-2">
                                        <Label 
                                            htmlFor="password_confirmation"
                                            className="text-sm font-semibold text-gray-800"
                                        >
                                            Errepikatu pasahitza
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            placeholder="Value"
                                            className="h-10 rounded-md border-gray-300 placeholder:text-gray-300 focus:border-gray-400 focus:ring-0"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    {/* Botón Erregistratu */}
                                    <Button
                                        type="submit"
                                        className="mt-2 h-10 w-full rounded-md bg-[#2a2a2a] text-sm font-normal text-white hover:bg-black"
                                        tabIndex={5}
                                        disabled={processing}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner className="mr-2" />}
                                        Erregistratu
                                    </Button>
                                </div>
                                
                                {/* Opcional: Enlace para ir al Login si ya tienes cuenta. 
                                    En tu foto no sale explícitamente dentro de la tarjeta, 
                                    pero suele ser necesario. Si no lo quieres, puedes borrar este bloque. */}
                                <div className="text-center text-sm text-gray-600">
                                    Dagoeneko kontua duzu?{' '}
                                    <TextLink 
                                        href={login()} 
                                        tabIndex={6}
                                        className="font-medium text-gray-800 underline decoration-1 underline-offset-2 hover:text-black"
                                    >
                                        Hasi saioa
                                    </TextLink>
                                </div>

                            </>
                        )}
                    </Form>
                </div>
            </main>

            {/* Footer abajo */}
            <Footer />
        </div>
    );
}