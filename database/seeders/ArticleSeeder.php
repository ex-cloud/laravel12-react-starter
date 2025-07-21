<?php
declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

final class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articleCount = 200;

        if (Category::count() === 0 || Tag::count() === 0) {
            $this->command->warn("Seeder tidak dijalankan karena Tag atau Category belum ada.");
            return;
        }

        $articles = Article::factory()
            ->count($articleCount)
            ->published()
            ->create();

        $articles->each(function (Article $article) {
            $category = Category::inRandomOrder()->first();

            if ($category) {
                $article->update(['category_id' => $category->id]);
            } else {
                $this->command->warn("Tidak bisa assign kategori ke artikel ID: {$article->id}");
            }

            // Assign beberapa tag (many-to-many)
            $tagIds = Tag::inRandomOrder()->take(rand(1, 5))->pluck('id');
            if ($tagIds->isNotEmpty()) {
                $article->tags()->sync($tagIds);
            }
        });

        $this->command->info("{$articleCount} article berhasil dibuat dan diberi tag & kategori.");
    }
}
