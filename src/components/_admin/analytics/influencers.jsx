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

import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import * as api from 'src/services';

import 'bootstrap-daterangepicker/daterangepicker.css';
import $ from 'jquery';
import moment from 'moment';
import 'bootstrap-daterangepicker';

const InfluencersAnalytics = () => {
    const searchParams = useSearchParams();
    const searchParam = searchParams.get('search');

    const datePickerRef = useRef(null);

    // Default date range = Today
    const [selectedRange, setSelectedRange] = useState({
        startDate: moment().startOf('day'),
        endDate: moment().endOf('day')
    });

    const [displayDateRange, setDisplayDateRange] = useState(
        `${moment().format('MMM D, YYYY')} - ${moment().format('MMM D, YYYY')}`
    );

    // Initialize DateRangePicker
    useEffect(() => {
        if (!datePickerRef.current) return;

        $(datePickerRef.current).daterangepicker(
            {
                startDate: selectedRange.startDate,
                endDate: selectedRange.endDate,
                autoUpdateInput: true,
                opens: 'left',
                locale: { format: 'MMM D, YYYY' },
                ranges: {
                    Today: [moment(), moment()],
                    Yesterday: [
                        moment().subtract(1, 'day'),
                        moment().subtract(1, 'day')
                    ],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [
                        moment().startOf('month'),
                        moment().endOf('month')
                    ],
                    'Last Month': [
                        moment().subtract(1, 'month').startOf('month'),
                        moment().subtract(1, 'month').endOf('month')
                    ],
                    'All Time': [moment('2000-01-01'), moment()]
                }
            },
            (start, end) => {
                setSelectedRange({ startDate: start, endDate: end });

                setDisplayDateRange(
                    `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`
                );
            }
        );
    }, []);

    // Fetch data
    const { data, isLoading } = useQuery(
        [
            'topInfluencers',
            selectedRange.startDate.format('YYYY-MM-DD'),
            selectedRange.endDate.format('YYYY-MM-DD')
        ],
        () =>
            api.getTopInfluencers({
                startDate: selectedRange.startDate.format('YYYY-MM-DD'),
                endDate: selectedRange.endDate.format('YYYY-MM-DD')
            }),
        {
            onError: (err) =>
                toast.error(err.response?.data?.message || 'Failed to load influencer analytics')
        }
    );

    const influencersData = data?.data || [];

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);

    return (
        <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <CardHeader
                    title="Top-Performing Influencers"
                    subheader={
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                inputRef={datePickerRef}
                                label="Date Range"
                                value={displayDateRange}
                                InputProps={{ readOnly: true }}
                                size="small"
                                sx={{
                                    minWidth: 240,
                                    '& input': { cursor: 'pointer' }
                                }}
                            />
                        </Box>
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
                                        <Skeleton width="50%" height={24} />
                                        <Skeleton width="40%" height={18} />
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
                                    mb: 1.5,
                                    pb: 1.5,
                                    borderBottom: index < influencersData.length - 1 ? 1 : 0,
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
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Typography variant="h6" color="text.secondary">
                                            {influencer.influencerName?.charAt(0) || 'I'}
                                        </Typography>
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {influencer.influencerName || 'Unnamed Influencer'}
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            {formatCurrency(influencer.totalRevenue)} revenue
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
                                        <Typography variant="caption" color="text.secondary">
                                            Commission
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                No influencer data available
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Try selecting a different date range
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
};

export default InfluencersAnalytics;
