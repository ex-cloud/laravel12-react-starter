<?php
declare(strict_types=1);

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;

final class AvatarController extends Controller
{
    public function update(Request $request, string $username): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        if ($user->username !== $username) {
            abort(403);
        }

        // Simpan avatar baru
        $path = $request->file('avatar')->store('avatars', 'public');

        // Hapus avatar lama jika ada
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->avatar = $path;
        $user->save();

        return redirect()->back()->with('status', 'Avatar updated!');
    }
}
