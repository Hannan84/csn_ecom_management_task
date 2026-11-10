import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Owner = { id: number; name: string; email: string };

export default function ShopsCreate({ owners }: { owners: Owner[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        owner_id: '',
        is_active: true as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/shops');
    };

    return (
        <>
            <Head title="Create Shop" />
            <div className="flex flex-col gap-6 p-6 max-w-xl">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/shops">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Create Shop</h1>
                        <p className="text-muted-foreground">Add a new shop to the platform</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Shop Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Shop Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Alice's Electronics"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of the shop"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="owner_id">Shop Owner</Label>
                                <select
                                    id="owner_id"
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                    value={data.owner_id}
                                    onChange={(e) => setData('owner_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select an owner…</option>
                                    {owners.map((o) => (
                                        <option key={o.id} value={o.id}>
                                            {o.name} ({o.email})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.owner_id} />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <Label htmlFor="is_active">Active (visible to customers)</Label>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating…' : 'Create Shop'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/shops">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ShopsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Shops', href: '/admin/shops' },
        { title: 'Create', href: '/admin/shops/create' },
    ],
};

