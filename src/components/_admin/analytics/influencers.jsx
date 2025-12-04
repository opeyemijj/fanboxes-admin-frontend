import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    Skeleton
} from '@mui/material';

import React from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import * as api from 'src/services';

const InfluencersAnalytics = ({ filter }) => {
    const searchParams = useSearchParams();
    const searchParam = searchParams.get('search');

    const { timeFilter, dateRange } = filter;

    // Fetch Top Influencers
    const { data, isLoading } = useQuery(
        ['topInfluencers', timeFilter, dateRange, searchParam],
        async () => {
            // Add artificial delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));
            const res = await api.getTopInfluencers({
                timeFilter,
                dateRange,
                search: searchParam
            });

            return res.data || [];
        },
        {
            onError: (err) =>
                toast.error(
                    err.response?.data?.message ||
                    'Failed to load influencer analytics'
                )
        }
    );

    const influencers = data || [];

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);

    const renderSkeleton = () => (
        <Box>
            {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <Skeleton
                        variant="circular"
                        width={60}
                        height={60}
                        sx={{ mr: 2, flexShrink: 0 }}
                    />
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1 }}>
                            <Skeleton
                                variant="text"
                                width="60%"
                                height={24}
                                sx={{ mb: 0.5 }}
                            />
                            <Skeleton
                                variant="text"
                                width="40%"
                                height={18}
                            />
                        </Box>
                        <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                            <Skeleton
                                variant="text"
                                width="70%"
                                height={24}
                                sx={{ mb: 0.5, ml: 'auto' }}
                            />
                            <Skeleton
                                variant="text"
                                width="50%"
                                height={18}
                                sx={{ ml: 'auto' }}
                            />
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );

    const renderList = () => {
        if (influencers.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                        No influencer data available
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Try selecting a different date range
                    </Typography>
                </Box>
            );
        }

        return influencers.map((influencer, index) => (
            <Box
                key={influencer._id || index}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom:
                        index < influencers.length - 1 ? 1 : 0,
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
                            {influencer.influencerName?.charAt(0) || 'I'}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
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
                            {formatCurrency(influencer.totalRevenue)}{' '}
                            revenue
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 600,
                                color:
                                    influencer.totalCommission >= 0
                                        ? 'success.main'
                                        : 'error.main'
                            }}
                        >
                            {formatCurrency(influencer.totalCommission)}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Commission
                        </Typography>
                    </Box>
                </Box>
            </Box>
        ));
    };

    return (
        <Grid item xs={12} sm={6} md={6}>
            <Card
                sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
                }}
            >
                <CardHeader
                    title={
                        isLoading ? (
                            <Skeleton variant="text" width="65%" height={32} />
                        ) : (
                            "Top-Performing Influencers"
                        )
                    }
                />
                <CardContent>
                    {isLoading ? renderSkeleton() : renderList()}
                </CardContent>
            </Card>
        </Grid>
    );
};

export default InfluencersAnalytics;