import { Head, Link, router } from '@inertiajs/react';
import { BookMarked, ExternalLink, Package, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Product = {
    id: number;
    name: string;
    description: string | null;
    price: string;
    thumbnail_url: string | null;
    creator: { name: string } | null;
};

type PaginatedProducts = {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { total: number };
};

type Shop = { id: number; name: string } | null;

export default function CatalogIndex({
    products,
    shop,
    filters,
}: {
    products: PaginatedProducts;
    shop: Shop;
    filters: { search: string | null };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [addingId, setAddingId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/shop-owner/catalog', { search }, { preserveState: true, replace: true });
    };

    const handleAdd = (product: Product) => {
        setAddingId(product.id);
        router.post(
            `/shop-owner/catalog/${product.id}/add`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setAddingId(null),
            },
        );
    };

    return (
        <>
            <Head title="Shared Catalog" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold">Shared Product Catalog</h1>
                        <p className="text-muted-foreground">
                            Browse and add products to{' '}
                            <span className="font-medium">{shop?.name ?? 'your shop'}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/shop-owner/shop-products/create">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Product
                            </Link>
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products…"
                    />
                    <Button type="submit" variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                {!shop && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
                        You don't have a shop assigned yet. Contact an admin to get one set up.
                    </div>
                )}

                {products.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
                        <BookMarked className="h-10 w-10" />
                        <p className="font-medium">No products found</p>
                        <p className="text-sm">
                            {filters.search
                                ? 'Try a different search term'
                                : 'All catalog products are already in your shop!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.data.map((product) => (
                            <Card key={product.id} className="flex flex-col">
                                <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                                    {product.thumbnail_url ? (
                                        <img
                                            src={product.thumbnail_url}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Package className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
                                    {product.description && (
                                        <CardDescription className="line-clamp-2 text-xs">
                                            {product.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <p className="text-lg font-bold">${product.price}</p>
                                    {product.creator && (
                                        <p className="text-xs text-muted-foreground">By {product.creator.name}</p>
                                    )}
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Button
                                        className="w-full"
                                        disabled={!shop || addingId === product.id}
                                        onClick={() => handleAdd(product)}
                                    >
                                        {addingId === product.id ? 'Adding…' : 'Add to My Shop'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {products.links && products.links.length > 3 && (
                    <div className="flex gap-1">
                        {products.links.map((link, i) => (
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

CatalogIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shared Catalog', href: '/shop-owner/catalog' },
    ],
};

