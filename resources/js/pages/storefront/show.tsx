import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, LogIn, Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Auth } from '@/types';

type ShopProduct = {
    id: number;
    effective_price: string;
    effective_thumbnail_url: string | null;
    description: string | null;
    product: { id: number; name: string };
};

type PaginatedShopProducts = {
    data: ShopProduct[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { total: number };
};

type Shop = {
    id: number;
    name: string;
    description: string | null;
    owner: { name: string };
};

export default function StorefrontShow({
    shop,
    shopProducts,
}: {
    shop: Shop;
    shopProducts: PaginatedShopProducts;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title={`${shop.name} - EcomMarket`} />
            <div className="min-h-screen bg-background flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                    <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    All Shops
                                </Link>
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                    <ShoppingBag className="h-4 w-4" />
                                </div>
                                <span className="font-bold text-base">{shop.name}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {auth?.user ? (
                                <Button asChild size="sm">
                                    <Link href="/dashboard">
                                        Dashboard ({auth.user.role})
                                        <ArrowRight className="ml-1.5 h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/login">
                                            <LogIn className="mr-1.5 h-4 w-4" />
                                            Log in
                                        </Link>
                                    </Button>
                                    <Button size="sm" asChild>
                                        <Link href="/register">Register</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Shop hero */}
                <section className="border-b bg-muted/30 py-8">
                    <div className="mx-auto max-w-6xl px-4">
                        <h1 className="text-2xl sm:text-3xl font-extrabold">{shop.name}</h1>
                        {shop.description && (
                            <p className="mt-1.5 text-sm text-muted-foreground">{shop.description}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">Operated by {shop.owner.name}</p>
                    </div>
                </section>

                {/* Products */}
                <main className="mx-auto max-w-6xl px-4 py-8 flex-1 w-full">
                    {shopProducts.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-muted-foreground">
                            <Package className="h-12 w-12" />
                            <p className="text-xl font-medium">No products listed yet</p>
                            <p className="text-sm">This shop hasn't added any products to its storefront yet.</p>
                        </div>
                    ) : (
                        <>
                            <p className="mb-6 text-sm text-muted-foreground">
                                {shopProducts.meta?.total ?? shopProducts.data.length} products available
                            </p>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {shopProducts.data.map((sp) => (
                                    <Card key={sp.id} className="flex flex-col hover:shadow-md transition-shadow">
                                        <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                                            {sp.effective_thumbnail_url ? (
                                                <img
                                                    src={sp.effective_thumbnail_url}
                                                    alt={sp.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base line-clamp-1">{sp.product.name}</CardTitle>
                                            {sp.description && (
                                                <CardDescription className="text-xs line-clamp-2">
                                                    {sp.description}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="mt-auto pt-2">
                                            <p className="text-xl font-bold text-primary">${sp.effective_price}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}

                    {shopProducts.links && shopProducts.links.length > 3 && (
                        <div className="mt-6 flex gap-1">
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
                </main>

                {/* Footer */}
                <footer className="border-t py-6 text-center text-xs text-muted-foreground">
                    EcomMarket &bull; Shared Catalog E-Commerce System
                </footer>
            </div>
        </>
    );
}
