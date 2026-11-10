<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ShopProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ShopProductController extends Controller
{
    public function index(): Response
    {
        $shop = auth()->user()->shop;

        return Inertia::render('shop-owner/shop-products/index', [
            'shopProducts' => $shop
                ? $shop->shopProducts()->with('product')->latest()->paginate(12)->through(fn ($sp) => [
                    'id' => $sp->id,
                    'effective_price' => $sp->effective_price,
                    'effective_thumbnail_url' => $sp->effective_thumbnail_url,
                    'price' => $sp->price,
                    'thumbnail_url' => $sp->thumbnail ? Storage::url($sp->thumbnail) : null,
                    'description' => $sp->description,
                    'product' => [
                        'id' => $sp->product->id,
                        'name' => $sp->product->name,
                        'description' => $sp->product->description,
                        'price' => $sp->product->price,
                        'thumbnail_url' => $sp->product->thumbnail_url,
                    ],
                ])
                : collect(),
            'shop' => $shop ? ['id' => $shop->id, 'name' => $shop->name] : null,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('shop-owner/shop-products/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $shop = auth()->user()->shop;

        if (! $shop) {
            return back()->with('flash', ['type' => 'error', 'message' => 'You do not have a shop assigned yet.']);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        // Create product in shared catalog
        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'thumbnail' => $thumbnailPath,
            'created_by' => auth()->id(),
        ]);

        // Add to this shop
        $shop->shopProducts()->create([
            'product_id' => $product->id,
        ]);

        return redirect()->route('shop-owner.shop-products.index')
            ->with('flash', ['type' => 'success', 'message' => 'Product created and added to your shop.']);
    }

    public function edit(ShopProduct $shopProduct): Response
    {
        // Ensure it belongs to auth shop
        $shop = auth()->user()->shop;
        abort_if(! $shop || $shopProduct->shop_id !== $shop->id, 403);

        return Inertia::render('shop-owner/shop-products/edit', [
            'shopProduct' => [
                'id' => $shopProduct->id,
                'price' => $shopProduct->price,
                'description' => $shopProduct->description,
                'thumbnail_url' => $shopProduct->thumbnail ? Storage::url($shopProduct->thumbnail) : null,
                'product' => [
                    'id' => $shopProduct->product->id,
                    'name' => $shopProduct->product->name,
                    'description' => $shopProduct->product->description,
                    'price' => $shopProduct->product->price,
                    'thumbnail_url' => $shopProduct->product->thumbnail_url,
                ],
            ],
        ]);
    }

    public function update(Request $request, ShopProduct $shopProduct): RedirectResponse
    {
        $shop = auth()->user()->shop;
        abort_if(! $shop || $shopProduct->shop_id !== $shop->id, 403);

        $validated = $request->validate([
            'price' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
        ]);

        $thumbnailPath = $shopProduct->thumbnail;
        if ($request->hasFile('thumbnail')) {
            if ($shopProduct->thumbnail) {
                Storage::disk('public')->delete($shopProduct->thumbnail);
            }
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $shopProduct->update([
            'price' => $validated['price'] ?: null,
            'description' => $validated['description'] ?? null,
            'thumbnail' => $thumbnailPath,
        ]);

        return redirect()->route('shop-owner.shop-products.index')
            ->with('flash', ['type' => 'success', 'message' => 'Shop product updated.']);
    }

    public function destroy(ShopProduct $shopProduct): RedirectResponse
    {
        $shop = auth()->user()->shop;
        abort_if(! $shop || $shopProduct->shop_id !== $shop->id, 403);

        if ($shopProduct->thumbnail) {
            Storage::disk('public')->delete($shopProduct->thumbnail);
        }

        $shopProduct->delete();

        return redirect()->route('shop-owner.shop-products.index')
            ->with('flash', ['type' => 'success', 'message' => 'Product removed from your shop.']);
    }
}

