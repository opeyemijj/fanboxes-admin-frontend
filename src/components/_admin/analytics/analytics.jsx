"use client"
import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import AnalyticsStats from './stats'
import ItemsAnalytics from './items'
import InfluencersAnalytics from './influencers'
import BoxesAnalytics from './boxes'
import DecisionAnalytics from './decisions'
import LocationAnalytics from './locations'
import TimeFilter from './timeFilter'
import CurrencyConverter from './Currency'
import moment from 'moment';
import { useSelector } from 'react-redux'

const AnalyticsScreen = () => {
  const [filterState, setFilterState] = useState({
    timeFilter: 'TODAY',
    dateRange: {
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day')
    }
  })

  // const [selectedCurrency, setSelectedCurrency] = useState('USD') // default currency
  const { currency } = useSelector((state) => state.settings);

  const handleFilterChange = (newFilter) => {
    // newFilter = { timeFilter, dateRange }
    setFilterState(newFilter)
  }


  return (
    <Grid container spacing={2} sx={{ p: 3 }} alignItems="stretch">

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        p: 3,
        bgColor: "blue"
      }}
      >
        <TimeFilter
          timeFilter={filterState.timeFilter}
          dateRange={filterState.dateRange}
          onChange={handleFilterChange}
        />

        <CurrencyConverter/>
      </Box>

      <AnalyticsStats filter={filterState} currency={currency} />
      <BoxesAnalytics filter={filterState} currency={currency} />
      <InfluencersAnalytics filter={filterState} currency={currency} />
      <ItemsAnalytics filter={filterState} />
      <DecisionAnalytics filter={filterState} />
      {/* <LocationAnalytics /> */}
    </Grid>
  )
}

export default AnalyticsScreen
