<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('storefront/index', [
            'shops' => Shop::where('is_active', true)
                ->with('owner')
                ->withCount('shopProducts')
                ->latest()
                ->get()
                ->map(fn ($shop) => [
                    'id' => $shop->id,
                    'name' => $shop->name,
                    'description' => $shop->description,
                    'shop_products_count' => $shop->shop_products_count,
                    'owner' => ['name' => $shop->owner->name],
                ]),
        ]);
    }

    public function show(Shop $shop): Response
    {
        abort_if(! $shop->is_active, 404);

        return Inertia::render('storefront/show', [
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
                'description' => $shop->description,
                'owner' => ['name' => $shop->owner->name],
            ],
            'shopProducts' => $shop->shopProducts()
                ->with('product')
                ->paginate(12)
                ->through(fn ($sp) => [
                    'id' => $sp->id,
                    'effective_price' => $sp->effective_price,
                    'effective_thumbnail_url' => $sp->effective_thumbnail_url,
                    'description' => $sp->description ?? $sp->product?->description,
                    'product' => [
                        'id' => $sp->product->id,
                        'name' => $sp->product->name,
                    ],
                ]),
        ]);
    }
}

