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

const AnalyticsScreen = () => {
  const [filterState, setFilterState] = useState({
    timeFilter: 'TODAY',
    dateRange: {
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day')
    }
  })

  const [selectedCurrency, setSelectedCurrency] = useState('USD') // default currency

  const handleFilterChange = (newFilter) => {
    // newFilter = { timeFilter, dateRange }
    setFilterState(newFilter)
  }

  const handleChangeCurrency = (currency) => {
    setSelectedCurrency(currency) // update state
    console.log('Selected currency inside handler:', currency)
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

        <CurrencyConverter
          onCurrencyChange={(currency) => {
            console.log('Selected currency:', currency);
            handleChangeCurrency(currency);
          }}
        />
      </Box>

      <AnalyticsStats filter={filterState} currency={selectedCurrency} />
      <BoxesAnalytics filter={filterState} currency={selectedCurrency} />
      <InfluencersAnalytics filter={filterState} currency={selectedCurrency} />
      <ItemsAnalytics filter={filterState} />
      <DecisionAnalytics filter={filterState} />
      {/* <LocationAnalytics /> */}
    </Grid>
  )
}

export default AnalyticsScreen
