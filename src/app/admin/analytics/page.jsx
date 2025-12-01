"use client"
import {
    Card,
    Grid,
    CardHeader,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

import AnalyticsScreen from 'src/components/_admin/analytics/analytics';

const Page = () => {
    

    return (
        <Grid container spacing={2}>
            {/* Main content area */}
            <AnalyticsScreen />
            
        </Grid>
    )
}

export default Page