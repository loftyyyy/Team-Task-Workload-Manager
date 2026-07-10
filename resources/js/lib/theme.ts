'use client';

import { createTheme } from '@mui/material/styles';

const draculaTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#bd93f9',
        },
        secondary: {
            main: '#ff79c6',
        },
        background: {
            default: '#282a36',
            paper: '#282a36',
        },
        text: {
            primary: '#f8f8f2',
            secondary: '#6272a4',
        },
        divider: '#44475a',
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#282a36',
                    border: '1px solid #44475a',
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    '&:last-child': { paddingBottom: 16 },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    '&.MuiChip-outlined': {
                        borderColor: '#44475a',
                        color: '#f8f8f2',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#44475a' },
                        '&:hover fieldset': { borderColor: '#6272a4' },
                        '&.Mui-focused fieldset': { borderColor: '#bd93f9' },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#6272a4',
                        '&.Mui-focused': { color: '#bd93f9' },
                    },
                    '& .MuiInputBase-input': {
                        color: '#f8f8f2',
                    },
                },
            },
        },
    },
});

export default draculaTheme;
