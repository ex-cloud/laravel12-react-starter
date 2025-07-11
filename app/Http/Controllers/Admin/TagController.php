<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['name']);

        return Inertia::render('Admin/Tags/Index', [
            'tags' => TagResource::collection(
                Tag::query()
                    ->when($request->name, fn($query) => $query->where('name', 'like', "%{$request->name}%"))
                    ->latest()
                    ->get()
            )->toArray($request),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Tags/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name'],
        ]);

        Tag::create($validated);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag berhasil ditambahkan.');
    }

    public function edit(Tag $tag): Response
    {
        return Inertia::render('Admin/Tags/Edit', [
            'tag' => $tag,
        ]);
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name,' . $tag->id],
        ]);

        $tag->update($validated);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag berhasil diperbarui.');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->back()
            ->with('success', 'Tag berhasil dihapus.');
    }
}
