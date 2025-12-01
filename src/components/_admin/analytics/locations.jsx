import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import React from 'react'

const LocationAnalytics = () => {
    return (
        <Grid item xs={12} sm={6} md={8}>
            <Card>
                <CardHeader title="Detailed View" subheader="Comprehensive information" />
                <CardContent>
                    <Typography variant="body2">
                        This wider card spans 8 columns and provides more detailed information
                        alongside the settings panel.
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default LocationAnalytics