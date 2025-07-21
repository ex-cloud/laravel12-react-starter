<?php

declare(strict_types=1);

namespace App\Traits;

use App\Http\Resources\DateResource;

trait HasDateResource
{
    public function getCreatedAtResource(string $timezone = 'Asia/Jakarta', ?string $format = null): ?DateResource
    {
        return $this->created_at
            ? new DateResource($this->created_at, $timezone, $format)
            : null;
    }

    public function getUpdatedAtResource(string $timezone = 'Asia/Jakarta', ?string $format = null): ?DateResource
    {
        return $this->updated_at
            ? new DateResource($this->updated_at, $timezone, $format)
            : null;
    }

    public function getDeletedAtResource(string $timezone = 'Asia/Jakarta', ?string $format = null): ?DateResource
    {
        return $this->deleted_at
            ? new DateResource($this->deleted_at, $timezone, $format)
            : null;
    }
}
