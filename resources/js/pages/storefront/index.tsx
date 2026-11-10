import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, LogIn, ShoppingBag, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Auth } from '@/types';

type Shop = {
    id: number;
    name: string;
    description: string | null;
    shop_products_count: number;
    owner: { name: string };
};

export default function StorefrontIndex({ shops }: { shops: Shop[] }) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Shops - EcomMarket" />
            <div className="min-h-screen bg-background flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                    <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-90 transition">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <span>EcomMarket</span>
                        </Link>
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

                {/* Hero */}
                <section className="border-b bg-muted/30 py-12">
                    <div className="mx-auto max-w-6xl px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-background text-xs font-medium text-muted-foreground mb-4">
                            <span>Marketplace Storefront</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Browse Our Shops</h1>
                        <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
                            Explore available merchant shops and their curated product catalogs.
                        </p>
                    </div>
                </section>

                {/* Shops Grid */}
                <main className="mx-auto max-w-6xl px-4 py-10 flex-1 w-full">
                    {shops.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-muted-foreground">
                            <Store className="h-12 w-12" />
                            <p className="text-xl font-medium">No shops available right now</p>
                            <p className="text-sm">Check back soon for active shops!</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm text-muted-foreground">
                                    Showing <span className="font-semibold text-foreground">{shops.length}</span> active {shops.length === 1 ? 'shop' : 'shops'}
                                </p>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {shops.map((shop) => (
                                    <Card key={shop.id} className="flex flex-col hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <Store className="h-5 w-5" />
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {shop.shop_products_count} {shop.shop_products_count === 1 ? 'product' : 'products'}
                                                </Badge>
                                            </div>
                                            <CardTitle className="mt-3 text-lg">{shop.name}</CardTitle>
                                            {shop.description && (
                                                <CardDescription className="line-clamp-2 text-xs">
                                                    {shop.description}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xs text-muted-foreground">Owner: <span className="text-foreground font-medium">{shop.owner.name}</span></p>
                                        </CardContent>
                                        <CardFooter className="mt-auto">
                                            <Button asChild className="w-full">
                                                <Link href={`/shops/${shop.id}`}>
                                                    Visit Shop
                                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </>
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
