<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ZereginController;
use App\Http\Controllers\GastuakController;
use App\Models\Zereginak;
use App\Http\Middleware\AdminMiddleware;

// --- PÁGINA DE INICIO (Pública) ---
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// --- GRUPO AUTENTICADO (Cualquier usuario logueado) ---
Route::middleware(['auth', 'verified'])->group(function () {

    // ==========================================
    // 1. DASHBOARD
    // ==========================================
    Route::get('/dashboard', function () {
        $userId = auth()->id();
        $zereginak = Zereginak::where('arduraduna_id', $userId)
            ->with('pisua')
            ->orderBy('muga_data', 'asc')
            ->get();
        return Inertia::render('dashboard', [
            'zereginak' => $zereginak
        ]);
    })->name('dashboard');

    // ==========================================
    // 2. GESTIÓN DE PISOS (Orden Importante)
    // ==========================================
    
    // A. CREACIÓN (Debe ir PRIMERO, antes de {pisua})
    // Esto soluciona tu error 404. Laravel leerá esto antes que el comodín.
    Route::get('/pisua/sortu', [PisoController::class, 'create'])->name('pisua.sortu');
    Route::post('/pisua', [PisoController::class, 'store'])->name('pisua.store');
    
    // B. LISTADOS
    Route::get('/nirepisuak', [PisoController::class, 'userDashboard'])->name('pisua.nire_pisuak');

    // C. VISTA INDIVIDUAL (El comodín {pisua} va al final de este bloque)
    Route::get('/pisua/{pisua}', [PisoController::class, 'show'])->name('pisua.show');
    
    // D. ACCIONES DENTRO DEL PISO
    Route::get('pisua/{pisua}/edit', [PisoController::class, 'edit'])->name('pisua.edit');
    Route::put('pisua/{pisua}', [PisoController::class, 'update'])->name('pisua.update');
    
    // E. MIEMBROS
    Route::post('/pisua/{pisua}/add-member', [PisoController::class, 'addMember'])->name('pisua.addMember');
    Route::delete('/pisua/{pisua}/member/{user}', [PisoController::class, 'removeMember'])->name('pisua.removeMember');

    // ==========================================
    // 3. GESTIÓN DE TAREAS
    // ==========================================
    Route::get('/zereginak', [ZereginController::class, 'index'])->name('zereginak.index');
    Route::post('/zereginak', [ZereginController::class, 'store'])->name('zereginak.store');
    Route::put('/zereginak/{id}', [ZereginController::class, 'update'])->name('zereginak.update');
    Route::delete('/zereginak/{id}', [ZereginController::class, 'destroy'])->name('zereginak.destroy');

    // ==========================================
    // 4. GESTIÓN DE GASTOS
    // ==========================================
    Route::post('/gastuak', [GastuakController::class, 'store'])->name('gastuak.store');
    Route::delete('/gastuak/{gastu}', [GastuakController::class, 'destroy'])->name('gastuak.destroy');

    // ==========================================
    // 5. ZONA DE ADMINISTRADOR
    // ==========================================
    Route::middleware([AdminMiddleware::class])->group(function () {
        Route::resource('users', UserController::class);
        // Usamos solo index y destroy para admins globales, ya que create/store lo gestiona el usuario arriba
        Route::resource('pisua', PisoController::class)->only(['index', 'destroy']);
    });

});

require __DIR__.'/settings.php';