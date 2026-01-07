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
        Schema::table('users', function (Blueprint $table) {
            
            $table->string('mota')->default('pisukidea');
    
            $table->unsignedBigInteger('odoo_id')->nullable();
    
            $table->boolean('synced')->default(False);
    
            $table->text('sync_error')->nullable();
             
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
