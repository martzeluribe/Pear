<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pisu_user', function (Blueprint $table) {
            $table->id();
            
            // CAMBIO: Apuntamos explícitamente a la tabla 'pisua'
            $table->foreignId('pisu_id')->constrained('pisua')->onDelete('cascade');
            
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['pisu_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pisu_user');
    }
};