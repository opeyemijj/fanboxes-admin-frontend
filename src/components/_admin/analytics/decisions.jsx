import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import React from 'react';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';

const DecisionAnalytics = ({ filter }) => {
    const { timeFilter, dateRange } = filter;

    const { data, isLoading } = useQuery(
        ['decisionFunnel', timeFilter, dateRange],
        () => api.getDecisionFunnel(timeFilter, dateRange),
        {
            onError: (err) =>
                toast.error(err.response?.data?.message || 'Something went wrong!')
        }
    );

    const decisionData = data?.data || {};
    console.log(decisionData);

    const items = [
        {
            title: "Items Revealed",
            value: decisionData.ItemsRevealed?.length || 0
        },
        {
            title: "Shipping Selection",
            value: decisionData.ShippingSelected?.[0]?.total || 0
        },
        {
            title: "Resell Selection",
            value: decisionData.ResellSelected?.[0]?.total || 0
        },
        {
            title: "Pending Decision",
            value: decisionData.PendingDecision?.[0]?.totalPending || 0
        },
        {
            title: "Shipping In Progress",
            value: decisionData.ShippingInProgress?.[0]?.total || 0
        },
        {
            title: "Completed Deliveries",
            value: decisionData.CompletedDeliveries?.[0]?.total || 0
        }
    ];

    return (
        <Grid item xs={12} sm={6}>
            <Card sx={{
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <CardHeader title="Decision Funnel" />
                <CardContent>
                    {items.map((item, index) => (
                        <Box key={index} display="flex" alignItems="center" mb={2} borderBottom="1px solid #eee" pb={1}>
                            <Box
                                width={30}
                                height={30}
                                borderRadius={2}
                                bgcolor="#f5f5f5"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                mr={2}
                            >

                            </Box>
                            <Box flexGrow={1} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">{item.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{isLoading ? '...' : item.value}</Typography>
                            </Box>
                        </Box>
                    ))}
                </CardContent>
            </Card>
        </Grid>
    );
};

export default DecisionAnalytics