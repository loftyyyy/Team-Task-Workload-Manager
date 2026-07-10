import { Link, router } from '@inertiajs/react';
import { ClipboardList, ListChecks } from 'lucide-react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useViewAs } from '@/hooks/use-view-as';
import { dashboard } from '@/routes';
import { dashboard as tasksDashboard, myWork } from '@/routes/tasks';

const DRAWER_WIDTH = 260;

const draculaBg = '#282a36';
const draculaCurrent = '#44475a';
const draculaFg = '#f8f8f2';
const draculaComment = '#6272a4';
const draculaPurple = '#bd93f9';

export function AppSidebar() {
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

    const linkStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        textDecoration: 'none',
        color: draculaFg,
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 8,
        transition: 'background 0.15s',
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: draculaBg,
                    color: draculaFg,
                    borderRight: `1px solid ${draculaCurrent}`,
                },
            }}
        >
            <Box sx={{ px: 2.5, py: 2.5 }}>
                <Link href={dashboard()} prefetch style={{ textDecoration: 'none' }}>
                    <Typography variant="h6" sx={{ color: draculaPurple, fontWeight: 700, fontSize: 18 }}>
                        TeamTask
                    </Typography>
                </Link>
            </Box>

            <Divider sx={{ borderColor: draculaCurrent }} />

            <Typography
                variant="caption"
                sx={{ px: 2.5, pt: 2.5, pb: 1, color: draculaComment, fontWeight: 600, letterSpacing: 1 }}
            >
                PLATFORM
            </Typography>

            <Box sx={{ px: 1.5 }}>
                {taskNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            prefetch
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.background = draculaCurrent)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            <Icon size={20} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </Box>

            <Box sx={{ px: 2, py: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', borderRadius: 1.5, overflow: 'hidden', bgcolor: draculaCurrent }}>
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
        </Drawer>
    );
}
