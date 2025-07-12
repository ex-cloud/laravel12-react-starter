<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class UserUpdateRequest extends FormRequest
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
        Log::info('User route param:', ['user' => $this->route('user')]);

        $userParam = $this->route('user');

        if (is_array($userParam)) {
            $user = array_values($userParam)[0]; // ambil nilai pertamanya
        } else {
            $user = $userParam;
        }
        return [
            'name'     => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username,' . $user->id],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'avatar'   => ['nullable', 'sometimes', 'file', 'image', 'max:2048'],
        ];
    }
}
