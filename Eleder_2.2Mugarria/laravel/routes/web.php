<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;
use App\Http\Controllers\UserController;


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



    

Route::get('/users', [UserController::class, 'index']);           // Carga erakutsi.tsx
Route::get('/users/{user}/edit', [UserController::class, 'edit']); // Carga editatu.tsx
Route::put('/users/{user}', [UserController::class, 'update']);    // Acción de guardado
Route::delete('/users/{user}', [UserController::class, 'destroy']); // Acción de borrado
Route::get('/users/create', [UserController::class, 'create']);    // Carga sortu.tsx (NUEVA)
Route::post('/users', [UserController::class, 'store']);           // Acción de crear (NUEVA)

});

require __DIR__.'/settings.php';
