<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $shop = auth()->user()->shop;

        $myProductIds = $shop
            ? $shop->shopProducts()->pluck('product_id')->toArray()
            : [];

        $query = Product::with('creator')
            ->whereNotIn('id', $myProductIds);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('shop-owner/catalog/index', [
            'products' => $query->latest()->paginate(12)->through(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'price' => $p->price,
                'thumbnail_url' => $p->thumbnail_url,
                'creator' => $p->creator ? ['name' => $p->creator->name] : null,
            ]),
            'shop' => $shop ? ['id' => $shop->id, 'name' => $shop->name] : null,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function add(Request $request, Product $product): RedirectResponse
    {
        $shop = auth()->user()->shop;

        if (! $shop) {
            return back()->with('flash', ['type' => 'error', 'message' => 'You do not have a shop assigned yet.']);
        }

        $exists = $shop->shopProducts()->where('product_id', $product->id)->exists();

        if ($exists) {
            return back()->with('flash', ['type' => 'error', 'message' => 'Product is already in your shop.']);
        }

        $shop->shopProducts()->create([
            'product_id' => $product->id,
        ]);

        return back()->with('flash', ['type' => 'success', 'message' => "\"{$product->name}\" added to your shop."]);
    }
}

