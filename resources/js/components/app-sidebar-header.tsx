import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Breadcrumbs } from '@/components/breadcrumbs';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                alignItems: 'center',
                height: 64,
                px: 3,
                borderBottom: '1px solid #44475a',
                bgcolor: '#282a36',
            }}
        >
            <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Box>
    );
}
