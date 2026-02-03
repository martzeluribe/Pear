<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Zereginak extends Model
{
    use HasFactory;

    protected $table = 'zereginak';

    protected $fillable = [
        'izenburua',
        'muga_data',
        'eginda',
        'pisua_id',      // <--- ¡FALTABA ESTO! Sin esto, la tarea no se asigna al piso.
        'arduraduna_id', // <--- En React envías 'arduraduna_id', así que úsalo aquí también.
        // 'user_id'     // Borra este si tu columna en la BD se llama 'arduraduna_id'
    ];

    protected $casts = [
        'muga_data' => 'datetime',
        'eginda' => 'boolean',
    ];

    // Relación con el Usuario (Arduraduna)
    public function arduraduna(): BelongsTo
    {
        // Asegúrate de que el segundo parámetro sea el nombre real de la columna en tu BD
        return $this->belongsTo(User::class, 'arduraduna_id'); 
    }

    // Relación con el Piso (Opcional pero recomendada)
    public function pisua(): BelongsTo
    {
        return $this->belongsTo(Pisua::class, 'pisua_id');
    }
}