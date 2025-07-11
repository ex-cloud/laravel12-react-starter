<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class MenuItem extends Model
{
    protected $fillable = [
        'menu_id',
        'parent_id',
        'title',
        'url',
        'icon',
        'target',
        'order',
        'roles',
    ];

    protected $casts = [
        'roles' => 'array',
    ];

    public function children(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('order');
    }

    public function childrenRecursive(): HasMany
    {
        return $this->children()->with('childrenRecursive');
    }
}
