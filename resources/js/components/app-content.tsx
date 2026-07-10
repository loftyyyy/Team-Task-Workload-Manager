import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

type Props = {
    children: ReactNode;
};

export function AppContent({ children }: Props) {
    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
            {children}
        </Box>
    );
}
