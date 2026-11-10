import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Shop = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    shop_products_count: number;
    owner: { id: number; name: string; email: string };
    created_at: string;
};

type PaginatedShops = {
    data: Shop[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { current_page: number; last_page: number; total: number };
};

export default function ShopsIndex({ shops }: { shops: PaginatedShops }) {
    const handleDelete = (shop: Shop) => {
        if (confirm(`Delete "${shop.name}"? This cannot be undone.`)) {
            router.delete(`/admin/shops/${shop.id}`);
        }
    };

    return (
        <>
            <Head title="Manage Shops" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Shops</h1>
                        <p className="text-muted-foreground">
                            {shops.meta?.total ?? shops.data.length} shops total
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/shops/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New Shop
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Shop</th>
                                        <th className="px-4 py-3 text-left font-medium">Owner</th>
                                        <th className="px-4 py-3 text-left font-medium">Products</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-left font-medium">Created</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shops.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                No shops yet. Create one to get started.
                                            </td>
                                        </tr>
                                    )}
                                    {shops.data.map((shop) => (
                                        <tr key={shop.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Store className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">{shop.name}</p>
                                                        {shop.description && (
                                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                                {shop.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{shop.owner.name}</p>
                                                <p className="text-xs text-muted-foreground">{shop.owner.email}</p>
                                            </td>
                                            <td className="px-4 py-3">{shop.shop_products_count}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={shop.is_active ? 'default' : 'secondary'}>
                                                    {shop.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{shop.created_at}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/admin/shops/${shop.id}/edit`}>
                                                            <Pencil className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(shop)}
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

                {shops.links && shops.links.length > 3 && (
                    <div className="flex gap-1">
                        {shops.links.map((link, i) => (
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

ShopsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shops', href: '/admin/shops' },
    ],
};

