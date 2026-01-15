<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Pisua;

class Zereginak extends Model
{
    use HasFactory;

    protected $table = 'zereginak';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'zeregina',       // Nombre de la tarea
        'eguna',          // Fecha de la tarea
        'hordua',         // Hora de la tarea
        'piso_id',      // Piso al que pertenece
        'user_id', // Usuario encargado
    ];

    /**
     * Piso al que pertenece la tarea
     */
    public function piso(): BelongsTo
    {
        return $this->belongsTo(Pisua::class, 'piso_id');
    }

    /**
     * Usuario encargado de la tarea
     */
    public function encargado(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
