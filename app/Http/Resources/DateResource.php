<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class DateResource
 *
 * @property CarbonInterface $resource
 */
final class DateResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        if (!$this->resource instanceof CarbonInterface) {
            throw new \InvalidArgumentException('DateResource expects an instance of CarbonInterface.');
        }
        return [

            'human' => $this->resource->diffForHumans(),
            'string' => $this->resource->toDateTimeString(),
            'local' => $this->resource->toDateTimeLocalString(),
            'timestamp' => $this->resource->timestamp,
            'iso'       => $this->resource->toIso8601String(),
        ];
    }
}
