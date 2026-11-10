<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureShopOwner
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (! $request->user() || $request->user()->role !== 'shop_owner') {
            abort(403, 'Access denied. Shop owners only.');
        }

        return $next($request);
    }
}

