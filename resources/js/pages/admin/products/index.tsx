import { Head, Link, router } from '@inertiajs/react';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Product = {
    id: number;
    name: string;
    description: string | null;
    price: string;
    thumbnail_url: string | null;
    creator: { id: number; name: string };
    created_at: string;
};

type PaginatedProducts = {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { total: number };
};

export default function ProductsIndex({ products }: { products: PaginatedProducts }) {
    const handleDelete = (product: Product) => {
        if (confirm(`Delete "${product.name}" from the catalog? This cannot be undone.`)) {
            router.delete(`/admin/products/${product.id}`);
        }
    };

    return (
        <>
            <Head title="Manage Products" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Shared Product Catalog</h1>
                        <p className="text-muted-foreground">
                            {products.meta?.total ?? products.data.length} products in catalog
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Product</th>
                                        <th className="px-4 py-3 text-left font-medium">Price</th>
                                        <th className="px-4 py-3 text-left font-medium">Created By</th>
                                        <th className="px-4 py-3 text-left font-medium">Date</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No products in the catalog yet.
                                            </td>
                                        </tr>
                                    )}
                                    {products.data.map((product) => (
                                        <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {product.thumbnail_url ? (
                                                        <img
                                                            src={product.thumbnail_url}
                                                            alt={product.name}
                                                            className="h-10 w-10 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                                                            <Package className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        {product.description && (
                                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium">${product.price}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{product.creator.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{product.created_at}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Pencil className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(product)}
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

ProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Products', href: '/admin/products' },
    ],
};

