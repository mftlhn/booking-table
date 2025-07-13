import { Head, Link } from '@inertiajs/react';
import LandingPage from './LandingPage';

export default function Welcome({ auth, ...props }) {
    
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <LandingPage appName={props.appName} auth={auth} menus={props.menus} />
        </>
    );
}
