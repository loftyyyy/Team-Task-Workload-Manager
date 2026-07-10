import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ViewAsProvider } from '@/hooks/use-view-as';
import type { AppLayoutProps } from '@/types';

const DRAWER_WIDTH = 260;

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <ViewAsProvider>
            <AppShell>
                <AppSidebar />
                <div style={{ marginLeft: DRAWER_WIDTH, width: `calc(100% - ${DRAWER_WIDTH}px)` }}>
                    <AppContent>
                        <AppSidebarHeader breadcrumbs={breadcrumbs} />
                        {children}
                    </AppContent>
                </div>
            </AppShell>
        </ViewAsProvider>
    );
}
