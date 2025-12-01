import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
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

const AnalyticsStats = () => {
    const searchParams = useSearchParams();
    const [timeFilter, setTimeFilter] = useState('TODAY');
    const searchParam = searchParams.get('search');

    const { data } = useQuery(
        ['stats', timeFilter],
        () => api.getStats(timeFilter),
        {
            onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong!')
        }
    );

    console.log("Stats:", data?.data);
    const statData = data?.data || {};

    // Default data structure with all fields set to 0
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
        boxRTPDeviation: 0
    };

    // Merge API data with defaults
    const currentData = {
        ...defaultData,
        ...statData,
        chargebacks: { ...defaultData.chargebacks, ...statData.chargebacks }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num || 0);
    };

    const formatPercentage = (num) => {
        return `${num || 0}%`;
    };

    const handleTimeFilterChange = (newFilter) => {
        setTimeFilter(newFilter);
    };

    return (
        <Grid item xs={12}>
            <MetricCard>
                <CardContent>
                    {/* Filters */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
                        {['TODAY', 'ALL'].map((period) => (
                            <Chip
                                key={period}
                                label={period}
                                onClick={() => handleTimeFilterChange(period)}
                                color={timeFilter === period ? 'primary' : 'default'}
                                variant={timeFilter === period ? 'filled' : 'outlined'}
                            />
                        ))}

                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <Select
                                value={timeFilter.startsWith('WEEK_') ? timeFilter : ''}
                                displayEmpty
                                onChange={(e) => handleTimeFilterChange(e.target.value)}
                                renderValue={(selected) => {
                                    if (!selected) return 'Select Week';
                                    const weekRange = selected.replace('WEEK_', '');
                                    return `Week: ${weekRange}`;
                                }}
                            >
                                {[
                                    "WEEK_Dec 18 - Dec 24",
                                    "WEEK_Dec 11 - Dec 17",
                                    "WEEK_Dec 4 - Dec 10",
                                    "WEEK_Nov 27 - Dec 3"
                                ].map((week) => (
                                    <MenuItem key={week} value={week}>
                                        {week.replace('WEEK_', '')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                                value={timeFilter.startsWith('MONTH_') ? timeFilter : ''}
                                displayEmpty
                                onChange={(e) => handleTimeFilterChange(e.target.value)}
                                renderValue={(selected) => {
                                    if (!selected) return 'Select Month';
                                    const monthName = selected.replace('MONTH_', '');
                                    return monthName;
                                }}
                            >
                                {[
                                    "MONTH_December 2024",
                                    "MONTH_November 2024",
                                    "MONTH_October 2024",
                                    "MONTH_September 2024",
                                    "MONTH_August 2024",
                                    "MONTH_July 2024"
                                ].map((month) => (
                                    <MenuItem key={month} value={month}>
                                        {month.replace('MONTH_', '')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Stats Grid - All fields maintained */}
                    <Grid container spacing={2}>
                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Total Revenue</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.totalRevenue)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Total Profit</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.totalProfit)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Total Boxes Spins</Typography>
                                <Typography variant="h6">
                                    {formatNumber(currentData.totalBoxSpins)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Total Items Purchased</Typography>
                                <Typography variant="h6">
                                    {formatNumber(currentData.totalItemsPurchased)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Average Spend (Per user)</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.avgSpend)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Average Profit (Per box)</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.avgProfitPerBox)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Active Users</Typography>
                                <Typography variant="h6">
                                    {formatNumber(currentData.activeUsers)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Retention Rate</Typography>
                                <Typography variant="h6">
                                    {formatPercentage(currentData.retentionRate)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Avg. Session Time</Typography>
                                <Typography variant="h6">
                                    {currentData.avgSessionTime}m
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Avg. Boxes Opened (Per user)</Typography>
                                <Typography variant="h6">
                                    {currentData.avgBoxesPerUser}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Outstanding Liability</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.outstandingLiability)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Pending Orders</Typography>
                                <Typography variant="h6">
                                    {formatNumber(currentData.pendingOrders)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Expected Payout</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.expectedPayout)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Actual Payout</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.actualPayout)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Site Credit Issued</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.siteCreditIssued)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Site Credit Redeemed</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.siteCreditRedeemed)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Net Spin Profit</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.netSpinProfit)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Shipping Fee Collected</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.shippingFee)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Items Pending Fulfillment Cost</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.pendingFulfillmentCost)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Influencer Revenue Share</Typography>
                                <Typography variant="h6">
                                    {formatCurrency(currentData.influencerRevenue)}
                                </Typography>
                            </StatBox>
                        </Grid>

                        <Grid item xs={6} lg={3}>
                            <StatBox>
                                <Typography variant="body2">Chargebacks (Count + Value)</Typography>
                                <Typography variant="h6">
                                    {currentData.chargebacks.count} {formatCurrency(currentData.chargebacks.value)}
                                </Typography>
                            </StatBox>
                        </Grid>

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