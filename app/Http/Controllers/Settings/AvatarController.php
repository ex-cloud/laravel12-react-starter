<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AvatarController extends Controller
{
    public function update(Request $request)
    {
        try {
            $user = $request->user();

            $request->validate([
                'avatar' => ['required', 'image', 'max:2048'],
            ]);

            // Hapus avatar lama jika bukan default
            if ($user->avatar && !str_contains($user->avatar, 'default.jpg')) {
                $oldPath = str_replace('/storage/', '', $user->avatar);
                Storage::disk('public')->delete($oldPath);
            }

            // Upload avatar baru
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            Log::info('Avatar stored at: ' . $avatarPath);

            $user->avatar = Storage::url($avatarPath);
            Log::info('New avatar path: ' . $user->avatar);

            $user->save();

            return back()->with('status', 'avatar-updated');
        } catch (\Throwable $e) {
            Log::error('Avatar upload error: ' . $e->getMessage());
            report($e);
            return back()->withErrors(['avatar' => 'Terjadi kesalahan saat mengunggah avatar.']);
        }
    }
}
