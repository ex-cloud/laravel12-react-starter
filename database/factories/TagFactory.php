<?php
declare(strict_types= 1);

namespace Database\Factories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
final class TagFactory extends Factory
{
    protected $model = Tag::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            "id" => $this->faker->uuid,
            "name"=> $this->faker->name,
            "slug"=> $this->faker->unique()->slug,
        ];
    }
}
