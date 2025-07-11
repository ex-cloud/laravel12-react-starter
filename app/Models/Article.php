<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class Article extends Model
{
    /** @use HasFactory<\Database\Factories\ArticleFactory> */
    use HasFactory;
    use HasUuid;

    protected $fillable = ['title', 'slug', 'content', 'image', 'description', 'meta_title', 'meta_description', 'meta_keywords', 'status', 'published_at', 'author_id', 'category_id', 'is_published'];
    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

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

    public function getCreatedAtFormattedAttribute(): string
    {
        return $this->created_at->locale('id')->translatedFormat('l, d F Y');
    }

    public function getUpdatedAtFormattedAttribute(): string
    {
        return $this->updated_at->locale('id')->translatedFormat('l, d F Y');
    }
}
