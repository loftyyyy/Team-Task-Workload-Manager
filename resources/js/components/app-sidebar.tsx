import { Link, router, usePage } from '@inertiajs/react';
import { ClipboardList, ListChecks } from 'lucide-react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useViewAs } from '@/hooks/use-view-as';
import { dashboard } from '@/routes';
import { dashboard as tasksDashboard, myWork } from '@/routes/tasks';
import { DRAWER_WIDTH } from '@/layouts/app/app-sidebar-layout';

const draculaBg = '#282a36';
const draculaCurrent = '#44475a';
const draculaFg = '#f8f8f2';
const draculaComment = '#6272a4';
const draculaPurple = '#bd93f9';

export function AppSidebar({ open }: { open: boolean }) {
    const { url } = usePage();
    const { role, setRole, setSelectedEmployeeId, setSelectedEmployeeName } = useViewAs();

    const goAdmin = () => {
        setRole('admin');
        setSelectedEmployeeId(null);
        setSelectedEmployeeName(null);
        router.visit(tasksDashboard().url);
    };

    const openEmployeeMenu = () => {
        setRole('employee');
        router.visit(myWork().url);
    };

    const taskNavItems = (
        role === 'admin'
            ? [{ title: 'Task Dashboard', href: tasksDashboard().url, icon: ClipboardList }]
            : [{ title: 'My Work', href: myWork().url, icon: ListChecks }]
    ) as { title: string; href: string; icon: React.ComponentType<{ size?: number }> }[];

    const isActive = (href: string) => url === href;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: open ? DRAWER_WIDTH : 0,
                flexShrink: 0,
                transition: 'width 0.2s ease',
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: draculaBg,
                    color: draculaFg,
                    borderRight: `1px solid ${draculaCurrent}`,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    transform: open ? 'translateX(0)' : `translateX(-${DRAWER_WIDTH}px)`,
                    transition: 'transform 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Box sx={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Link href={dashboard()} prefetch style={{ textDecoration: 'none', lineHeight: 0 }}>
                    <Typography variant="h6" sx={{ color: draculaPurple, fontWeight: 700, fontSize: 22, lineHeight: 1 }}>
                        TeamTask
                    </Typography>
                </Link>
            </Box>

            <Box sx={{ px: 2.5, pt: 3, pb: 1, flexShrink: 0 }}>
                <Typography
                    variant="caption"
                    sx={{ color: draculaComment, fontWeight: 600, letterSpacing: 1, fontSize: 10 }}
                >
                    PLATFORM
                </Typography>
            </Box>

            <Box sx={{ px: 1.5 }}>
                {taskNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            prefetch
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '8px 16px',
                                textDecoration: 'none',
                                color: active ? '#fff' : draculaFg,
                                fontSize: 14,
                                fontWeight: active ? 700 : 500,
                                borderRadius: 8,
                                background: active ? draculaPurple : 'transparent',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => {
                                if (!active) e.currentTarget.style.background = draculaCurrent;
                            }}
                            onMouseLeave={(e) => {
                                if (!active) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <Icon size={20} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </Box>

            <Box sx={{ mt: 'auto', pt: 2 }}>
                <Divider sx={{ borderColor: draculaCurrent, mb: 2 }} />
                <Box sx={{ display: 'flex', borderRadius: 1.5, overflow: 'hidden', bgcolor: draculaCurrent, mx: 2 }}>
                    <Button
                        fullWidth
                        size="small"
                        onClick={goAdmin}
                        sx={{
                            py: 0.5,
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'none',
                            color: role === 'admin' ? draculaBg : draculaComment,
                            bgcolor: role === 'admin' ? draculaPurple : 'transparent',
                            borderRadius: 0,
                            '&:hover': { bgcolor: role === 'admin' ? draculaPurple : 'rgba(255,255,255,0.05)' },
                        }}
                    >
                        Admin
                    </Button>
                    <Button
                        fullWidth
                        size="small"
                        onClick={openEmployeeMenu}
                        sx={{
                            py: 0.5,
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'none',
                            color: role === 'employee' ? draculaBg : draculaComment,
                            bgcolor: role === 'employee' ? draculaPurple : 'transparent',
                            borderRadius: 0,
                            '&:hover': { bgcolor: role === 'employee' ? draculaPurple : 'rgba(255,255,255,0.05)' },
                        }}
                    >
                        Employee
                    </Button>
                </Box>
            </Box>
            <Box sx={{ height: 16, flexShrink: 0 }} />
        </Drawer>
    );
}
