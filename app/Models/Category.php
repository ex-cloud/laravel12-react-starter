<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;
    use HasUuid;

    protected $fillable = ['name', 'slug', 'description', 'is_active', 'is_featured'];
    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

}
