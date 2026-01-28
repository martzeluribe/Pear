<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('zereginak', function (Blueprint $table) {
            $table->id(); 
            
            // Izenak euskaraz
            $table->string('izenburua');      // Lehen 'titulo' edo 'zeregina'
            $table->dateTime('muga_data');    // Lehen 'fecha_limite' edo 'eguna'
            $table->boolean('eginda')->default(false); // Lehen 'completada'

            // 'user_id' mantentzen dugu Laravelen estandarra delako,
            // baina kodean 'arduraduna' bezala tratatuko dugu.
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('zereginak');
    }
};