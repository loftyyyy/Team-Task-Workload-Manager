import { Component, type ErrorInfo, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

interface Props {
    children: ReactNode;
}

interface State {
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <Box sx={{ p: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Render error: {this.state.error.message}
                    </Alert>
                </Box>
            );
        }
        return this.props.children;
    }
}
