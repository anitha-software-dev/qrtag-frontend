import '../css/App.css'
import Navbar from '../common/Navbar'
import { useEffect, useState } from 'react';
import {
    Typography, Button, Box, TableCell, TableContainer, TableHead, TableRow, Paper, Table, TableBody
} from '@mui/material'
import Footer from '../common/Footer.js'
import Breadcrumbs from '../common/Breadcrumbs'
import { Store, UpdateStore } from '../../StoreContext';
import { BeatLoader } from 'react-spinners'
import { Add, CancelOutlined, DeleteForever, DeleteOutline, Remove, ShoppingCartOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NoItem from '../../images/no-item.jpg'
import Payments from '../../images/payments.png'
import ConfirmCheckoutModal from '../common/ConfirmCheckoutModal.js';

const StoreList = () => {

    const nav = useNavigate()
    const updateStore = UpdateStore()
    const { cartItems } = Store();
    const [products, setProducts] = useState([]);
    const [loading, setLoadng] = useState(true)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (cartItems) {
            setProducts(cartItems)
            setLoadng(false)
        }
    }, [cartItems])

    const updateQuantity = (itemId, newQty) => {
        const updated = cartItems.map((item) =>
            item.id === itemId
                ? { ...item, quantity: Math.max(1, newQty) }
                : item
        );
        updateStore({ cartItems: updated });
    };

    const removeItem = (itemId) => {
        const updated = cartItems.filter((item) => item.id !== itemId);
        updateStore({ cartItems: updated });
    };

    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);


    return (
        <>
            <Navbar />
            <Breadcrumbs breadCrumbParent='Home' breadCrumbChild='Store' breadCrumbActive='Manage Cart' />

            <div className='section-background' style={{ minHeight: '100vh' }}>
                <div className="container py-5" >

                    <div className='p-2 p-md-0' style={{ background: '#fff', borderRadius: '10px' }}>

                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{
                            padding: '2%', borderBottom: '1px solid #E2E8F0', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2, lg: 0 },
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                color: '#1e5af9',
                                whiteSpace: 'nowrap',
                                fontSize: 21
                            }}>
                                Your Cart
                            </Typography>
                        </Box>
                        {(loading) ? <>
                            <div className='text-center w-100' style={{ minHeight: "300px", marginTop: "8rem" }}>
                                <BeatLoader />
                            </div>
                        </> : <>
                            {(products && products.length > 0) ? <>
                                <TableContainer component={Paper} elevation={2} sx={{ boxShadow: 'none', padding: '1%', marginTop: { xs: '5%', md: 0 } }}>
                                    <Table >
                                        <TableHead>
                                            <TableRow >
                                                <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Item</TableCell>
                                                <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Price</TableCell>
                                                <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Quantity</TableCell>
                                                <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px', textAlign: 'right' }}>Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {products.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <img src={(item.thumbnail && item.thumbnail !== "N/A") ? item.thumbnail : (item.photos && item.photos.length > 0) ? item.photos[0].photo : NoItem} alt="Img" width={60} />
                                                            <Typography fontWeight={400}>{item.name}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontSize={14}>${item.price}</Typography>
                                                    </TableCell>
                                                    <TableCell style={{ width: '200px' }}>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <Box display="flex" alignItems="center" justifyContent="space-between"
                                                                style={{ position: "relative", border: "1px solid #737D9B", borderRadius: "16px", padding: "0px 12px", width: "100px", height: '32px' }}
                                                            >
                                                                <Box style={{ lineHeight: 0, cursor: "pointer", color: '#737D9B' }}
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Remove fontSize='12' />
                                                                </Box>
                                                                <Typography style={{ fontSize: '13px', color: '#737D9B' }}>{item.quantity}</Typography>
                                                                <Box style={{ lineHeight: 0, cursor: "pointer", color: '#737D9B' }}
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.id,
                                                                            Math.min(item.quantity + 1, item.stock_quantity)
                                                                        )
                                                                    }
                                                                >
                                                                    <Add fontSize='12' />
                                                                </Box>
                                                            </Box>

                                                            <DeleteForever style={{ color: "#737D9B", cursor: 'pointer' }} onClick={() => removeItem(item.id)} />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: 'right', width: '200px' }}>
                                                        <Typography fontSize={14}>
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                            <TableRow>
                                                <TableCell colSpan={2} style={{ border: 'none' }}></TableCell>
                                                <TableCell>
                                                    <Typography variant="h6" style={{ fontSize: '1rem', color: '#64748b' }}>Estimated Total</Typography>
                                                </TableCell>
                                                <TableCell style={{ textAlign: 'right', width: '200px' }}>
                                                    <Typography variant="h6" style={{ fontSize: '1rem', color: '#64748b' }}>${total.toFixed(2)}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={2} style={{ border: 'none' }}></TableCell>
                                                <TableCell colSpan={4} style={{ border: 'none', textAlign: 'center' }}>
                                                    <Typography sx={{ color: '#737D9B' }} variant="p">Taxes, shipping calculated at checkout</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={2} style={{ border: 'none' }}></TableCell>
                                                <TableCell colSpan={2}>
                                                    <Button
                                                        style={{ backgroundColor: '#2563eb', borderRadius: '10px', color: '#fff', lineHeight: '3' }}
                                                        className='found_btn'
                                                        onClick={() => setOpen(!open)}
                                                    >
                                                        Checkout
                                                    </Button>

                                                    <img src={Payments} alt="payments" style={{ width: '100%' }} />
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </> : <>
                                <div className='w-100' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: "300px", padding: "5rem", backgroundColor: '#fff', borderTop: '1px solid #e0e0e0' }}>
                                    <ShoppingCartOutlined style={{ fill: '#737D9B', fontSize: '80px' }} />
                                    <Typography sx={{ my: 1, color: '#2c2d2f', fontWeight: 'bold' }} variant="h5">Your cart is empty </Typography>
                                    <Typography sx={{ my: 1, color: '#737D9B' }} variant="p">It looks like you haven't added any items to your cart yet. </Typography>
                                    <Typography sx={{ mb: 2, color: '#737D9B' }} variant="p">Start browsing our products and add some items to your cart.</Typography>

                                    <Button
                                        sx={{
                                            backgroundColor: '#2563eb',
                                            color: '#fff',
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            borderRadius: '6px',
                                            my: 2,
                                            px: 2,
                                            py: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            '&:hover': { backgroundColor: '#1d4ed8' }
                                        }}
                                        className="add-item-button"
                                        onClick={() => nav(`/store`)}
                                    >
                                        Continue Browsing
                                    </Button>
                                </div>
                            </>}
                        </>}
                    </div>
                </div>
            </div>

            <Footer />

            {(open) && <>
                <ConfirmCheckoutModal
                    open={open}
                    setOpen={setOpen}
                />
            </>}

        </>
    );
};

export default StoreList;
