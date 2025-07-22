<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return array
     * @property \App\Models\Profile $resource
     */
    public function toArray(Request $request): array
    {
        return [
            'birthdate'       => $this->resource->birthdate,
            'gender'          => $this->resource->gender,
            'marital_status'  => $this->resource->marital_status,
            'phone'           => $this->resource->phone,
            'address'         => $this->resource->address,
        ];
    }
}
