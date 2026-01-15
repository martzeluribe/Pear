<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fakturak extends Model
{
    use HasFactory;

    protected $table = 'fakturak';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'concepto',  // Descripción del gasto
        'pagador',   // Nombre de quien ha pagado
        'importe',   // Cantidad en euros (decimal)
        'fecha',     // Fecha de la factura
    ];

    /**
     * Si quieres que Laravel trate 'fecha' como objeto Carbon automáticamente
     */
    protected $dates = [
        'fecha',
    ];
}
