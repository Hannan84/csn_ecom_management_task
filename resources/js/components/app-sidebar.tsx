import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Package,
    ShoppingBag,
    Store,
    Users,
    BookMarked,
    ShoppingCart,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { Auth } from '@/types';
import type { NavItem } from '@/types';

type PageProps = { auth: Auth };

const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Shops', href: '/admin/shops', icon: Store },
    { title: 'Products', href: '/admin/products', icon: Package },
    { title: 'Shop Owners', href: '/admin/shop-owners', icon: Users },
];

const shopOwnerNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Shared Catalog', href: '/shop-owner/catalog', icon: BookMarked },
    { title: 'My Shop Products', href: '/shop-owner/shop-products', icon: ShoppingBag },
];

const customerNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Browse Shops', href: '/shops', icon: ShoppingCart },
];

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const role = auth?.user?.role;

    const mainNavItems =
        role === 'admin'
            ? adminNavItems
            : role === 'shop_owner'
              ? shopOwnerNavItems
              : customerNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
