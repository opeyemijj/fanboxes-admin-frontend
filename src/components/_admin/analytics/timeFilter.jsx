import React, { useEffect, useRef } from 'react';
import { Box, Chip, TextField } from '@mui/material';
import $ from 'jquery';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'bootstrap-daterangepicker';

const TimeFilter = ({ timeFilter, dateRange, onChange }) => {
    const datePickerRef = useRef(null);

    useEffect(() => {
        if (!datePickerRef.current) return;

        // Determine initial values for the picker
        const initialStart =
            timeFilter === 'CUSTOM' && dateRange?.startDate
                ? moment(dateRange.startDate)
                : moment().startOf('day');

        const initialEnd =
            timeFilter === 'CUSTOM' && dateRange?.endDate
                ? moment(dateRange.endDate)
                : moment().endOf('day');

        // Initialize daterangepicker
        $(datePickerRef.current).daterangepicker(
            {
                startDate: initialStart,
                endDate: initialEnd,
                autoUpdateInput: true,
                opens: 'left',
                locale: { format: 'MMM D, YYYY' },
                ranges: {
                    Today: [moment(), moment()],
                    Yesterday: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [
                        moment().subtract(1, 'month').startOf('month'),
                        moment().subtract(1, 'month').endOf('month')
                    ],
                    'All Time': [moment('2000-01-01'), moment()]
                }
            },
            (start, end, label) => {
                // Map range label → timeFilter value
                const rangeMap = {
                    Today: 'TODAY',
                    Yesterday: 'YESTERDAY',
                    'Last 7 Days': 'WEEK',
                    'Last 30 Days': 'MONTH',
                    'This Month': 'MONTH',
                    'Last Month': 'MONTH',
                    'All Time': 'ALL'
                };

                onChange({
                    timeFilter: rangeMap[label] || 'CUSTOM',
                    dateRange: {
                        startDate: start.toDate(),
                        endDate: end.toDate()
                    }
                });
            }
        );
    }, [timeFilter, dateRange, onChange]);

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 3 }}>

            {/* Predefined chips */}
            {['TODAY', 'WEEK', 'MONTH', 'ALL'].map((period) => (
                <Chip
                    key={period}
                    label={period}
                    onClick={() =>
                        onChange({
                            timeFilter: period,
                            dateRange: { startDate: null, endDate: null }
                        })
                    }
                    color={timeFilter === period ? 'primary' : 'default'}
                    variant={timeFilter === period ? 'filled' : 'outlined'}
                />
            ))}

            {/* jQuery DateRangePicker input */}
            <TextField
                inputRef={datePickerRef}
                label="Custom Date Range"
                size="small"
                sx={{ minWidth: 260, '& input': { cursor: 'pointer' } }}
                InputProps={{ readOnly: true }}
            />
        </Box>
    );
};

export default TimeFilter;
