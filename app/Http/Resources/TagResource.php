<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TagResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     * @property \App\Models\Tag $resource
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->resource->id,
            'name'        => $this->resource->name,
            'slug'        => $this->resource->slug,
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
            'articles_count' => $this->resource->articles_count ?? 0,
        ];
    }
}
