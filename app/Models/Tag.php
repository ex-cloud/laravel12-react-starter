<?php
declare(strict_types= 1);

namespace App\Models;

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
    protected $fillable = [
        'name',
        'slug',
    ];

    protected static function booted()
    {
        static::saving(function ($tag) {
            $tag->slug = Str::slug($tag->name);
        });
    }

    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_tag');
    }
}
