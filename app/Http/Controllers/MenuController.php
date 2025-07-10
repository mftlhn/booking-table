<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::with('images')->get();

        return Inertia::render('Menu/Index', compact('menus'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);
        DB::transaction(function () use ($request) {
            $menu = Menu::create([
                'name' => $request->name,
                'category' => $request->category,
                'price' => str_replace('.', '', $request->price),
                'description' => $request->description,
            ]);

            if ($menu) {
                // Handle file uploads
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $file) {
                        $extension = $file->getClientOriginalExtension();
                        $rename_file = time() . '_' . rand(1, 9999) . '.' . $extension;
                        $file->storeAs('public/menus', $rename_file, 'public');
                        $menu->images()->create([
                            'name' => $rename_file,
                            'image_path' => 'menus/' . $rename_file,
                        ]);
                    }
                }
            }
        });
        return back()->with('success', 'Menu baru berhasil ditambah!');
    }

    public function deleteImage($id)
    {
        $image = MenuImage::findOrFail($id);

        // Hapus file fisik jika perlu
        if (Storage::exists($image->image_path)) {
            Storage::delete($image->image_path);
        }

        $image->delete();

        return back();
    }

    public function update($id, Request $request)
    {
        DB::transaction(function () use ($id, $request) {
            $menu = Menu::findOrFail($id);
            $menu->update([
                'name' => $request->name,
                'category' => $request->category,
                'price' => str_replace(',', '', $request->price),
                'description' => $request->description,
            ]);

            // Handle file uploads
            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $file) {
                    $extension = $file->getClientOriginalExtension();
                    $rename_file = time() . '_' . rand(1, 9999) . '.' . $extension;
                    $file->storeAs('public/menus', $rename_file, 'public');
                    $menu->images()->create([
                        'name' => $rename_file,
                        'image_path' => 'menus/' . $rename_file,
                    ]);
                }
            }
        });
        return back()->with('success', 'Menu berhasil diperbarui!');
    }

    public function toggleActive(Request $request)
    {
        DB::transaction(function () use ($request) {
            $menu = Menu::findOrFail($request->id);
            $menu->is_active = !$menu->is_active; // Toggle the is_active status
            $menu->save();
        });
        return back()->with('success', 'Status menu berhasil diperbarui!');
    }
}
