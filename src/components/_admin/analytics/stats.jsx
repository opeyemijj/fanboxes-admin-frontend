import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
} from '@mui/material';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';

// Styled components
const MetricCard = ({ children }) => (
    <Card sx={{ height: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
        {children}
    </Card>
);

const StatBox = ({ children }) => (
    <Box sx={{ p: 2, borderRadius: 1, backgroundColor: 'background.default', textAlign: 'center' }}>
        {children}
    </Box>
);

const AnalyticsStats = ({ filter }) => {
    const { timeFilter } = filter;

    const { data } = useQuery(
        ['stats', timeFilter],
        () => api.getStats(timeFilter),
        {
            onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong!')
        }
    );

    const statData = data?.data || {};

    console.log("Stats: ", statData);

    // Default data structure for all fields
    const defaultData = {
        totalRevenue: 0,
        totalProfit: 0,
        totalBoxSpins: 0,
        totalItemsPurchased: 0,
        avgSpend: 0,
        avgProfitPerBox: 0,
        activeUsers: 0,
        retentionRate: 0,
        avgSessionTime: 0,
        avgBoxesPerUser: 0,
        outstandingLiability: 0,
        pendingOrders: 0,
        expectedPayout: 0,
        actualPayout: 0,
        siteCreditIssued: 0,
        siteCreditRedeemed: 0,
        netSpinProfit: 0,
        shippingFee: 0,
        pendingFulfillmentCost: 0,
        influencerRevenue: 0,
        chargebacks: { count: 0, value: 0 },
        boxRTPDeviation: 0,
    };

    // Merge API data with defaults
    const currentData = {
        ...defaultData,
        ...statData,
        chargebacks: { ...defaultData.chargebacks, ...statData.chargebacks },
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);

    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num || 0);

    const formatPercentage = (num) => `${num || 0}%`;

    return (
        <Grid item xs={12}>
            <MetricCard>
                <CardContent>
                    <Grid container spacing={2}>

                        {/* Total Revenue */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Total Revenue</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.totalRevenue)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Total Profit */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Total Profit</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.totalProfit)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Total Box Spins */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Total Boxes Spins</Typography>
                                <Typography variant="h6">
                                    {formatNumber(currentData.totalBoxSpins)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Total Items Purchased */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Total Items Purchased</Typography>
                                <Typography variant="h6">
                                    {formatNumber(currentData.totalItemsPurchased)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Average Spend */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Average Spend (Per user)</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.avgSpend)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Average Profit Per Box */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Average Profit (Per box)</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.avgProfitPerBox)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Active Users */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Active Users</Typography>
                                <Typography variant="h6">
                                    {formatNumber(currentData.activeUsers)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Retention Rate */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Retention Rate</Typography>
                                <Typography variant="h6">
                                    {formatPercentage(currentData.retentionRate)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Avg Session Time */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Avg. Session Time</Typography>
                                <Typography variant="h6">
                                    {currentData.avgSessionTime}m
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Avg Boxes Per User */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Avg. Boxes Opened (Per user)</Typography>
                                <Typography variant="h6">{currentData.avgBoxesPerUser}</Typography>
                            </StatBox>
                        </Grid>

                        {/* Outstanding Liability */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Outstanding Liability</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.outstandingLiability)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Pending Orders */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Pending Orders</Typography>
                                <Typography variant="h6">
                                    {formatNumber(currentData.pendingOrders)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Expected Payout */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Expected Payout</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.expectedPayout)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Actual Payout */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Actual Payout</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.actualPayout)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Site Credit Issued */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Site Credit Issued</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.siteCreditIssued)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Site Credit Redeemed */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Site Credit Redeemed</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.siteCreditRedeemed)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Net Spin Profit */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Net Spin Profit</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.netSpinProfit)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Shipping Fee */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Shipping Fee Collected</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.shippingFee)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Pending Fulfillment Cost */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Items Pending Fulfillment Cost</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.pendingFulfillmentCost)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Influencer Revenue */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Influencer Revenue Share</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.influencerRevenue)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Chargebacks */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Chargebacks (Count + Value)</Typography>
                                <Typography variant="h6">
                                    {currentData.chargebacks.count} {formatCurrency(currentData.chargebacks.value)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        {/* Box RTP Deviation */}
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Box RTP Deviation</Typography>
                                <Typography variant="h6">
                                    {currentData.boxRTPDeviation}%
                                </Typography>
                            </StatBox>
                        </Grid>

                    </Grid>
                </CardContent>
            </MetricCard>
        </Grid>
    );
};

export default AnalyticsStats;
