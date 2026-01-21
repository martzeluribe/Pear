<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User; // Ziurtatu User eredua inportatuta dagoela

class PisuaFactory extends Factory
{
    public function definition(): array
    {
        $isSynced = $this->faker->boolean(80); // %80ko probabilitatea sinkronizatuta egoteko

        return [
            'izena' => 'Pisua ' . $this->faker->word(), 
            'kodigoa' => strtoupper($this->faker->bothify('P-####')), // Adib: P-4932
            'odoo_id' => $this->faker->unique()->numberBetween(1, 99999),
            'synced' => $isSynced,
            'sync_error' => $isSynced ? null : 'Errorea Odoo konexioan',
            
            // Honek erabiltzaile bat sortuko du lerro bakoitzeko, edo existitzen den bat hartu
            // Ausazko erabiltzaile bat hartu nahi baduzu: User::inRandomOrder()->first()->id
            'user_id' => User::factory(), 
            
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}