import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header'; // Asegúrate de que la ruta coincida con tu estructura
import Footer from '@/components/footer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <>
            <Header/>
            <Head title="Hasiera">
                
            </Head>

            
                <AppLayout/> {/*<-------------Hau kendu lan egiteko*/ } 
            <Footer/>
        </>
    );
}
