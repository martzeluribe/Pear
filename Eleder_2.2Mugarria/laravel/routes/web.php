<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ZereginController; // Inportazio hau ezinbestekoa da

// --- PÁGINA DE INICIO ---
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// --- GRUPO PROTEGIDO (Solo usuarios logueados) ---
Route::middleware(['auth', 'verified'])->group(function () {

    // ==========================================
    // KUDEAKETA: PISUAK (Apartamentos)
    // ==========================================
    
    // 1. Creación (Debe ir ANTES de las rutas con {id})
    Route::get('/pisua/sortu', [PisoController::class, 'create'])->name('pisua.sortu');
    Route::post('/pisua', [PisoController::class, 'store'])->name('pisua.store');
    
    // 2. Listados
    Route::get('/pisua', [PisoController::class, 'index'])->name('pisua.index');
    Route::get('/nirepisuak', [PisoController::class, 'userDashboard'])->name('pisua.nire_pisuak');

    // 3. Acciones sobre un piso específico (Wildcards {pisua})
    Route::get('/pisua/{pisua}', [PisoController::class, 'show'])->name('pisua.show'); // Vista principal del piso
    Route::get('pisua/{pisua}/edit', [PisoController::class, 'edit'])->name('pisua.edit');
    Route::put('pisua/{pisua}', [PisoController::class, 'update'])->name('pisua.update');
    Route::delete('/pisua/{pisua}', [PisoController::class, 'destroy'])->name('pisua.destroy');
    
    // 4. Añadir miembro (Modal en Show.tsx)
    Route::post('/pisua/{pisua}/add-member', [PisoController::class, 'addMember'])->name('pisua.addMember');


    // ==========================================
    // KUDEAKETA: ZEREGINAK (Tareas)
    // ==========================================
    
    Route::get('/zereginak', [ZereginController::class, 'index'])->name('zereginak.index');
    Route::post('/zereginak', [ZereginController::class, 'store'])->name('zereginak.store');
    Route::put('/zereginak/{id}', [ZereginController::class, 'update'])->name('zereginak.update'); // Marcar como hecha
    Route::delete('/zereginak/{id}', [ZereginController::class, 'destroy'])->name('zereginak.destroy');


    // ==========================================
    // KUDEAKETA: ERABILTZAILEAK (Usuarios) & DASHBOARD
    // ==========================================

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('/users', [UserController::class, 'index'])->name('users.index');           
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');   
    Route::post('/users', [UserController::class, 'store'])->name('users.store');           
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');  
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');   
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy'); 

}); 

require __DIR__.'/settings.php';