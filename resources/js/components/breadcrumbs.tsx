import { Link } from '@inertiajs/react';
import MUIBreadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { useViewAs } from '@/hooks/use-view-as';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    const { selectedEmployeeName } = useViewAs();

    if (breadcrumbs.length === 0) return null;

    return (
        <MUIBreadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const title = isLast && selectedEmployeeName && item.title === 'My Work'
                    ? `${item.title} — ${selectedEmployeeName}`
                    : item.title;
                return isLast ? (
                    <Typography key={index} sx={{ color: '#f8f8f2', fontSize: 22, fontWeight: 700 }}>
                        {title}
                    </Typography>
                ) : (
                    <Link
                        key={index}
                        href={item.href}
                        style={{ color: '#6272a4', fontSize: 14, textDecoration: 'underline' }}
                    >
                        {item.title}
                    </Link>
                );
            })}
        </MUIBreadcrumbs>
    );
}
