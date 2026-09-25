import Navbar from '../common/Navbar'
import TopNavbar from '../common/TopNavContent';
import React, { useState, useEffect } from 'react'
import { Card, CardContent, Grid, Typography, Link } from '@mui/material'
import Footer from '../common/Footer'
import Breadcrumbs from '../common/Breadcrumbs'
import Axios from '../../config/axios';
import { BeatLoader } from 'react-spinners'
import NoItem from '../../images/no-item.jpg'

const Notifications = () => {

    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false);

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDateGroup = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();

        const isToday = date.toDateString() === today.toDateString();
        if (isToday) return 'Today';

        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
    };

    const formatNotification = (raw) => {
        const grouped = {};

        raw.forEach(notification => {
            const dateGroup = formatDateGroup(notification.created_at);
            const time = formatTime(notification.created_at);

            if (!grouped[dateGroup]) grouped[dateGroup] = [];

            // Determine thumbnail
            let thumbnail = null;
            if (notification.data.thumbnail && notification.data.thumbnail !== "N/A") {
                thumbnail = notification.data.thumbnail;
            } else if (notification.data.photos && notification.data.photos.length > 0) {
                thumbnail = notification.data.photos[0].photo;
            }
            
            grouped[dateGroup].push({
                title: notification.data.name,
                message: notification.body,
                time: time,
                thumbnail: thumbnail
            });
        });

        const arr = Object.entries(grouped).map(([date, items]) => ({
            date,
            items
        }));

        setNotifications(arr)
    }

    const fetchNotifications = () => {
        setLoading(true)
        Axios.get('/notification/')
            .then(response => {
                setLoading(false)
                if (response?.data) {
                    formatNotification(response.data);
                }
            })
            .catch(error => {
                setLoading(false)
                console.error('Error fetching plan data:', error);
            });
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <>
            <Navbar />

            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbChild='Notifications' breadCrumbActive='Manage Notifications' />
            <TopNavbar />
            
            <div className='section-background' style={{ minHeight: '100vh' }}>
                <div className='container py-5'>
                    <div
                        className='p-3'
                        style={{
                            background: '#fff',
                            borderTopLeftRadius: '12px',
                            borderTopRightRadius: '12px'
                        }}
                    >
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#1e5af9',
                            whiteSpace: 'nowrap',
                            fontSize: 21
                        }}>
                            Notifications
                        </Typography>
                    </div>

                    {(loading) ? <>
                        <div className='text-center w-100' style={{ minHeight: "200px", paddingTop: "8rem", backgroundColor: '#fff', borderTop: '1px solid #e0e0e0', }}>
                            <BeatLoader />
                        </div>
                    </> : <>
                        {(notifications && notifications.length > 0) ? <>
                            {notifications.map((group, groupIndex) => (
                                <div key={groupIndex}>
                                    <div
                                        style={{
                                            backgroundColor: '#f0f4ff',
                                            padding: '18px',
                                            color: '#637381'
                                        }}
                                    >
                                        {group.date}
                                    </div>
                                    {
                                        group.items.map((item, i) => (
                                            <Card
                                                key={i}
                                                sx={{
                                                    boxShadow: 0,
                                                    borderBottom: '1px solid #e0e0e0',
                                                    borderRadius: 0,
                                                    padding: '8px 0',
                                                    ...(i === group.items.length - 1 && {
                                                        borderBottomLeftRadius: '12px',
                                                        borderBottomRightRadius: '12px'
                                                    })
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid container justifyContent='space-between' alignItems='center'>
                                                        <Grid item xs={12} sm={9} className='d-flex align-items-center'>
                                                            <img
                                                                src={(item.thumbnail) ? item.thumbnail : NoItem}
                                                                style={{ width: 40, height: 40, marginRight: 12 }}
                                                            />
                                                            <div>
                                                                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                                                    {item.title}
                                                                </Typography>
                                                                <Typography variant='body2' sx={{ fontSize: '14px' }}>
                                                                    {item.message}{' '}
                                                                    {/* <Link
                                                                        href='#'
                                                                        underline='always'
                                                                        sx={{ color: '#3c50e0', textDecoration: 'underline' }}
                                                                    >
                                                                        View message
                                                                    </Link> */}
                                                                </Typography>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={12} sm={3}
                                                            sx={{
                                                                textAlign: { xs: 'left', sm: 'right' },
                                                                marginTop: { xs: '8px', sm: 0 }
                                                            }}
                                                        >
                                                            <Typography variant='body2' sx={{ fontSize: '13px', color: '#637381' }}>
                                                                {item.time}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        ))
                                    }
                                </div>
                            ))}
                        </> : <>
                            <div className='text-center w-100' style={{ minHeight: "300px", paddingTop: "8rem", backgroundColor: '#fff', borderTop: '1px solid #e0e0e0', }}>
                                <p>No Notification Available!</p>
                            </div>
                        </>}
                    </>}
                </div>
            </div >
            <Footer />
        </>
    )
}

export default Notifications
