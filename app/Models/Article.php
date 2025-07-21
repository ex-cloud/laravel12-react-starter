<?php
declare(strict_types=1);

namespace App\Models;

use App\Enums\ArticleStatusEnum;
use App\Traits\HasDateResource;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string $content
 * @property string $image_url
 * @property string|null $image
 * @property string $status
 * @property bool $is_published
 * @property \Carbon\Carbon|null $published_at
 * @property \Carbon\Carbon|null $created_at
 * @property string|null $category_id
 * @property string|null $author_id
 * @property int $views
 */

final class Article extends Model
{
    /** @use HasFactory<\Database\Factories\ArticleFactory> */
    use HasFactory;
    use HasUuid;
    use HasDateResource;
    use HasSlug;

    protected string $slugSourceField = 'title';

    protected $fillable = ['title', 'slug', 'content', 'image', 'description', 'meta_title', 'meta_description', 'meta_keywords', 'status', 'published_at', 'views', 'author_id', 'category_id', 'is_published'];
    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'views' => 'integer',
        'status' => ArticleStatusEnum::class
    ];
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) => $attributes['image'] ? url('/storage/' . ltrim($attributes['image'], '/')) : null,
        );
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'article_tag');
    }
}
