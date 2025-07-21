<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    public static function bootHasSlug(): void
    {
        static::saving(function ($model) {
            $sourceField = $model->slugSourceField ?? 'name';

            if (! $model->slug || $model->isDirty($sourceField)) {
                $baseSlug = Str::slug($model->{$sourceField});
                $slug = $baseSlug;
                $i = 1;

                while (
                    $model::where('slug', $slug)
                    ->where('id', '!=', $model->id)
                    ->exists()
                ) {
                    $slug = $baseSlug . '-' . $i++;
                }

                $model->slug = $slug;
            }
        });
    }
}
