import { Box, Grid } from '@mui/material'
import React from 'react'
import AnalyticsStats from './stats'
import ItemsAnalytics from './items'
import InfluencersAnalytics from './influencers'
import BoxesAnalytics from './boxes'

const AnalyticsScreen = () => {
  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      <AnalyticsStats />
      <BoxesAnalytics />
      <InfluencersAnalytics />
      <ItemsAnalytics />
    </Grid>
  )
}

export default AnalyticsScreen