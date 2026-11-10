import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { BookMarked, Package, ShoppingBag, ShoppingCart, Store, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { Auth } from '@/types';

type PageProps = { auth: Auth };

function AdminDashboard() {
    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your e-commerce platform</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shops</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">Create and manage shops</p>
                        <Button asChild size="sm">
                            <Link href="/admin/shops">Manage Shops</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">Manage shared product catalog</p>
                        <Button asChild size="sm">
                            <Link href="/admin/products">Manage Products</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shop Owners</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">Create and manage accounts</p>
                        <Button asChild size="sm">
                            <Link href="/admin/shop-owners">Manage Owners</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ShopOwnerDashboard({ name }: { name: string }) {
    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome back, {name}!</h1>
                <p className="text-muted-foreground">Manage your shop and products</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shared Catalog</CardTitle>
                        <BookMarked className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">
                            Browse and add products from the shared catalog to your shop
                        </p>
                        <Button asChild size="sm">
                            <Link href="/shop-owner/catalog">Browse Catalog</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Shop Products</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">
                            View and manage products listed in your shop
                        </p>
                        <Button asChild size="sm">
                            <Link href="/shop-owner/shop-products">View My Products</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function CustomerDashboard() {
    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground">Browse our marketplace shops</p>
            </div>
            <Card className="max-w-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Browse Shops</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                        Explore all available shops and their products
                    </p>
                    <Button asChild size="sm">
                        <Link href="/shops">View All Shops</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const role = auth?.user?.role;

    return (
        <>
            <Head title="Dashboard" />
            {role === 'admin' && <AdminDashboard />}
            {role === 'shop_owner' && <ShopOwnerDashboard name={auth.user.name} />}
            {role === 'customer' && <CustomerDashboard />}
            {!role && <CustomerDashboard />}
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
