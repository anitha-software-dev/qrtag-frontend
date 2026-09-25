import '../css/App.css'
import Navbar from '../common/Navbar'
import { useEffect, useState } from 'react';
import {
    Typography, Box, TableCell, TableContainer, TableHead, TableRow, Paper, Table, TableBody, Card, CardContent, Divider
} from '@mui/material'
import Footer from '../common/Footer.js'
import Breadcrumbs from '../common/Breadcrumbs'
import { BeatLoader } from 'react-spinners'
import { useNavigate, useParams } from 'react-router-dom';
import NoItem from '../../images/no-item.jpg'
import Axios from '../../config/axios';
import moment from 'moment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const StoreOrderDetail = () => {

    const nav = useNavigate()
    const { type, id } = useParams();
    const [order, setOrder] = useState({});
    const [subscription, setSubscription] = useState({});
    const [loading, setLoading] = useState(true)

    const fetchProduct = async () => {
        setLoading(true)
        if (type === 'product') {
            Axios.get(`/common/store-orders/${id}`)
                .then(response => {
                    setLoading(false)
                    if (response?.data && response?.data.status) {
                        setOrder(response?.data?.item);
                    }
                })
                .catch(error => {
                    setLoading(false)
                    console.error('Error fetching plan data:', error);
                });
        } else if (type === 'subscription') {
            Axios.get(`/users/subscription-details/${id}`)
                .then(response => {
                    setLoading(false)

                    if (response?.data && response?.data.status) {
                        setSubscription(response?.data?.subscription);
                    }
                })
                .catch(error => {
                    setLoading(false)
                    console.error('Error fetching plan data:', error);
                });
        }
    }

    useEffect(() => {
        if (type && id) {
            fetchProduct()
        }
    }, [type, id])

    return (
        <>
            <Navbar />
            <Breadcrumbs breadCrumbParent='Home' breadCrumbChild='Order' breadCrumbActive='View Detail' />

            <div className='section-background' style={{ minHeight: '100vh' }}>
                <div className="container py-5" >

                    <div className='p-2 p-md-0' style={{ background: '#fff', borderRadius: '10px' }}>

                        {(loading) ? (
                            <div className='text-center w-100' style={{ minHeight: "300px", paddingTop: "8rem" }}>
                                <BeatLoader />
                            </div>
                        ) : (
                            (type === 'product' && order && Object.keys(order).length > 0) ? (
                                <Box sx={{ my: 4, p: { xs: 1, md: 4 } }}>
                                    <Box display="flex" justifyContent="start" alignItems="center" onClick={() => nav(`/orders`)} style={{ cursor: 'pointer' }}>
                                        <ArrowBackIcon style={{ color: '#1e5af9' }} />
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: '#1e5af9',
                                            whiteSpace: 'nowrap',
                                            fontSize: 18
                                        }}>
                                            Orders
                                        </Typography>
                                    </Box>
                                    <Card sx={{ mb: 3, mt: 3 }} variant="outlined">
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
                                                    Order Detail
                                                </Typography>
                                                <Box sx={{ fontWeight: 500, color: '#64748b' }}>
                                                    Order Status:

                                                    {(order.is_delivered) ? (
                                                        <Box
                                                            px={1.5}
                                                            py={0.5}
                                                            mx={1}
                                                            bgcolor="#d1fae5"
                                                            color="#059669"
                                                            fontSize={12}
                                                            fontWeight={500}
                                                            borderRadius="12px"
                                                            display="inline-block"
                                                        >
                                                            Delivered
                                                        </Box>
                                                    ) : (
                                                        <Box
                                                            px={1.5}
                                                            py={0.5}
                                                            mx={1}
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
                                                </Box>
                                            </Box>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Order ID: <span style={{ fontWeight: 400 }}>{order.id}</span></Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Tracking Number: <span style={{ fontWeight: 400 }}>{order.tracking_number || 'N/A'}</span></Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Order Date: <span style={{ fontWeight: 400 }}>{moment(order.created_at).format('lll')}</span></Typography>
                                        </CardContent>
                                    </Card>

                                    <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                                        <Card sx={{ flex: 1 }} variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
                                                    Customer Detail
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <Typography>
                                                    <span style={{ fontWeight: 'bold' }}>Name:</span> {order.user_info?.name}
                                                </Typography>
                                                <Typography>
                                                    <span style={{ fontWeight: 'bold' }}>Email:</span> {order.user_info?.email}
                                                </Typography>
                                                <Typography>
                                                    <span style={{ fontWeight: 'bold' }}>Phone:</span> {order.user_info?.phone}
                                                </Typography>
                                            </CardContent>
                                        </Card>

                                        <Card sx={{ flex: 1 }} variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
                                                    Shipping Detail
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <Typography>
                                                    <span style={{ fontWeight: 'bold' }}>Address:</span> {order.shipping_address?.line1}
                                                </Typography>
                                                <Typography>
                                                    <span style={{ fontWeight: 'bold' }}>City:</span> {order.shipping_address?.city}
                                                </Typography>
                                                <Typography>
                                                    <span style={{ fontWeight: 'bold' }}>State:</span> {order.shipping_address?.state}
                                                </Typography>
                                                <Typography>
                                                    <span style={{ fontWeight: 'bold' }}>Country:</span> {order.shipping_address?.country}
                                                </Typography>
                                                <Typography>
                                                    <span style={{ fontWeight: 'bold' }}>Zip Code:</span> {order.shipping_address?.postal_code}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>

                                    <Card sx={{ mb: 3 }} variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
                                                Product Detail
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 'none' }}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Item</TableCell>
                                                            <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Price</TableCell>
                                                            <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Quantity</TableCell>
                                                            <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px', textAlign: 'right' }}>Total</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {order.items.map((item, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell>
                                                                    <Box display="flex" alignItems="center" gap={2}>
                                                                        <img src={(item.thumbnail && item.thumbnail !== "N/A") ? item.thumbnail : (item.photos && item.photos.length > 0) ? item.photos[0].photo : NoItem} alt="Img" width={60} />
                                                                        <Typography fontWeight={400}>{item.item_name}</Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography fontSize={14}>${item.price}</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography fontSize={14}>{item.quantity}</Typography>
                                                                </TableCell>
                                                                <TableCell style={{ textAlign: 'right', width: '200px' }}>
                                                                    <Typography fontSize={14}>${(parseFloat(item.price) * item.quantity).toFixed(2)}</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                        <TableRow>
                                                            <TableCell colSpan={2} style={{ border: 'none' }}></TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                                <Typography variant="h6" style={{ fontSize: '1rem' }}>Sub Total</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="h6" style={{ fontSize: '1rem', textAlign: 'right' }}>${parseFloat(order.total_amount).toFixed(2)}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={2} style={{ border: 'none' }}></TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                                <Typography variant="h6" style={{ fontSize: '1rem' }}>Tax {(order.tax_percentage) && `(${order.tax_percentage}%)`}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="h6" style={{ fontSize: '1rem', textAlign: 'right' }}>${parseFloat(order.tax_amount).toFixed(2)}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={2} style={{ border: 'none' }}></TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                                <Typography variant="h6" style={{ fontSize: '1rem', textAlign: 'right' }}>Grand Total</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="h6" style={{ fontSize: '1rem', textAlign: 'right' }}>${parseFloat(order.total_with_tax).toFixed(2)}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ) : (type === 'subscription' && subscription && Object.keys(subscription).length > 0) ? (
                                <Box sx={{ my: 4, p: { xs: 1, md: 4 } }}>

                                    <Box display="flex" justifyContent="start" alignItems="center" onClick={() => nav(`/orders`)} style={{ cursor: 'pointer' }}>
                                        <ArrowBackIcon style={{ color: '#1e5af9' }} />
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: '#1e5af9',
                                            whiteSpace: 'nowrap',
                                            fontSize: 18
                                        }}>
                                            Orders
                                        </Typography>
                                    </Box>

                                    <Card sx={{ mt: 3, mb: 3, p: 2 }} variant="outlined">
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb' }}>
                                                    Subscription Details
                                                </Typography>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Box sx={{
                                                        width: 10, height: 10, borderRadius: '50%',
                                                        backgroundColor: (subscription.is_active) ? '#22c55e' : '#ef4444', display: 'inline-block'
                                                    }} />
                                                    <Typography sx={{ color: (subscription.is_active) ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                                                        {(subscription.is_active) ? 'ACTIVE' : 'INACTIVE'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Divider sx={{ mb: 2 }} />
                                            <Box display="flex" justifyContent="space-between" alignItems="center" pt={4} mb={3}>
                                                <Box textAlign="center" flex={1}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                        {subscription.plan_name || 'N/A'}
                                                    </Typography>
                                                    <Typography sx={{ color: '#64748b', fontSize: 15 }}>Plan Name</Typography>
                                                </Box>
                                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                                <Box textAlign="center" flex={1}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                        {subscription.created_at ? moment(subscription.created_at).format('ll') : ""}
                                                    </Typography>
                                                    <Typography sx={{ color: '#64748b', fontSize: 15 }}>Created At</Typography>
                                                </Box>
                                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                                <Box textAlign="center" flex={1}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                        {subscription.days_remaining}
                                                    </Typography>
                                                    <Typography sx={{ color: '#64748b', fontSize: 15 }}>Days Remaining</Typography>
                                                </Box>
                                            </Box>
                                            <Typography sx={{ mt: 4, mb: 1, textAlign: 'center', color: '#64748b' }}>
                                                The plan is billed <strong>Yearly</strong> and expires on: <strong >{moment(subscription.expires_at).format('LL')}</strong>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ) : (
                                <div className='w-100' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: "300px", padding: "5rem", backgroundColor: '#fff', borderTop: '1px solid #e0e0e0' }}>
                                    <Typography sx={{ mb: 2, color: '#737D9B' }} variant="p">No Data Found!</Typography>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div >

            <Footer />

        </>
    );
};

export default StoreOrderDetail;
