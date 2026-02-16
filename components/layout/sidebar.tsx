'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    BookOpen,
    PieChart,
    Settings,
    ChevronLeft,
    ChevronRight,
    Wallet,
    Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    const toggleCollapse = () => setCollapsed(!collapsed);
    const toggleMobile = () => setMobileOpen(!mobileOpen);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
        { name: 'Journal', icon: BookOpen, href: '/journal' }, // Future route
        { name: 'Portfolio', icon: PieChart, href: '/portfolio' }, // Future route
        { name: 'Settings', icon: Settings, href: '/settings' }, // Future route
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="ghost" size="icon" onClick={toggleMobile}>
                    <Menu className="h-6 w-6 text-white" />
                </Button>
            </div>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 bg-[#0A0A0A] border-r border-[#1F1F1F] transition-all duration-300 ease-in-out flex flex-col',
                    collapsed ? 'w-20' : 'w-64',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                )}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center px-4 border-b border-[#1F1F1F]">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Logo className="h-10 w-10" />
                        {!collapsed && (
                            <span className="font-bold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                                Deriverse
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                                    isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 neon-border-green'
                                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-white',
                                    collapsed && 'justify-center px-2'
                                )}
                            >
                                <item.icon className={cn('h-5 w-5', isActive && 'text-emerald-400')} />
                                {!collapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-[#1F1F1F]">
                    {/* Collapse Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className="hidden md:flex w-full items-center justify-center p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors mb-4"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span className="text-sm">Collapse</span></div>}
                    </button>

                    {/* Wallet Status */}
                    {/* Wallet Status */}
                    <div className={cn('flex justify-center', collapsed ? 'p-2' : 'px-3')}>
                        <WalletMultiButton className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-xl !h-10 !text-sm !font-semibold !px-4 w-full justify-center" />
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
}
