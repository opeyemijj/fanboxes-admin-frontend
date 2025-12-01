import { Grid } from '@mui/material'
import React, { useState } from 'react'
import AnalyticsStats from './stats'
import ItemsAnalytics from './items'
import InfluencersAnalytics from './influencers'
import BoxesAnalytics from './boxes'
import DecisionAnalytics from './decisions'
import LocationAnalytics from './locations'
import TimeFilter from './timeFilter'

const AnalyticsScreen = () => {
  const [filterState, setFilterState] = useState({
    timeFilter: 'TODAY',
    dateRange: {
      startDate: null,
      endDate: null
    }
  })

  const handleFilterChange = (newFilter) => {
    // newFilter = { timeFilter, dateRange }
    setFilterState(newFilter)
  }

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>

      <TimeFilter
        timeFilter={filterState.timeFilter}
        dateRange={filterState.dateRange}
        onChange={handleFilterChange}
      />

      <AnalyticsStats filter={filterState} />
      <BoxesAnalytics filter={filterState} />
      <InfluencersAnalytics filter={filterState} />
      <ItemsAnalytics filter={filterState} />
      <DecisionAnalytics filter={filterState} />
      <LocationAnalytics />
    </Grid>
  )
}

export default AnalyticsScreen
