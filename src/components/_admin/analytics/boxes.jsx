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
import toast from 'react-hot-toast';
import * as api from 'src/services';

const BoxesAnalytics = ({ filter }) => {
    const { timeFilter, dateRange } = filter;

    const { data, isLoading } = useQuery(
        ['topBoxes', timeFilter, dateRange],
        async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const res = await api.getTopBoxes(timeFilter, dateRange);
            return res.data || [];
        },
        {
            onError: (err) =>
                toast.error(err.response?.data?.message || 'Failed to load box analytics')
        }
    );

    const boxes = data || [];

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);

    const formatNumber = (num) =>
        new Intl.NumberFormat('en-US').format(num || 0);

    const renderList = (items) => {
        if (items.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                        No box data available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Try selecting a different date range
                    </Typography>
                </Box>
            );
        }

        return items.map((box, index) => (
            <Box
                key={box._id || index}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom: index < items.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    transition: '0.2s ease',
                    '&:hover': { backgroundColor: 'grey.50' }
                }}
            >
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        backgroundColor: 'grey.100',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}
                >
                    {box.boxImage ? (
                        <img
                            src={box.boxImage}
                            alt={box.boxName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <Typography variant="h6" color="text.secondary">
                            {box.boxName?.charAt(0) || 'B'}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {box.boxName || 'Unnamed Box'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {formatCurrency(box.totalRevenue)} revenue • {formatNumber(box.totalSpins)} spins
                    </Typography>
                </Box>
            </Box>
        ));
    };

    const renderSkeleton = () => (
        <Box>
            {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <Skeleton
                        variant="rounded"
                        width={60}
                        height={60}
                        sx={{ mr: 2, borderRadius: 2, flexShrink: 0 }}
                    />
                    <Box sx={{ width: '100%' }}>
                        <Skeleton variant="text" width="70%" height={24} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width="50%" height={18} />
                    </Box>
                </Box>
            ))}
        </Box>
    );

    return (
        <Grid item xs={12} sm={6} md={6}>
            <Card
                sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                <CardHeader
                    title={
                        isLoading ? (
                            <Skeleton variant="text" width="60%" height={32} />
                        ) : (
                            "Top-Performing Boxes"
                        )
                    }
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    {isLoading ? renderSkeleton() : renderList(boxes)}
                </CardContent>
            </Card>
        </Grid>
    );
};

export default BoxesAnalytics;
