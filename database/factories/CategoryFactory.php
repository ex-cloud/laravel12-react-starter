<?php
declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
final class CategoryFactory extends Factory
{
    protected $model = Category::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(2, true),
            'slug' => $this->faker->unique()->slug,
            'description' => $this->faker->sentence,
            'is_active' => $this->faker->boolean(80),
            'is_featured' => $this->faker->boolean(50),
        ];
    }
}
