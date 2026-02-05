<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!--Nabigatzailean bilatzen denean:-->
        <meta name="description" content="Pisuak kudeatzeko, informazio zeregin eta gastuen kudeaketadun web aplikazio integratua.">
        <meta name="keywords" content="pisu, pisua, kudeaketa, kudeatu, kudeaketak, zereginak, zeregin, gastu, gastuak, informazio, informazioa, erabiltzaile, elkarbizitza, etxea, pisukideak, alokairua, antolakuntza, zerrendak, ordainketak, egoiliarrak, etxeko lanak, egutegia, egutegi, erosketak, erosketa zerrenda, garbiketa, partekatu, kontuak, dirua, bizikidetza, errenta, jabekideak">
        <meta name="author" content="Pear taldea">
        <!--URL partekatzen denean:-->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ config('app.name') }}">
        <meta property="og:description" content="Pisuak kudeatzeko web aplikazio integratua.">
        <meta property="og:image" content="{{ asset('images/Welcomeirudia.png') }}">
        <!--twitter partekatzen denean:-->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name') }}">
        <meta name="twitter:description" content="Pisuak kudeatzeko web aplikazio integratua.">
        <meta name="twitter:image" content="{{ asset('images/Welcomeirudia.png') }}">


        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', ) }}</title>

        <link rel="icon" type="image/png" href="/Webiconhouse.png">
        <link rel="apple-touch-icon" href="/Webiconhouse.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
