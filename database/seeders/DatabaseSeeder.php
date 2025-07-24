<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
       User::factory()->create([
            'name' => 'Andiansyah',
            'username' => 'andiansyah',
            'email' => 'andiansyah@kdua.net',
            'password' => Hash::make('Semangatku@25'),
            'avatar' => '/assets/default.jpg',
        ]);

        $user = User::first();
        Profile::create([
            'user_id' => $user->id,
            'birthdate' => '1995-01-30',
            'gender' => 'Laki-Laki',
            'marital_status' => 'Menikah',
            'phone' => '+62 81946702356',
            'address' => 'Jl. Sukarajin 2 lemahneundeut 2',
        ]);

        User::factory(100)->create();
        $this->call([
            TagSeeder::class,
            CategorySeeder::class,
            ArticleSeeder::class,
            MenuSeeder::class
        ]);
    }
}
