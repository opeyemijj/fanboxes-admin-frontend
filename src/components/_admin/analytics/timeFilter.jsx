import { useEffect, useRef, useState } from 'react';
import { Box, TextField } from '@mui/material';
import $ from 'jquery';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'bootstrap-daterangepicker';
import moment from 'moment';

const TimeFilter = ({ timeFilter, dateRange, onChange }) => {
    const datePickerRef = useRef(null);
    const [displayValue, setDisplayValue] = useState('');
    const [pickerInitialized, setPickerInitialized] = useState(false);

    // Update display value whenever timeFilter or dateRange changes
    useEffect(() => {
        const formatDate = (date) => moment(date).format('MMM D, YYYY');

        if (timeFilter === 'CUSTOM' && dateRange?.startDate && dateRange?.endDate) {
            setDisplayValue(`${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`);
        } else {
            // Calculate display value based on timeFilter
            let start, end;
            switch (timeFilter) {
                case 'TODAY':
                    start = moment().startOf('day');
                    end = moment().endOf('day');
                    break;
                case 'YESTERDAY':
                    start = moment().subtract(1, 'day').startOf('day');
                    end = moment().subtract(1, 'day').endOf('day');
                    break;
                case 'WEEK':
                    start = moment().subtract(6, 'days').startOf('day');
                    end = moment().endOf('day');
                    break;
                case 'MONTH':
                    start = moment().subtract(29, 'days').startOf('day');
                    end = moment().endOf('day');
                    break;
                case 'ALL':
                    start = moment('2000-01-01').startOf('day');
                    end = moment().endOf('day');
                    break;
                default:
                    start = moment().startOf('day');
                    end = moment().endOf('day');
            }
            setDisplayValue(`${formatDate(start)} - ${formatDate(end)}`);
        }
    }, [timeFilter, dateRange]);

    // Initialize datepicker only once
    useEffect(() => {
        if (!datePickerRef.current || pickerInitialized) return;

        const $el = $(datePickerRef.current);

        // Determine initial values
        let initialStart, initialEnd;

        if (timeFilter === 'CUSTOM' && dateRange?.startDate && dateRange?.endDate) {
            initialStart = moment(dateRange.startDate);
            initialEnd = moment(dateRange.endDate);
        } else {
            // Set defaults based on timeFilter
            switch (timeFilter) {
                case 'TODAY':
                    initialStart = moment().startOf('day');
                    initialEnd = moment().endOf('day');
                    break;
                case 'YESTERDAY':
                    initialStart = moment().subtract(1, 'day').startOf('day');
                    initialEnd = moment().subtract(1, 'day').endOf('day');
                    break;
                case 'WEEK':
                    initialStart = moment().subtract(6, 'days').startOf('day');
                    initialEnd = moment().endOf('day');
                    break;
                case 'MONTH':
                    initialStart = moment().subtract(29, 'days').startOf('day');
                    initialEnd = moment().endOf('day');
                    break;
                case 'ALL':
                    initialStart = moment('2000-01-01').startOf('day');
                    initialEnd = moment().endOf('day');
                    break;
                default:
                    initialStart = moment().startOf('day');
                    initialEnd = moment().endOf('day');
            }
        }

        $el.daterangepicker({
            startDate: initialStart,
            endDate: initialEnd,
            autoUpdateInput: false,
            opens: 'left',
            locale: {
                format: 'MMM D, YYYY',
                cancelLabel: 'Clear',
                applyLabel: 'Apply',
            },
            ranges: {
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [
                    moment().subtract(1, 'month').startOf('month'),
                    moment().subtract(1, 'month').endOf('month'),
                ],
                'All Time': [moment('2000-01-01').startOf('day'), moment().endOf('day')],
            },
            alwaysShowCalendars: true,
        });

        // Handle apply event
        $el.on('apply.daterangepicker', function (ev, picker) {
            const start = picker.startDate;
            const end = picker.endDate;

            // Update display value
            const newDisplayValue = start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY');
            setDisplayValue(newDisplayValue);

            // Check which predefined range was selected
            let newTimeFilter = 'CUSTOM';
            const selectedRange = picker.chosenLabel;

            const rangeMap = {
                'Today': 'TODAY',
                'Yesterday': 'YESTERDAY',
                'Last 7 Days': 'WEEK',
                'Last 30 Days': 'MONTH',
                'This Month': 'MONTH',
                'Last Month': 'MONTH',
                'All Time': 'ALL',
            };

            if (selectedRange && rangeMap[selectedRange]) {
                newTimeFilter = rangeMap[selectedRange];
            }

            // Call onChange with new values
            onChange({
                timeFilter: newTimeFilter,
                dateRange: {
                    startDate: start.toDate(),
                    endDate: end.toDate()
                }
            });
        });

        // Handle cancel event (clear)
        $el.on('cancel.daterangepicker', function (ev, picker) {
            // Set to today
            const start = moment().startOf('day');
            const end = moment().endOf('day');

            picker.setStartDate(start);
            picker.setEndDate(end);

            const newDisplayValue = start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY');
            setDisplayValue(newDisplayValue);

            onChange({
                timeFilter: 'TODAY',
                dateRange: {
                    startDate: start.toDate(),
                    endDate: end.toDate()
                }
            });
        });

        // Set picker as initialized
        setPickerInitialized(true);

        // Cleanup function
        return () => {
            if ($el.data('daterangepicker')) {
                $el.off('apply.daterangepicker');
                $el.off('cancel.daterangepicker');
                $el.data('daterangepicker').remove();
            }
        };
    }, []); // Empty dependency array - initialize only once

    // Update datepicker when props change (without re-initializing)
    useEffect(() => {
        if (!pickerInitialized || !datePickerRef.current) return;

        const $el = $(datePickerRef.current);
        const picker = $el.data('daterangepicker');

        if (!picker) return;

        let newStart, newEnd;

        if (timeFilter === 'CUSTOM' && dateRange?.startDate && dateRange?.endDate) {
            newStart = moment(dateRange.startDate);
            newEnd = moment(dateRange.endDate);
        } else {
            // Set based on timeFilter
            switch (timeFilter) {
                case 'TODAY':
                    newStart = moment().startOf('day');
                    newEnd = moment().endOf('day');
                    break;
                case 'YESTERDAY':
                    newStart = moment().subtract(1, 'day').startOf('day');
                    newEnd = moment().subtract(1, 'day').endOf('day');
                    break;
                case 'WEEK':
                    newStart = moment().subtract(6, 'days').startOf('day');
                    newEnd = moment().endOf('day');
                    break;
                case 'MONTH':
                    newStart = moment().subtract(29, 'days').startOf('day');
                    newEnd = moment().endOf('day');
                    break;
                case 'ALL':
                    newStart = moment('2000-01-01').startOf('day');
                    newEnd = moment().endOf('day');
                    break;
                default:
                    newStart = moment().startOf('day');
                    newEnd = moment().endOf('day');
            }
        }

        // Only update if dates have actually changed
        if (!newStart.isSame(picker.startDate) || !newEnd.isSame(picker.endDate)) {
            picker.setStartDate(newStart);
            picker.setEndDate(newEnd);
        }
    }, [timeFilter, dateRange, pickerInitialized]);

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, p: 3 }}>
            <TextField
                inputRef={datePickerRef}
                label="Date Range"
                value={displayValue}
                size="small"
                sx={{
                    minWidth: 260,
                    '& input': {
                        cursor: 'pointer',
                        backgroundColor: 'white'
                    }
                }}
                InputProps={{
                    readOnly: true,
                    sx: { cursor: 'pointer' }
                }}
            />
        </Box>
    );
};

export default TimeFilter;