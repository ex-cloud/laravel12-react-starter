<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function builder()
    {
        $menu = Menu::where('slug', 'main')->firstOrFail();

        // Load semua items dari root, dan rekursif ke bawah
        $items = MenuItem::where('menu_id', $menu->id)
            ->whereNull('parent_id')
            ->with('childrenRecursive')
            ->orderBy('order')
            ->get();

        return Inertia::render('admins/MenuBuilderPage', [
            'items' => $items,
        ]);
    }

    public function updateOrder(Request $request)
    {
        foreach ($request->input('items') as $index => $item) {
            MenuItem::where('id', $item['id'])->update(['order' => $index + 1]);
        }

        return response()->json(['status' => true]);
    }

    public function sort(Request $request)
    {
        // Ambil menu utama berdasarkan slug (atau bisa dynamic dari route param)
        $menu = Menu::where('slug', 'main')->firstOrFail();

        // Validasi struktur item dari frontend
        $data = $request->validate([
            '*.id' => [
                'required',
                'integer',
                Rule::exists('menu_items', 'id')->where('menu_id', $menu->id),
            ],
            '*.order' => ['required', 'integer'],
            '*.parent_id' => [
                'nullable',
                'integer',
                Rule::exists('menu_items', 'id')->where('menu_id', $menu->id),
            ],
        ]);

        // Update setiap item
        foreach ($data as $item) {
            MenuItem::where('id', $item['id'])->update([
                'order' => $item['order'],
                'parent_id' => $item['parent_id'] ?? null,
            ]);
        }

        // Optional: log untuk debug
        \Log::info('[MenuBuilder] Sort Update:', $data);

        return response()->json([
            'status' => true,
            'message' => 'Menu structure updated successfully.',
        ]);
    }

}
