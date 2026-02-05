<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // CONDICIÓN: Aquí defines quién es admin.
        // Opción A: Si tienes columna 'role' en la base de datos:
        if (Auth::check() && Auth::user()->mota === 'admin') {
            return $next($request);
        }

        // Opción B: Si solo tú eres admin (por email):
        // if (Auth::check() && Auth::user()->email === 'tu_email@ejemplo.com') {
        //     return $next($request);
        // }

        // Si no es admin, lo mandamos de vuelta al dashboard o al inicio
        return redirect('/dashboard')->with('error', 'Ez daukazu baimenik hemen sartzeko.');
    }
}