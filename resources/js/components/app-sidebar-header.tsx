import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuOpen from '@mui/icons-material/MenuOpen';
import Menu from '@mui/icons-material/Menu';
import { Breadcrumbs } from '@/components/breadcrumbs';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const draculaComment = '#6272a4';

export function AppSidebarHeader({
    breadcrumbs = [],
    sidebarOpen,
    onToggleSidebar,
}: {
    breadcrumbs?: BreadcrumbItemType[];
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
}) {
    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                alignItems: 'center',
                height: 64,
                px: 2,
                gap: 1,
                borderBottom: '1px solid #44475a',
                bgcolor: '#282a36',
            }}
        >
            <IconButton onClick={onToggleSidebar} sx={{ color: draculaComment }}>
                {sidebarOpen ? <MenuOpen /> : <Menu />}
            </IconButton>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Box>
    );
}
