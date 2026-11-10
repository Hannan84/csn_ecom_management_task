<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ShopOwnerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/shop-owners/index', [
            'shopOwners' => User::where('role', 'shop_owner')
                ->with('shop')
                ->latest()
                ->paginate(10)
                ->through(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->toDateString(),
                    'shop' => $user->shop ? [
                        'id' => $user->shop->id,
                        'name' => $user->shop->name,
                        'is_active' => $user->shop->is_active,
                    ] : null,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/shop-owners/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'shop_owner',
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.shop-owners.index')
            ->with('flash', ['type' => 'success', 'message' => 'Shop owner account created.']);
    }

    public function destroy(Request $request, string|int $shop_owner): RedirectResponse
    {
        $user = User::where('role', 'shop_owner')->findOrFail($shop_owner);

        $user->delete();

        return redirect()->route('admin.shop-owners.index')
            ->with('flash', ['type' => 'success', 'message' => 'Shop owner account deleted.']);
    }
}

