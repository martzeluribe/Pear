<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/pisua/sortu',[PisoController::class,'create'])->name('pisua.sortu');
    Route::get('/pisua/erakutsi',[PisoController::class,'index'])->name('pisua.index');
    
    /**/Route::get('/pisua',[PisoController::class,'index'])->name('pisua.index');
    
    Route::post('/pisua',[PisoController::class,'store'])->name('pisua.store');

    Route::get('pisua/{pisua}/edit', [PisoController::class, 'edit'])->name('pisua.edit');
    Route::put('pisua/{pisua}', [PisoController::class, 'update'])->name('pisua.update');


    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
