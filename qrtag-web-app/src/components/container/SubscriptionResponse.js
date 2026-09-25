import Navbar from '../common/Navbar'
import { useState } from 'react';
import { Button, Card, CardContent, Grid, Typography, Box } from '@mui/material';

import '../css/App.css'
import Footer from '../common/Footer'
import Breadcrumbs from '../common/Breadcrumbs'
import { Store } from '../../StoreContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReactReadMoreReadLess from "react-read-more-read-less";
import moment from 'moment-timezone'
import { useParams } from 'react-router-dom';
import { CheckCircleOutline, CloseOutlined, CloseRounded, HighlightOff, InfoOutlined, RemoveCircle } from '@mui/icons-material';

const SubscriptionResponse = () => {

    const { user, loggedIn, messages } = Store();
    const { response } = useParams()
    return (
        <>
            <Navbar />
            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbActive='Manage Subscriptions' />

            <div className='pt-2' style={{ background: '#e1e8fc', paddingBottom: '20%' }}>
                <div className='container my-5 pb-5'>

                    <Grid container display="flex" alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={12} sx={{ mx: { xs: '5%', sm: 0 } }}>
                            <Grid sx={{
                                display: 'flex',
                                flexDirection: { xs: "column", sm: "column" },
                                alignItems: 'center',
                                background: '#EFF4FB',
                                padding: '1.5rem 1.5rem',
                                borderRadius: '5px',
                                boxShadow: 1,
                            }} className='mt-4 mb-4'>

                                {(response && response === 'success') ? <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            alignItems: "center",
                                            justifyContent: { xs: "center", sm: "flex-start" },
                                            marginRight: '10px',
                                            marginBottom: { xs: "16px", sm: 0 }
                                        }}
                                    >
                                        <CheckCircleOutline sx={{ color: "#8acd42", fontSize: 65 }} />
                                    </Box>

                                    <Typography
                                        sx={{
                                            textAlign: { xs: 'center', sm: 'center' },
                                        }}
                                    >

                                        <h5 style={{ color: '#1e5af9', fontWeight: 'bold', textTransform: "capitalize" }}>Payment Successful!</h5>
                                        <p className='mt-3'>Thank you for your purchase. Your subscription has been activated successfully.</p>
                                    </Typography>
                                </> : <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            alignItems: "center",
                                            justifyContent: { xs: "center", sm: "flex-start" },
                                            marginRight: '10px',
                                            marginBottom: { xs: "16px", sm: 0 }
                                        }}
                                    >
                                        <HighlightOff sx={{ color: "#ef4444", fontSize: 65 }} />
                                    </Box>

                                    <Typography
                                        sx={{
                                            textAlign: { xs: 'center', sm: 'center' },
                                        }}
                                    >
                                        <h5 style={{ color: '#1e5af9', fontWeight: 'bold', textTransform: "capitalize" }}>Payment Failed!</h5>
                                        <p className='mt-3'>We are unable to complete your payment. Please choose a different payment method and try again.</p>
                                    </Typography>
                                </>}
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>

            <div>
                <Footer />
            </div>

        </>
    )
}

export default SubscriptionResponse