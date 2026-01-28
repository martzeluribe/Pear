<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;
use App\Http\Controllers\ZereginController; // Inportazio hau ezinbestekoa da

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // --- PISUA ---
    Route::get('/pisua/sortu', [PisoController::class, 'create'])->name('pisua.sortu');
    
    // OHARRA: 'pisua.index' izena bi aldiz zenuen. Bat bakarrik utzi dut
    // gatazkarik ez sortzeko route() erabiltzean.
    Route::get('/pisua/erakutsi', [PisoController::class, 'index'])->name('pisua.index');
    Route::post('/pisua', [PisoController::class, 'store'])->name('pisua.store');
    
    Route::get('pisua/{pisua}/edit', [PisoController::class, 'edit'])->name('pisua.edit');
    Route::put('pisua/{pisua}', [PisoController::class, 'update'])->name('pisua.update');


    // --- ZEREGINAK ---
    // React fitxategian (Index.tsx) erabiltzen dituzun 'route()' deiekin bat datoz:
    
    // 1. Zerrenda ikusi
    Route::get('/zereginak', [ZereginController::class, 'index'])->name('zereginak.index');
    
    // 2. Sortu (Gorde)
    Route::post('/zereginak', [ZereginController::class, 'store'])->name('zereginak.store');
    
    // 3. Eguneratu (Adibidez: eginda markatzeko)
    Route::put('/zereginak/{id}', [ZereginController::class, 'update'])->name('zereginak.update');
    
    // 4. Ezabatu
    Route::delete('/zereginak/{id}', [ZereginController::class, 'destroy'])->name('zereginak.destroy');


    // --- DASHBOARD ---
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';