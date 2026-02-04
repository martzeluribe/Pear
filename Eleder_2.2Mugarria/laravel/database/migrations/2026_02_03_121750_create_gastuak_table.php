<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::create('gastuak', function (Blueprint $table) {
        $table->id();
        
        $table->string('konzeptua');          // Ej: "Komuneko papera"
        $table->decimal('zenbatekoa', 10, 2); // Ej: 2.30
        $table->date('data');                 // Ej: 2025/12/04
        
        // Relaciones
        $table->foreignId('pisua_id')->constrained('pisua')->onDelete('cascade');
        $table->foreignId('ordaintzailea_id')->constrained('users'); // "Nork ordaindu du?"
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastuak');
    }
};
