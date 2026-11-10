import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ShopOwner = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    shop: { id: number; name: string; is_active: boolean } | null;
};

type PaginatedOwners = {
    data: ShopOwner[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { total: number };
};

export default function ShopOwnersIndex({ shopOwners }: { shopOwners: PaginatedOwners }) {
    const handleDelete = (owner: ShopOwner) => {
        if (confirm(`Delete account for "${owner.name}"? This cannot be undone.`)) {
            router.delete(`/admin/shop-owners/${owner.id}`);
        }
    };

    return (
        <>
            <Head title="Shop Owners" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Shop Owners</h1>
                        <p className="text-muted-foreground">
                            {shopOwners.meta?.total ?? shopOwners.data.length} accounts
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/shop-owners/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Account
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Email</th>
                                        <th className="px-4 py-3 text-left font-medium">Shop</th>
                                        <th className="px-4 py-3 text-left font-medium">Joined</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shopOwners.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No shop owners yet.
                                            </td>
                                        </tr>
                                    )}
                                    {shopOwners.data.map((owner) => (
                                        <tr key={owner.id} className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                        {owner.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{owner.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{owner.email}</td>
                                            <td className="px-4 py-3">
                                                {owner.shop ? (
                                                    <div className="flex items-center gap-2">
                                                        <span>{owner.shop.name}</span>
                                                        <Badge
                                                            variant={owner.shop.is_active ? 'default' : 'secondary'}
                                                            className="text-xs"
                                                        >
                                                            {owner.shop.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground italic">No shop assigned</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{owner.created_at}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(owner)}
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

                {shopOwners.links && shopOwners.links.length > 3 && (
                    <div className="flex gap-1">
                        {shopOwners.links.map((link, i) => (
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

ShopOwnersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shop Owners', href: '/admin/shop-owners' },
    ],
};

