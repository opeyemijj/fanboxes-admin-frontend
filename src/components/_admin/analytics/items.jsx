import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    Skeleton,
    TextField
} from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import * as api from 'src/services';

const ItemsAnalytics = ({ filter }) => {
    const searchParams = useSearchParams();
    const searchParam = searchParams.get('search');

    const { timeFilter, dateRange } = filter;

    // Fetch All 3 Item Categories
    const { data, isLoading } = useQuery(
        ['itemsAnalytics', timeFilter, dateRange, searchParam],
        async () => {
            const [claimedRes, wonRes, resoldRes] = await Promise.all([
                api.getTopClaimedItems(timeFilter, dateRange, searchParam),
                api.getTopWonItems(timeFilter, dateRange, searchParam),
                api.getTopResoldItems(timeFilter, dateRange, searchParam)
            ]);

            return {
                claimed: claimedRes.data || [],
                won: wonRes.data || [],
                resold: resoldRes.data || []
            };
        },
        {
            onError: (err) =>
                toast.error(err.response?.data?.message || 'Failed to load item analytics')
        }
    );

    const claimed = data?.claimed || [];
    const won = data?.won || [];
    const resold = data?.resold || [];

    const renderList = (items, valueKey) => {
        if (items.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                        No data available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Try selecting a different date range
                    </Typography>
                </Box>
            );
        }

        return items.map((item, index) => (
            <Box
                key={item._id || index}
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
                    {item?.itemImage ? (
                        <img
                            src={item?.itemImage?.url}
                            alt={item.itemName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <Typography variant="h6" color="text.secondary">
                            {item.itemName?.charAt(0) || 'I'}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {item.itemName || 'Unnamed Item'}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        {item[valueKey]} {valueKey === 'count' ? 'times' : ''}
                    </Typography>
                </Box>
            </Box>
        ));
    };

    const renderSkeleton = () => (
        <Box>
            {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: 'flex', mb: 2 }}>
                    <Skeleton variant="rounded" width={60} height={60} sx={{ mr: 2, borderRadius: 2 }} />
                    <Box sx={{ width: '100%' }}>
                        <Skeleton width="50%" height={24} />
                        <Skeleton width="40%" height={18} />
                    </Box>
                </Box>
            ))}
        </Box>
    );

    return (
        <>
            {/* Claimed Items */}
            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                    <CardHeader title="Most Claimed Items" />
                    <CardContent>
                        {isLoading ? renderSkeleton() : renderList(claimed, 'claims')}
                    </CardContent>
                </Card>
            </Grid>

            {/* Won Items */}
            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                    <CardHeader title="Most Won Items" />
                    <CardContent>
                        {isLoading ? renderSkeleton() : renderList(won, 'count')}
                    </CardContent>
                </Card>
            </Grid>

            {/* Resold Items */}
            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                    <CardHeader title="Top Resold Items" />
                    <CardContent>
                        {isLoading ? renderSkeleton() : renderList(resold, 'resoldCount')}
                    </CardContent>
                </Card>
            </Grid>
        </>
    );
};

export default ItemsAnalytics;
