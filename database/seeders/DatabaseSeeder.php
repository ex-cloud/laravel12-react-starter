<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory(100)->create();

        User::factory()->create([
            'name' => 'Andiansyah',
            'username' => 'andiansyah',
            'email' => 'andiansyah@kdua.net',
            'password' => Hash::make('Semangatku@25'),
            'avatar' => '/assets/default.jpg',
        ]);

        $this->call([
            TagSeeder::class,
            CategorySeeder::class,
            ArticleSeeder::class,
            MenuSeeder::class
        ]);
    }
}
