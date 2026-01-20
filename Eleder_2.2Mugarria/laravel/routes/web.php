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

// INICIO DEL GRUPO PROTEGIDO (Solo usuarios logueados)
Route::middleware(['auth', 'verified'])->group(function () {

    // --- Rutas de Pisos ---
    
    // Crear (Formulario y Guardar)
    Route::get('/pisua/sortu', [PisoController::class, 'create'])->name('pisua.create');
    Route::post('/pisua', [PisoController::class, 'store'])->name('pisua.store');
    
    // Listar (Index)
    Route::get('/pisua', [PisoController::class, 'index'])->name('pisua.index');
    
    // Editar y Actualizar
    Route::get('pisua/{pisua}/edit', [PisoController::class, 'edit'])->name('pisua.edit');
    Route::put('pisua/{pisua}', [PisoController::class, 'update'])->name('pisua.update');

    // Borrar (La nueva ruta)
    Route::delete('/pisua/{pisua}', [PisoController::class, 'destroy'])->name('pisua.destroy');


    // --- Dashboard ---
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

}); // <--- FIN DEL GRUPO (Esta es la única llave de cierre necesaria para el middleware)

require __DIR__.'/settings.php';