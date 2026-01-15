import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canRegister,
}: LoginProps) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Head title="Hasi saioa" />

            <Header />

            {/* CAMBIOS AQUÍ:
                1. Quitamos 'justify-center'.
                2. Cambiamos 'p-16' a 'py-32'. 
                   'py-32' añade mucho espacio vertical (padding-top y padding-bottom).
                   'items-center' mantiene la tarjeta centrada horizontalmente.
            */}
            <main className="flex flex-1 flex-col items-center py-32">
                
                <div className="w-full max-w-[400px] rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                    
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
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
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="Value"
                                            className="h-10 rounded-md border-gray-300 placeholder:text-gray-300 focus:border-gray-400 focus:ring-0"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

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
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Value"
                                            className="h-10 rounded-md border-gray-300 placeholder:text-gray-300 focus:border-gray-400 focus:ring-0"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 h-10 w-full rounded-md bg-[#2a2a2a] text-sm font-normal text-white hover:bg-black"
                                        tabIndex={3}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner className="mr-2" />}
                                        Hasi saioa
                                    </Button>
                                </div>

                                {canRegister && (
                                    <div className="flex justify-start">
                                        <TextLink 
                                            href={register()} 
                                            tabIndex={4}
                                            className="text-sm font-medium text-gray-800 underline decoration-1 underline-offset-2 hover:text-black"
                                        >
                                            Erregistratu hemen
                                        </TextLink>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </div>
            </main>

            <Footer />  
        </div>
    );
}