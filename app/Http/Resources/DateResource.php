<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;
use Stringable;
use Carbon\Carbon;

final class DateResource implements JsonSerializable, Arrayable, Stringable
{
    public function __construct(
        protected Carbon $date,
        protected string $timezone = 'Asia/Jakarta',
        protected ?string $format = null
    ) {}

    public function toArray(): string
    {
        return $this->format();
    }

    public function __toString(): string
    {
        return $this->format();
    }

    public function jsonSerialize(): string
    {
        return $this->format();
    }

    protected function format(): string
    {
        return $this->date->timezone($this->timezone)
            ->format($this->format ?? 'Y-m-d H:i:s');
    }
}
