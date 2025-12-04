import {
    Grid,
} from '@mui/material';
import React from 'react';

import AnalyticsScreen from 'src/components/_admin/analytics/analytics';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

const Page = () => {

    const canView = UsePermissionServer('view_analytic_details'); // check required permission

    if (!canView) {
        return <AccessDenied message="You are not allowed to manage Category." redirect="/admin/dashboard" />;
    }

    return (
        <Grid container spacing={2}>
            {/* Main content area */}
            <AnalyticsScreen />
        </Grid>
    )
}

export default Page