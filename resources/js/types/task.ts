import type { User } from '@/types/auth';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type TaskAssignee = User & { pivot: { status: TaskStatus } };

export type Task = {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    overall_status?: TaskStatus;
    users: TaskAssignee[];
    created_at: string;
    updated_at: string;
};
