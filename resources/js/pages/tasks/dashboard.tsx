import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useViewAs } from '@/hooks/use-view-as';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { dashboard } from '@/routes/tasks';
import type { Task, TaskStatus } from '@/types';
import type { User } from '@/types/auth';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';

const statusColor: Record<TaskStatus, 'default' | 'primary' | 'success'> = {
    pending: 'default',
    in_progress: 'primary',
    completed: 'success',
};

export default function TaskDashboard() {
    const { effectiveUserId } = useViewAs();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<User[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            fetch(
                UserController.employees.url({ query: { user_id: effectiveUserId } }),
                { headers: { Accept: 'application/json' } },
            ).then((r) => r.json()),
            fetch(
                TaskController.index.url({ query: { user_id: effectiveUserId } }),
                { headers: { Accept: 'application/json' } },
            ).then((r) => r.json()),
        ])
            .then(([empData, taskData]) => {
                setEmployees(Array.isArray(empData) ? empData : []);
                setTasks(Array.isArray(taskData) ? taskData : []);
            })
            .catch(() => setError('Failed to load data'))
            .finally(() => setLoading(false));
    }, [effectiveUserId]);

    const handleCreate = async () => {
        if (!title.trim() || selectedEmployees.length === 0) return;

        try {
            const res = await fetch(TaskController.store.url(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    user_id: effectiveUserId,
                    title: title.trim(),
                    description: description.trim(),
                    user_ids: selectedEmployees.map((u) => u.id),
                }),
            });
            if (!res.ok) throw new Error('Failed to create task');
            const newTask: Task = await res.json();
            setTasks((prev) => [...prev, newTask]);
            setTitle('');
            setDescription('');
            setSelectedEmployees([]);
        } catch (err) {
            console.error('Create task error:', err);
            setError('Failed to create task');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Head title="Task Dashboard" />
            <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Card sx={{ mb: 4, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Create Task
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            size="small"
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={3}
                            size="small"
                        />
                        <Autocomplete
                            multiple
                            options={employees}
                            value={selectedEmployees}
                            getOptionLabel={(option: User) => option.name}
                            onChange={(_e, newValue) => setSelectedEmployees(newValue as User[])}
                            renderInput={(params) => (
                                <TextField {...params} label="Assign Employees" size="small" />
                            )}
                        />
                        <Button variant="contained" endIcon={<SendIcon />} onClick={handleCreate} sx={{ alignSelf: 'flex-start' }}>
                            Create Task
                        </Button>
                    </Box>
                </Card>

                <Typography variant="h6" gutterBottom>
                    All Tasks ({tasks.length})
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {tasks.map((task) => (
                        <Box key={task.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 11px)' } }}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {task.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                        {task.description}
                                    </Typography>
                                    <Chip
                                        label={(task.status ?? 'pending').replace('_', ' ')}
                                        size="small"
                                        color={statusColor[task.status ?? 'pending']}
                                        sx={{ mb: 1 }}
                                    />
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {task.users?.map((u) => (
                                            <Chip key={u.id} label={u.name} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>

                {tasks.length === 0 && (
                    <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                        No tasks yet.
                    </Typography>
                )}
            </Box>
        </>
    );
}

TaskDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Task Dashboard',
            href: dashboard(),
        },
    ],
};
