<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gastuak extends Model
{
    use HasFactory;

    protected $table = 'gastuak';

    protected $fillable = [
        'konzeptua', 
        'zenbatekoa', 
        'data', 
        'pisua_id', 
        'ordaintzailea_id'
    ];

    protected $casts = [
        'data' => 'date', // Para que Laravel lo trate como fecha automáticamente
    ];

    // Relación 1: Quien paga (1 persona)
    public function ordaintzailea()
    {
        return $this->belongsTo(User::class, 'ordaintzailea_id');
    }

    // Relación 2: Quienes participan (Muchos: Los checkboxes)
    public function partaideak()
    {
        return $this->belongsToMany(User::class, 'gastu_user', 'gastuak_id', 'user_id');
    }
}