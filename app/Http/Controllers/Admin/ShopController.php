<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/shops/index', [
            'shops' => Shop::with('owner')
                ->withCount('shopProducts')
                ->latest()
                ->paginate(10)
                ->through(fn ($shop) => [
                    'id' => $shop->id,
                    'name' => $shop->name,
                    'description' => $shop->description,
                    'is_active' => $shop->is_active,
                    'shop_products_count' => $shop->shop_products_count,
                    'owner' => [
                        'id' => $shop->owner->id,
                        'name' => $shop->owner->name,
                        'email' => $shop->owner->email,
                    ],
                    'created_at' => $shop->created_at->toDateString(),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/shops/create', [
            'owners' => User::where('role', 'shop_owner')
                ->select('id', 'name', 'email')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'owner_id' => ['required', 'exists:users,id'],
            'is_active' => ['boolean'],
        ]);

        Shop::create($validated);

        return redirect()->route('admin.shops.index')
            ->with('flash', ['type' => 'success', 'message' => 'Shop created successfully.']);
    }

    public function edit(Shop $shop): Response
    {
        return Inertia::render('admin/shops/edit', [
            'shop' => $shop->only('id', 'name', 'description', 'owner_id', 'is_active'),
            'owners' => User::where('role', 'shop_owner')
                ->select('id', 'name', 'email')
                ->get(),
        ]);
    }

    public function update(Request $request, Shop $shop): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'owner_id' => ['required', 'exists:users,id'],
            'is_active' => ['boolean'],
        ]);

        $shop->update($validated);

        return redirect()->route('admin.shops.index')
            ->with('flash', ['type' => 'success', 'message' => 'Shop updated successfully.']);
    }

    public function destroy(Shop $shop): RedirectResponse
    {
        $shop->delete();

        return redirect()->route('admin.shops.index')
            ->with('flash', ['type' => 'success', 'message' => 'Shop deleted successfully.']);
    }
}

