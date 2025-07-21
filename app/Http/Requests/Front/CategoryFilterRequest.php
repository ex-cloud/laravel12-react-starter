<?php

declare(strict_types=1);

namespace App\Http\Requests\Front;

use Illuminate\Foundation\Http\FormRequest;

final class CategoryFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Tidak perlu otentikasi untuk public access
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
        ];
    }
}
