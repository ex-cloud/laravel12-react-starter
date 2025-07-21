<?php
declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ArticleStatusEnum;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
final class ArticleFactory extends Factory
{
    protected $model = Article::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'slug' => $this->faker->unique()->slug,
            'content' => $this->faker->paragraphs(3, true),
            'image' => $this->faker->imageUrl(640, 480, 'nature', true),
            'description' => $this->faker->text(200),
            'meta_title' => $this->faker->sentence,
            'meta_description' => $this->faker->text(150),
            'meta_keywords' => $this->faker->words(5, true),
            'status' => $this->faker->randomElement([
                ArticleStatusEnum::Draft->value,
                ArticleStatusEnum::Published->value,
                ArticleStatusEnum::Archived->value,
            ]),
            'published_at' => null,
            'author_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'is_published' => false, // Default to not published
            'views' => rand(0, 1000),
            'created_at' => now(),
        ];
    }

    public function published(): static
    {
        return $this->state(fn() => [
            'status' => 'published',
            'is_published' => true,
            'published_at' => now()->subDays(rand(1, 30)),
        ]);
    }
}
