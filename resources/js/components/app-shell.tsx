import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

type Props = {
    children: ReactNode;
};

export function AppShell({ children }: Props) {
    return <Box sx={{ display: 'flex', minHeight: '100vh' }}>{children}</Box>;
}
