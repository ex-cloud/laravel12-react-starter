<?php
declare(strict_types= 1);

namespace App\Models;

use App\Traits\HasDateResource;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Str;

final class Tag extends Model
{
    /** @use HasFactory<\Database\Factories\TagFactory> */
    use HasFactory;
    use HasUuid;
    use HasDateResource;
    use HasSlug;

    protected string $slugSourceField = 'name';
    protected $fillable = [
        'name',
        'slug',
    ];
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::saving(function (Tag $tag) {
            if (blank($tag->slug) && filled($tag->name)) {
                $tag->slug = Str::slug($tag->name);
            }
        });
    }


    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_tag');
    }
}
