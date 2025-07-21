<?php

declare(strict_types=1);

namespace App\Http\Requests\Front;

use Illuminate\Foundation\Http\FormRequest;

final class TagFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
        ];
    }
}
