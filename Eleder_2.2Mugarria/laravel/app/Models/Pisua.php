<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Pisua extends Model
{
    use HasFactory;

    // MANTENIDO: Forzamos que la tabla sea singular
    protected $table = 'pisua';

    protected $fillable = [
        'izena',
        'kodigoa',
        'deskripzioa', // Corregido: 's' en vez de 'z'
        'imagen_path', // Añadido para la imagen
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
     */
    public function miembros(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pisu_user', 'pisu_id', 'user_id')
                    ->withTimestamps();
    }
}