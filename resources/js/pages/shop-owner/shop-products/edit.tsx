import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ShopProduct = {
    id: number;
    price: string | null;
    description: string | null;
    thumbnail_url: string | null;
    product: {
        id: number;
        name: string;
        description: string | null;
        price: string;
        thumbnail_url: string | null;
    };
};

export default function ShopProductsEdit({ shopProduct }: { shopProduct: ShopProduct }) {
    const [preview, setPreview] = useState<string | null>(
        shopProduct.thumbnail_url ?? shopProduct.product.thumbnail_url,
    );

    const { data, setData, post, processing, errors } = useForm<{
        price: string;
        description: string;
        thumbnail: File | null;
        _method: string;
    }>({
        price: shopProduct.price ?? '',
        description: shopProduct.description ?? '',
        thumbnail: null,
        _method: 'PUT',
    });

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('thumbnail', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/shop-owner/shop-products/${shopProduct.id}`, { forceFormData: true });
    };

    return (
        <>
            <Head title="Edit Shop Product" />
            <div className="flex flex-col gap-6 p-6 max-w-xl">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/shop-owner/shop-products">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Customize Product</h1>
                        <p className="text-muted-foreground">{shopProduct.product.name}</p>
                    </div>
                </div>

                {/* Catalog defaults */}
                <Card className="bg-muted/40">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Catalog Defaults</CardTitle>
                        <CardDescription className="text-xs">
                            Leave fields blank to use the catalog defaults shown below
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <p>
                            <span className="text-muted-foreground">Base Price:</span>{' '}
                            <span className="font-medium">${shopProduct.product.price}</span>
                        </p>
                        {shopProduct.product.description && (
                            <p>
                                <span className="text-muted-foreground">Description:</span>{' '}
                                {shopProduct.product.description}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Customizations</CardTitle>
                        <CardDescription>Override the catalog defaults for your shop</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Your Price ($ — leave blank to use catalog price)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder={`Default: $${shopProduct.product.price}`}
                                />
                                <InputError message={errors.price} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Your Description (leave blank to use catalog)</Label>
                                <textarea
                                    id="description"
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Custom description for your shop…"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Thumbnail (leave unchanged to use catalog image)</Label>
                                <div className="flex items-center gap-4">
                                    {preview && (
                                        <img src={preview} alt="Preview" className="h-16 w-16 rounded object-cover border" />
                                    )}
                                    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground hover:bg-muted/50">
                                        <Upload className="h-4 w-4" />
                                        {preview ? 'Change image' : 'Upload custom image'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                                    </label>
                                </div>
                                <InputError message={errors.thumbnail} />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving…' : 'Save Customizations'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/shop-owner/shop-products">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ShopProductsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Shop Products', href: '/shop-owner/shop-products' },
        { title: 'Customize', href: '#' },
    ],
};

