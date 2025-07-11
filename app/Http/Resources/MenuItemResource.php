<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'url' => $this->url,
            'icon' => $this->icon,
            'order' => $this->order,
            'parent_id' => $this->parent_id,
            'children_recursive' => MenuItemResource::collection(
                $this->whenLoaded('childrenRecursive')
            ),
        ];
    }
}
