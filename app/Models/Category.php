<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\HasDateResource;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property bool $is_active
 * @property bool $is_featured
 */
final class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;
    use HasUuid;
    use HasDateResource;
    use HasSlug;

    protected string $slugSourceField = 'name';

    protected $fillable = ['name', 'slug', 'description', 'is_active', 'is_featured'];
    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::saving(function (Category $category) {
            if (blank($category->slug) && filled($category->name)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }


    public function articles()
    {
        return $this->hasMany(Article::class);
    }

}
