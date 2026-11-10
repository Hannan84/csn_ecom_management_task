<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ShopProduct extends Model
{
    protected $fillable = [
        'shop_id',
        'product_id',
        'price',
        'thumbnail',
        'description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    protected $appends = ['effective_price', 'effective_thumbnail_url'];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getEffectivePriceAttribute(): string
    {
        return $this->price ?? $this->product?->price ?? '0.00';
    }

    public function getEffectiveThumbnailUrlAttribute(): ?string
    {
        $thumb = $this->thumbnail ?? $this->product?->thumbnail;
        return $thumb ? Storage::url($thumb) : null;
    }
}

