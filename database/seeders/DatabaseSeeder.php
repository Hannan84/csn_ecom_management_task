<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Shop owner 1
        $owner1 = User::create([
            'name' => 'John Doe',
            'email' => 'shop1@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'shop_owner',
            'email_verified_at' => now(),
        ]);

        // Shop owner 2
        $owner2 = User::create([
            'name' => 'Jane Doe',
            'email' => 'shop2@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'shop_owner',
            'email_verified_at' => now(),
        ]);

        // Shops
        $shop1 = Shop::create([
            'name' => 'John\'s Electronics',
            'description' => 'Premium electronics and gadgets for everyday life.',
            'owner_id' => $owner1->id,
            'is_active' => true,
        ]);

        $shop2 = Shop::create([
            'name' => 'Jane\'s Fashion Store',
            'description' => 'Trendy clothing and accessories for all occasions.',
            'owner_id' => $owner2->id,
            'is_active' => true,
        ]);

        // Shared catalog products (created by admin)
        $p1 = Product::create([
            'name' => 'Wireless Earbuds Pro',
            'description' => 'High-quality wireless earbuds with noise cancellation.',
            'price' => 79.99,
            'created_by' => $admin->id,
        ]);

        $p2 = Product::create([
            'name' => 'Smart Watch Series X',
            'description' => 'Feature-rich smartwatch with health tracking.',
            'price' => 199.99,
            'created_by' => $admin->id,
        ]);

        $p3 = Product::create([
            'name' => 'Portable Power Bank',
            'description' => '20000mAh fast-charging power bank.',
            'price' => 39.99,
            'created_by' => $admin->id,
        ]);

        // Products created by shop owners
        $p4 = Product::create([
            'name' => 'Classic Leather Jacket',
            'description' => 'Genuine leather jacket, available in multiple sizes.',
            'price' => 149.99,
            'created_by' => $owner2->id,
        ]);

        $p5 = Product::create([
            'name' => 'Running Sneakers',
            'description' => 'Lightweight and comfortable running shoes.',
            'price' => 89.99,
            'created_by' => $owner2->id,
        ]);

        $p6 = Product::create([
            'name' => 'USB-C Hub 7-in-1',
            'description' => 'Expand your laptop connectivity with 7 ports.',
            'price' => 49.99,
            'created_by' => $owner1->id,
        ]);

        // Shop 1 products
        ShopProduct::create(['shop_id' => $shop1->id, 'product_id' => $p1->id]);
        ShopProduct::create(['shop_id' => $shop1->id, 'product_id' => $p2->id, 'price' => 189.99]);
        ShopProduct::create(['shop_id' => $shop1->id, 'product_id' => $p3->id]);
        ShopProduct::create(['shop_id' => $shop1->id, 'product_id' => $p6->id]);

        // Shop 2 products
        ShopProduct::create(['shop_id' => $shop2->id, 'product_id' => $p4->id]);
        ShopProduct::create(['shop_id' => $shop2->id, 'product_id' => $p5->id, 'price' => 79.99]);
        ShopProduct::create(['shop_id' => $shop2->id, 'product_id' => $p1->id, 'price' => 74.99,
            'description' => 'Perfect for workouts and daily use!',
        ]);
    }
}
