"use client"
import {
    Card,
    Grid,
    CardHeader,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

import AnalyticsScreen from 'src/components/_admin/analytics/analytics';

const Page = () => {
    

    return (
        <Grid container spacing={2}>
            {/* Main content area */}
            <AnalyticsScreen />
            

            {/* Third row - mixed layout */}
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardHeader title="Decision Funnel" />
                    <CardContent>
                        {[
                            {
                                image: "/images/item1.jpg", // or require('./path/to/image1.jpg')
                                title: "First Item",
                                subtitle: "XXXXX"
                            },
                            {
                                image: "/images/item2.jpg",
                                title: "Second Item",
                                subtitle: "XXXXX"
                            },
                            {
                                image: "/images/item3.jpg",
                                title: "Third Item",
                                subtitle: "XXXXX"
                            }
                        ].map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', borderBottom: '1px' }}>
                                <Box
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        backgroundColor: '#f5f5f5',
                                        marginRight: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* If you have actual images, use this: */}
                                    {/* <img 
          src={item.image} 
          alt={item.title}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
        /> */}

                                    {/* Fallback if no image - display first letter */}
                                    <Typography variant="h6" color="textSecondary">
                                        {item.title.charAt(0)}
                                    </Typography>
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <Typography variant="h6" component="div">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {item.subtitle}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={8}>
                <Card>
                    <CardHeader title="Detailed View" subheader="Comprehensive information" />
                    <CardContent>
                        <Typography variant="body2">
                            This wider card spans 8 columns and provides more detailed information
                            alongside the settings panel.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Page