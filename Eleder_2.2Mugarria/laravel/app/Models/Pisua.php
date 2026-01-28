<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Pisua extends Model
{
    use HasFactory;

    protected $table = 'pisua';

    protected $fillable = [
        'izena',
        'kodigoa',
        'deskripzioa',
        'helbidea',
        'imagen_path', 
        'odoo_id',
        'synced',
        'sync_error',
        'user_id',
    ];

    /**
     * El dueño del piso.
     */
    public function administrador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Los miembros/inquilinos del piso.
     * IMPORTANTE: Le cambiamos el nombre de 'miembros' a 'users'
     * para que coincida con el Controlador y con React.
     */
    public function users(): BelongsToMany
    {
        // La lógica interna estaba perfecta, solo cambiamos el nombre de la función
        return $this->belongsToMany(User::class, 'pisu_user', 'pisu_id', 'user_id')
                    ->withTimestamps();
    }
}