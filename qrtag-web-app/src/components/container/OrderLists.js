import Navbar from '../common/Navbar'
import { useEffect, useState } from 'react';
import { Grid, Typography, Box, Table, TableBody, Tooltip, TableCell, TableContainer, TableHead, TableRow, Paper, } from '@mui/material';

import '../css/App.css'
import Footer from '../common/Footer'
import Breadcrumbs from '../common/Breadcrumbs'
import Axios from '../../config/axios';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import ViewIcon from '../../images/view-icon.png'
import moment from 'moment-timezone'

const OrderLists = () => {

    const nav = useNavigate()
    const [histories, setHistories] = useState([])
    const [subscriptions, setSubscriptions] = useState([])
    const [selected, setSelected] = useState('subscription')
    const [loading, setLoading] = useState(true)

    const FetchOrderData = () => {
        setLoading(true)
        Axios.get('/common/store-orders/')
            .then(response => {
                setLoading(false)
                if (response?.data && response?.data.length > 0) {
                    setHistories(response?.data);
                }
            })
            .catch(error => {
                setLoading(false)
                console.error('Error fetching plan data:', error);
            });
    };

    const FetchSubscriptionData = () => {
        setLoading(true)
        Axios.get('/users/subscription-details/')
            .then(response => {
                setLoading(false)
                
                if (response?.data && response?.data.status) {
                    setSubscriptions(response?.data?.subscription_history || []);
                }
            })
            .catch(error => {
                setLoading(false)
                console.error('Error fetching plan data:', error);
            });
    };

    useEffect(() => {
        FetchSubscriptionData()
        FetchOrderData();
    }, []);

    return (
        <>
            <Navbar />
            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbChild='Manage Orders' breadCrumbActive='Orders' />

            <div className='section-background' style={{ minHeight: '100vh' }}>
                <div className='container py-5'>
                    <div className='p-2 p-md-0' style={{ background: '#fff', borderRadius: '10px' }}>
                        <Grid container display="flex" alignItems="center" justifyContent={{ xs: 'center', sm: 'space-between', lg: 'space-between' }} sx={{
                            padding: '2%', borderBottom: '1px solid #E2E8F0', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2, lg: 0 },
                        }}>
                            <Grid item xs={12} sm={6} md={6} display="flex" justifyContent={{ xs: 'center', sm: 'flex-start', lg: 'flex-start' }}>
                                <h3
                                    style={{
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        color: '#1e5af9',
                                        marginBottom: '0px'
                                    }}>
                                    Manage Orders
                                </h3>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} sx={{
                                display: 'flex',
                                justifyContent: {
                                    xs: 'center', sm: 'flex-end', md: 'flex-end', lg: 'flex-end'
                                }
                            }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#d0d8ef',
                                        borderRadius: '999px',
                                        padding: '4px',
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: '220px',
                                        height: '42px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            left: selected === 'subscription' ? 4 : 'calc(100% - 112px)',
                                            width: '108px',
                                            height: '34px',
                                            backgroundColor: '#fff',
                                            borderRadius: '999px',
                                            transition: 'left 0.3s ease',
                                            zIndex: 1,
                                        }}
                                    />

                                    <Box
                                        onClick={() => setSelected('subscription')}
                                        sx={{
                                            width: '50%',
                                            textAlign: 'center',
                                            zIndex: 2,
                                            color: selected === 'subscription' ? '#0f172a' : '#334155',
                                            fontWeight: 500,
                                            fontSize: '14px',
                                        }}
                                    >
                                        Subscriptions
                                    </Box>

                                    <Box
                                        onClick={() => setSelected('store')}
                                        sx={{
                                            width: '50%',
                                            textAlign: 'center',
                                            zIndex: 2,
                                            color: selected === 'store' ? '#0f172a' : '#334155',
                                            fontWeight: 500,
                                            fontSize: '14px',
                                        }}
                                    >
                                        Store Orders
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>



                        {/******* ORDER LISTING *******/}
                        {(loading) ? <>
                            <div className='text-center w-100' style={{ minHeight: "200px", marginTop: "8rem" }}>
                                <BeatLoader />
                            </div>
                        </> : <>
                            {(selected === 'subscription') ? <>
                                {(subscriptions && subscriptions.length > 0) ? <>
                                    <TableContainer component={Paper} elevation={2} sx={{ minHeight: "300px", padding: '1%', marginTop: { xs: '5%', md: 0 } }}>
                                        <Table >
                                            <TableHead>
                                                <TableRow >
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Plan ID</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Plan Name</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Created Date</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Status</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px', textAlign: 'right' }}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody >
                                                {subscriptions.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <Typography fontWeight={400}>#{item?.id}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography fontSize={14}>{item?.plan_name}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography fontSize={14}>{moment(item?.created_at).format('lll')}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {(!item.is_active) && (
                                                                <Box
                                                                    px={1.5}
                                                                    py={0.5}
                                                                    bgcolor="#fee2e2"
                                                                    color="#dc7526ff"
                                                                    fontSize={12}
                                                                    fontWeight={500}
                                                                    borderRadius="12px"
                                                                    display="inline-block"
                                                                >
                                                                    Expired
                                                                </Box>
                                                            )}
                                                            {(item.is_active) && (
                                                                <Box
                                                                    px={1.5}
                                                                    py={0.5}
                                                                    bgcolor="#d1fae5"
                                                                    color="#059669"
                                                                    fontSize={12}
                                                                    fontWeight={500}
                                                                    borderRadius="12px"
                                                                    display="inline-block"
                                                                >
                                                                    Active
                                                                </Box>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box style={{ textAlign: 'right' }}>
                                                                <Tooltip title="View Order" placement="top" arrow>
                                                                    <img src={ViewIcon} alt="view" style={{ cursor: 'pointer' }} width={35} onClick={() => nav(`/order/view/subscription/${item?.id}`)} />
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </> : <>
                                    <div className='text-center w-100' style={{ minHeight: "300px", paddingTop: "8rem", backgroundColor: '#fff', borderTop: '1px solid #e0e0e0', }}>
                                        <p>No Subscriptions Found!</p>
                                    </div>
                                </>}
                            </> : <>
                                {(histories && histories.length > 0) ? <>
                                    <TableContainer component={Paper} elevation={2} sx={{ minHeight: "300px", padding: '1%', marginTop: { xs: '5%', md: 0 } }}>
                                        <Table >
                                            <TableHead>
                                                <TableRow >
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Order ID</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Order Date</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Total Amount</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Paymemt Status</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px', textAlign: 'right' }}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody >
                                                {histories.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <Typography fontWeight={400}>#{item.id}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography fontSize={14}>{moment(item.created_at).format('lll')}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography fontSize={14}>${item.total_with_tax}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {(item.status === 'pending' || item.status === 'failed') && (
                                                                <Box
                                                                    px={1.5}
                                                                    py={0.5}
                                                                    bgcolor="#fee2e2"
                                                                    color="#dc7526ff"
                                                                    fontSize={12}
                                                                    fontWeight={500}
                                                                    borderRadius="12px"
                                                                    display="inline-block"
                                                                >
                                                                    Pending
                                                                </Box>
                                                            )}
                                                            {item.status === 'success' && (
                                                                <Box
                                                                    px={1.5}
                                                                    py={0.5}
                                                                    bgcolor="#d1fae5"
                                                                    color="#059669"
                                                                    fontSize={12}
                                                                    fontWeight={500}
                                                                    borderRadius="12px"
                                                                    display="inline-block"
                                                                >
                                                                    Completed
                                                                </Box>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box style={{ textAlign: 'right' }}>
                                                                <Tooltip title="View Item" placement="top" arrow>
                                                                    <img src={ViewIcon} alt="view" style={{ cursor: 'pointer' }} width={35} onClick={() => nav(`/order/view/product/${item?.id}`)} />
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </> : <>
                                    <div className='text-center w-100' style={{ minHeight: "300px", paddingTop: "8rem", backgroundColor: '#fff', borderTop: '1px solid #e0e0e0', }}>
                                        <p>No Orders Found!</p>
                                    </div>
                                </>}
                            </>}
                        </>}
                    </div>
                </div >
            </div>

            <div>
                <Footer />
            </div>

        </>
    )
}

export default OrderLists