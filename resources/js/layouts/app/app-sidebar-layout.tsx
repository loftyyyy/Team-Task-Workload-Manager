import { useState } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ViewAsProvider } from '@/hooks/use-view-as';
import type { AppLayoutProps } from '@/types';

export const DRAWER_WIDTH = 260;

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <ViewAsProvider>
            <AppShell>
                <AppSidebar open={sidebarOpen} />
                <AppContent>
                    <AppSidebarHeader
                        breadcrumbs={breadcrumbs}
                        sidebarOpen={sidebarOpen}
                        onToggleSidebar={() => setSidebarOpen((v) => !v)}
                    />
                    {children}
                </AppContent>
            </AppShell>
        </ViewAsProvider>
    );
}
