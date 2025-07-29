<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class BulkDeleteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'selectAll' => ['required', 'boolean'],
            'selectedIds' => ['array'],
            'selectedIds.*' => ['string'], // ganti ke 'integer' kalau ID kamu memang integer
            'activeSearch' => ['nullable', 'string'],
        ];
    }
}
