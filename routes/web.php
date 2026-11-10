<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Customer\StorefrontController;
use App\Http\Controllers\ShopOwner;
use Illuminate\Support\Facades\Route;

// Public storefront
Route::get('/', [StorefrontController::class, 'index'])->name('home');
Route::get('/shops', [StorefrontController::class, 'index'])->name('shops.index');
Route::get('/shops/{shop}', [StorefrontController::class, 'show'])->name('shops.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// Admin routes
Route::prefix('admin')
    ->middleware(['auth', 'verified', 'admin'])
    ->name('admin.')
    ->group(function () {
        Route::resource('shops', Admin\ShopController::class);
        Route::resource('products', Admin\ProductController::class);
        Route::resource('shop-owners', Admin\ShopOwnerController::class)
            ->parameters(['shop-owners' => 'shop_owner'])
            ->only(['index', 'create', 'store', 'destroy']);
    });

// Shop Owner routes
Route::prefix('shop-owner')
    ->middleware(['auth', 'verified', 'shop_owner'])
    ->name('shop-owner.')
    ->group(function () {
        Route::get('/catalog', [ShopOwner\CatalogController::class, 'index'])->name('catalog.index');
        Route::post('/catalog/{product}/add', [ShopOwner\CatalogController::class, 'add'])->name('catalog.add');
        Route::resource('shop-products', ShopOwner\ShopProductController::class);
    });

require __DIR__.'/settings.php';
