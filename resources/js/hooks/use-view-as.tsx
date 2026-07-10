import { createContext, useContext, useState, type ReactNode } from 'react';
import { usePage } from '@inertiajs/react';

export type DisplayRole = 'admin' | 'employee';

type ViewAsContextType = {
    role: DisplayRole;
    setRole: (role: DisplayRole) => void;
    effectiveUserId: number;
    selectedEmployeeId: number | null;
    setSelectedEmployeeId: (id: number | null) => void;
    selectedEmployeeName: string | null;
    setSelectedEmployeeName: (name: string | null) => void;
};

const ViewAsContext = createContext<ViewAsContextType | null>(null);

export function ViewAsProvider({ children }: { children: ReactNode }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auth: any = usePage().props.auth;
    const authUserId = auth?.user?.id ?? null;
    const authUserName = auth?.user?.name ?? null;
    const [role, setRole] = useState<DisplayRole>('admin');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState<string | null>(null);

    // admin = Admin User (id: 1 from seeder), employee = selected employee or fallback to auth user or Employee 1 (id: 2)
    const effectiveUserId = role === 'admin' ? 1 : (selectedEmployeeId ?? authUserId ?? 2);
    const displayName = role === 'admin' ? null : (selectedEmployeeName ?? authUserName);

    return (
        <ViewAsContext.Provider
            value={{
                role,
                setRole,
                effectiveUserId,
                selectedEmployeeId,
                setSelectedEmployeeId,
                selectedEmployeeName: displayName,
                setSelectedEmployeeName,
            }}
        >
            {children}
        </ViewAsContext.Provider>
    );
}

export function useViewAs() {
    const ctx = useContext(ViewAsContext);
    if (!ctx) throw new Error('useViewAs must be used within ViewAsProvider');
    return ctx;
}
