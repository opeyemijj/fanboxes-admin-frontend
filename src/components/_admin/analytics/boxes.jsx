import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    TextField,
    Skeleton
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';

import 'bootstrap-daterangepicker/daterangepicker.css';

const BoxesAnalytics = () => {
    const searchParams = useSearchParams();
    const [timeFilter, setTimeFilter] = useState('CUSTOM');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });
    const [displayDateRange, setDisplayDateRange] = useState('Today');
    const datePickerRef = useRef(null);

    const { data, isLoading, refetch } = useQuery(
        ['topBoxes', timeFilter, dateRange],
        () => api.getTopBoxes(timeFilter, dateRange),
        {
            onError: (err) =>
                toast.error(err.response?.data?.message || 'Something went wrong!')
        }
    );

    const boxesData = data?.data || [];
    console.log("Boxes: ", data);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);

    const formatNumber = (num) =>
        new Intl.NumberFormat('en-US').format(num || 0);

    // Initialize DateRangePicker
    useEffect(() => {
        const loadDateRangePicker = async () => {
            const { default: $ } = await import('jquery');
            const { default: moment } = await import('moment');
            await import('bootstrap-daterangepicker');

            if (datePickerRef.current) {
                $(datePickerRef.current).daterangepicker(
                    {
                        startDate: moment(),
                        endDate: moment(),
                        ranges: {
                            Today: [moment(), moment()],
                            Yesterday: [
                                moment().subtract(1, 'days'),
                                moment().subtract(1, 'days')
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
                        },
                        opens: 'left',
                        locale: { format: 'MMM D, YYYY' },
                        autoUpdateInput: true
                    },
                    (start, end, label) => {
                        const startDate = start.startOf('day').toDate();
                        const endDate = end.endOf('day').toDate();

                        setDateRange({ startDate, endDate });
                        setDisplayDateRange(
                            `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`
                        );

                        setTimeFilter(label === 'Today' ? 'TODAY' :
                            label === 'Last 7 Days' ? 'WEEK' :
                                label === 'Last 30 Days' ? 'MONTH' :
                                    label === 'All Time' ? 'ALL' :
                                        'CUSTOM');

                        setTimeout(() => refetch(), 50);
                    }
                );
            }
        };

        loadDateRangePicker();
    }, [refetch]);

    return (
        <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <CardHeader
                    title="Top-Performing Boxes"
                    subheader={
                        <Box sx={{ mt: 1 }}>
                            {/* DATE RANGE FILTER ONLY */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
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
                        </Box>
                    }
                />

                <CardContent>
                    {isLoading ? (
                        <Box>
                            {[1, 2, 3].map((i) => (
                                <Box key={i} sx={{ display: 'flex', mb: 2 }}>
                                    <Skeleton
                                        variant="rectangular"
                                        width={60}
                                        height={60}
                                        sx={{ borderRadius: 1, mr: 2 }}
                                    />
                                    <Box sx={{ width: '100%' }}>
                                        <Skeleton width="40%" height={24} />
                                        <Skeleton width="30%" height={18} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : boxesData.length > 0 ? (
                        boxesData.map((box, index) => (
                            <Box
                                key={box._id || index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                    pb: 1,
                                    borderBottom: index < boxesData.length - 1 ? 1 : 0,
                                    borderColor: 'divider',
                                    transition: '0.2s ease',
                                    '&:hover': { backgroundColor: 'grey.50' }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 1,
                                        backgroundColor: 'grey.100',
                                        mr: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {box.boxImage ? (
                                        <img
                                            src={box.boxImage}
                                            alt={box.boxName}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <Typography variant="h6" color="text.secondary">
                                            {box.boxName?.charAt(0) || 'B'}
                                        </Typography>
                                    )}
                                </Box>

                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {box.boxName || 'Unnamed Box'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatCurrency(box.totalRevenue)} revenue
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                        {formatNumber(box.totalSpins)} spins
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography>No box data available</Typography>
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

export default BoxesAnalytics;
