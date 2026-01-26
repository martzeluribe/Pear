<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Pisua;

class PisuaUser extends Model
{
    use HasFactory;

    // Nombre de la tabla pivote
    protected $table = 'pisua_user';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'pisua_id',
        'user_id',
    ];

    /**
     * Usuario asociado
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Piso (Pisua) asociado
     */
    public function pisua(): BelongsTo
    {
        return $this->belongsTo(Pisua::class);
    }
}
