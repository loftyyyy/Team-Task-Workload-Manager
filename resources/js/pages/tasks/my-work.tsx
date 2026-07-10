import { useState, useEffect, useCallback, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { useViewAs } from '@/hooks/use-view-as';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { myWork } from '@/routes/tasks';
import type { Task, TaskStatus } from '@/types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const statusLabel: Record<TaskStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
};

const statusColor: Record<TaskStatus, 'default' | 'primary' | 'success'> = {
    pending: 'default',
    in_progress: 'primary',
    completed: 'success',
};

function getNextAction(task: Task): { label: string; nextStatus: TaskStatus; icon: React.ReactNode } | null {
    if (task.status === 'pending') {
        return { label: 'Start', nextStatus: 'in_progress', icon: <PlayArrowIcon fontSize="small" /> };
    }
    if (task.status === 'in_progress') {
        return { label: 'Complete', nextStatus: 'completed', icon: <CheckCircleIcon fontSize="small" /> };
    }
    return null;
}

interface Employee {
    id: number;
    name: string;
}

export default function MyWork() {
    const { effectiveUserId, selectedEmployeeId, setSelectedEmployeeId, setSelectedEmployeeName, role } = useViewAs();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [picking, setPicking] = useState(true);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const fetchTasks = useCallback(() => {
        setLoading(true);
        fetch(TaskController.index.url({ query: { user_id: effectiveUserId } }), {
            headers: { Accept: 'application/json' },
        })
            .then((r) => r.json())
            .then((data) => setTasks(Array.isArray(data) ? data : []))
            .catch(() => setError('Failed to load tasks'))
            .finally(() => setLoading(false));
    }, [effectiveUserId]);

    useEffect(() => {
        if (role === 'employee' && selectedEmployeeId === null) {
            setLoading(false);
            fetch(UserController.employees.url(), {
                headers: { Accept: 'application/json' },
            })
                .then((r) => r.json())
                .then((data) => {
                    const list = Array.isArray(data) ? data : [];
                    setEmployees(list);
                    if (list.length === 1) {
                        setSelectedEmployeeId(list[0].id);
                        setSelectedEmployeeName(list[0].name);
                    }
                    setPicking(false);
                })
                .catch(() => {
                    setError('Failed to load employees');
                    setPicking(false);
                });
            return;
        }
        setPicking(false);
        fetchTasks();
    }, [fetchTasks, role, selectedEmployeeId, setSelectedEmployeeId, setSelectedEmployeeName]);

    useEffect(() => {
        if (employees.length > 1 && buttonRef.current && selectedEmployeeId === null) {
            setMenuAnchor(buttonRef.current);
        }
    }, [employees, selectedEmployeeId]);

    const handleStatusUpdate = async (task: Task, nextStatus: TaskStatus) => {
        setUpdatingIds((prev) => new Set(prev).add(task.id));
        setError('');

        try {
            const res = await fetch(TaskController.update.url(task.id), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ status: nextStatus }),
            });
            if (!res.ok) throw new Error('Update failed');
            const updated: Task = await res.json();
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        } catch {
            setError(`Failed to update task "${task.title}"`);
        } finally {
            setUpdatingIds((prev) => {
                const next = new Set(prev);
                next.delete(task.id);
                return next;
            });
        }
    };

    if (loading || picking) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (role === 'employee' && selectedEmployeeId === null) {
        return (
            <>
                <Head title="My Work" />
                <Box sx={{ p: 3, maxWidth: 900, mx: 'auto', textAlign: 'center', py: 8 }}>
                    <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: 16 }}>
                        Please select an employee
                    </Typography>
                    <Button
                        ref={buttonRef}
                        variant="outlined"
                        onClick={(e) => setMenuAnchor(menuAnchor ? null : e.currentTarget)}
                        sx={{ color: '#f8f8f2', borderColor: '#bd93f9' }}
                    >
                        {employees.length === 0 ? 'No employees available' : 'Choose employee...'}
                    </Button>
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={() => setMenuAnchor(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        slotProps={{ paper: { sx: { bgcolor: '#44475a', color: '#f8f8f2', minWidth: 200 } } }}
                    >
                        {employees.map((emp) => (
                            <MenuItem
                                key={emp.id}
                                onClick={() => {
                                    setSelectedEmployeeId(emp.id);
                                    setSelectedEmployeeName(emp.name);
                                    setMenuAnchor(null);
                                }}
                                sx={{ fontSize: 13 }}
                            >
                                {emp.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </>
        );
    }

    return (
        <>
            <Head title="My Work" />
            <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {tasks.length === 0 && (
                    <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                        No tasks assigned to you yet.
                    </Typography>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tasks.map((task) => {
                        const action = getNextAction(task);
                        return (
                            <Card variant="outlined" key={task.id}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {task.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                        {task.description}
                                    </Typography>
                                    <Chip
                                        label={statusLabel[task.status]}
                                        size="small"
                                        color={statusColor[task.status]}
                                    />
                                </CardContent>
                                {action && (
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={action.icon}
                                            disabled={updatingIds.has(task.id)}
                                            onClick={() => handleStatusUpdate(task, action.nextStatus)}
                                        >
                                            {updatingIds.has(task.id) ? 'Updating...' : action.label}
                                        </Button>
                                    </CardActions>
                                )}
                            </Card>
                        );
                    })}
                </Box>
            </Box>
        </>
    );
}

MyWork.layout = {
    breadcrumbs: [
        {
            title: 'My Work',
            href: myWork(),
        },
    ],
};
