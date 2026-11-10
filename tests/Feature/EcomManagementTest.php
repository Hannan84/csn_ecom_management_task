<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EcomManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $owner1;
    private User $owner2;
    private Shop $shop1;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->owner1 = User::factory()->create([
            'role' => 'shop_owner',
            'email_verified_at' => now(),
        ]);

        $this->owner2 = User::factory()->create([
            'role' => 'shop_owner',
            'email_verified_at' => now(),
        ]);

        $this->shop1 = Shop::create([
            'name' => 'Alice Tech',
            'description' => 'Gadgets',
            'owner_id' => $this->owner1->id,
            'is_active' => true,
        ]);
    }

    public function test_guests_cannot_access_admin_or_shop_owner_routes(): void
    {
        $this->get('/admin/shops')->assertRedirect('/login');
        $this->get('/admin/products')->assertRedirect('/login');
        $this->get('/shop-owner/catalog')->assertRedirect('/login');
        $this->get('/shop-owner/shop-products')->assertRedirect('/login');
    }

    public function test_shop_owners_cannot_access_admin_routes(): void
    {
        $this->actingAs($this->owner1)
            ->get('/admin/shops')
            ->assertForbidden();
    }

    public function test_admin_can_create_shop(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/shops', [
            'name' => 'New Electronics Shop',
            'description' => 'Test store',
            'owner_id' => $this->owner2->id,
            'is_active' => true,
        ]);

        $response->assertRedirect('/admin/shops');
        $this->assertDatabaseHas('shops', ['name' => 'New Electronics Shop']);
    }

    public function test_admin_can_add_product_to_shared_catalog(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/products', [
            'name' => 'Admin Wireless Mouse',
            'description' => 'Ergonomic optical mouse',
            'price' => '29.99',
        ]);

        $response->assertRedirect('/admin/products');
        $this->assertDatabaseHas('products', [
            'name' => 'Admin Wireless Mouse',
            'created_by' => $this->admin->id,
        ]);
    }

    public function test_admin_can_create_shop_owner_account(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/shop-owners', [
            'name' => 'Charlie Owner',
            'email' => 'charlie@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect('/admin/shop-owners');
        $this->assertDatabaseHas('users', [
            'email' => 'charlie@test.com',
            'role' => 'shop_owner',
        ]);
    }

    public function test_admin_can_delete_shop_owner_account(): void
    {
        $owner = User::factory()->create([
            'role' => 'shop_owner',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->delete("/admin/shop-owners/{$owner->id}");

        $response->assertRedirect('/admin/shop-owners');
        $this->assertDatabaseMissing('users', ['id' => $owner->id]);
    }

    public function test_shop_owner_can_add_product_from_catalog_to_shop(): void
    {
        $product = Product::create([
            'name' => 'Shared Keyboard',
            'price' => '49.99',
            'created_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->owner1)
            ->post("/shop-owner/catalog/{$product->id}/add");

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $this->shop1->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_products_created_by_shop_owner_become_available_in_shared_catalog(): void
    {
        $response = $this->actingAs($this->owner1)->post('/shop-owner/shop-products', [
            'name' => 'Owner Custom Headset',
            'description' => 'Noise isolating',
            'price' => '89.00',
        ]);

        $response->assertRedirect('/shop-owner/shop-products');

        // Check it was added to shared catalog
        $this->assertDatabaseHas('products', [
            'name' => 'Owner Custom Headset',
            'created_by' => $this->owner1->id,
        ]);

        // Check it was assigned to owner's shop
        $product = Product::where('name', 'Owner Custom Headset')->first();
        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $this->shop1->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_shop_owner_can_customize_price_and_description_for_their_shop(): void
    {
        $product = Product::create([
            'name' => 'Universal Cable',
            'price' => '15.00',
            'description' => 'Standard cable',
            'created_by' => $this->admin->id,
        ]);

        $shopProduct = ShopProduct::create([
            'shop_id' => $this->shop1->id,
            'product_id' => $product->id,
        ]);

        $response = $this->actingAs($this->owner1)
            ->put("/shop-owner/shop-products/{$shopProduct->id}", [
                'price' => '19.99',
                'description' => 'Special braided edition',
            ]);

        $response->assertRedirect('/shop-owner/shop-products');
        $this->assertDatabaseHas('shop_products', [
            'id' => $shopProduct->id,
            'price' => '19.99',
            'description' => 'Special braided edition',
        ]);
    }

    public function test_customer_only_sees_products_assigned_to_shop(): void
    {
        // Assigned product
        $assigned = Product::create([
            'name' => 'Assigned Product',
            'price' => '10.00',
            'created_by' => $this->admin->id,
        ]);
        ShopProduct::create([
            'shop_id' => $this->shop1->id,
            'product_id' => $assigned->id,
            'price' => '12.50',
        ]);

        // Unassigned product (only in shared catalog)
        $unassigned = Product::create([
            'name' => 'Secret Unassigned Product',
            'price' => '100.00',
            'created_by' => $this->admin->id,
        ]);

        $response = $this->get("/shops/{$this->shop1->id}");
        $response->assertOk();

        // Customer sees assigned product and custom price
        $response->assertSee('Assigned Product');
        $response->assertSee('12.50');

        // Customer does not see unassigned catalog product
        $response->assertDontSee('Secret Unassigned Product');
    }
}
