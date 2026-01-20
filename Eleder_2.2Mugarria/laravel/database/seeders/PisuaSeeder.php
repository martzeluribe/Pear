<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pisua;

class PisuaSeeder extends Seeder
{
    public function run(): void
    {
        // 10 pisu sortu
        Pisua::factory()->count(10)->create();
    }
}