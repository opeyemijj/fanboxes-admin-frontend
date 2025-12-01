import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    Skeleton,
} from '@mui/material';

import React from 'react';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';

const InfluencersAnalytics = ({ filter }) => {
    const { timeFilter, dateRange } = filter;

    const { data, isLoading } = useQuery(
        ['topInfluencers', timeFilter, dateRange],
        () =>
            api.getTopInfluencers({
                timeFilter,
                startDate: dateRange?.startDate,
                endDate: dateRange?.endDate
            }),
        {
            onError: (err) =>
                toast.error(
                    err.response?.data?.message ||
                        'Failed to load influencer analytics'
                )
        }
    );

    const influencersData = data?.data || [];

    console.log("Influencer: ", data);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);

    const formatNumber = (num) =>
        new Intl.NumberFormat('en-US').format(num || 0);

    return (
        <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <CardHeader
                    title="Top-Performing Influencers"
                    subheader={
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {timeFilter === 'CUSTOM'
                                ? `${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`
                                : timeFilter}
                        </Typography>
                    }
                />

                <CardContent>
                    {isLoading ? (
                        <Box>
                            {[1, 2, 3].map((i) => (
                                <Box key={i} sx={{ display: 'flex', mb: 2 }}>
                                    <Skeleton
                                        variant="circular"
                                        width={60}
                                        height={60}
                                        sx={{ mr: 2 }}
                                    />
                                    <Box sx={{ width: '100%' }}>
                                        <Skeleton width="40%" height={24} />
                                        <Skeleton width="30%" height={18} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : influencersData.length > 0 ? (
                        influencersData.map((influencer, index) => (
                            <Box
                                key={influencer._id || index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                    pb: 1,
                                    borderBottom:
                                        index < influencersData.length - 1 ? 1 : 0,
                                    borderColor: 'divider',
                                    transition: '0.2s ease',
                                    '&:hover': { backgroundColor: 'grey.50' }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: 'grey.100',
                                        mr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}
                                >
                                    {influencer.influencerImage ? (
                                        <img
                                            src={influencer.influencerImage}
                                            alt={influencer.influencerName}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <Typography variant="h6" color="text.secondary">
                                            {influencer.influencerName?.charAt(0) ||
                                                'I'}
                                        </Typography>
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            {influencer.influencerName ||
                                                'Unnamed Influencer'}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {formatCurrency(
                                                influencer.totalRevenue
                                            )}{' '}
                                            revenue
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                        {formatCurrency(
                                            influencer.totalCommission
                                        )}{' '}
                                        commission
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography>No influencer data available</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Try a different date range
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
};

export default InfluencersAnalytics;
