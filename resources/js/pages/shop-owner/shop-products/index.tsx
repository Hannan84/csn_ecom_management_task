import { Head, Link, router } from '@inertiajs/react';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ShopProduct = {
    id: number;
    effective_price: string;
    effective_thumbnail_url: string | null;
    price: string | null;
    description: string | null;
    product: {
        id: number;
        name: string;
        description: string | null;
        price: string;
        thumbnail_url: string | null;
    };
};

type PaginatedShopProducts = {
    data: ShopProduct[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { total: number };
};

type Shop = { id: number; name: string } | null;

export default function ShopProductsIndex({
    shopProducts,
    shop,
}: {
    shopProducts: PaginatedShopProducts;
    shop: Shop;
}) {
    const handleRemove = (sp: ShopProduct) => {
        if (confirm(`Remove "${sp.product.name}" from your shop?`)) {
            router.delete(`/shop-owner/shop-products/${sp.id}`);
        }
    };

    return (
        <>
            <Head title="My Shop Products" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {shop?.name ?? 'My Shop'} — Products
                        </h1>
                        <p className="text-muted-foreground">
                            {shopProducts.meta?.total ?? shopProducts.data.length} products in your shop
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/shop-owner/catalog">Browse Catalog</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/shop-owner/shop-products/create">
                                <Plus className="mr-2 h-4 w-4" />
                                New Product
                            </Link>
                        </Button>
                    </div>
                </div>

                {!shop && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
                        You don't have a shop assigned yet. Contact an admin to create one for you.
                    </div>
                )}

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Product</th>
                                        <th className="px-4 py-3 text-left font-medium">Catalog Price</th>
                                        <th className="px-4 py-3 text-left font-medium">My Price</th>
                                        <th className="px-4 py-3 text-left font-medium">Custom</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shopProducts.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                                                No products in your shop yet.{' '}
                                                <Link href="/shop-owner/catalog" className="underline">
                                                    Browse the catalog
                                                </Link>{' '}
                                                to add some.
                                            </td>
                                        </tr>
                                    )}
                                    {shopProducts.data.map((sp) => (
                                        <tr key={sp.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {sp.effective_thumbnail_url ? (
                                                        <img
                                                            src={sp.effective_thumbnail_url}
                                                            alt={sp.product.name}
                                                            className="h-10 w-10 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                                                            <Package className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{sp.product.name}</p>
                                                        {(sp.description ?? sp.product.description) && (
                                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                                {sp.description ?? sp.product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">${sp.product.price}</td>
                                            <td className="px-4 py-3 font-medium">${sp.effective_price}</td>
                                            <td className="px-4 py-3">
                                                {sp.price || sp.description || sp.effective_thumbnail_url !== sp.product.thumbnail_url ? (
                                                    <Badge variant="secondary" className="text-xs">Customized</Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Default</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/shop-owner/shop-products/${sp.id}/edit`}>
                                                            <Pencil className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleRemove(sp)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {shopProducts.links && shopProducts.links.length > 3 && (
                    <div className="flex gap-1">
                        {shopProducts.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ShopProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Shop Products', href: '/shop-owner/shop-products' },
    ],
};

