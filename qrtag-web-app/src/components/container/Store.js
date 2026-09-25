import '../css/App.css'
import Navbar from '../common/Navbar'
import { useEffect, useState } from 'react';
import {
    Typography, Button, Box, Grid, Badge
} from '@mui/material'
import Footer from '../common/Footer.js'
import Breadcrumbs from '../common/Breadcrumbs'
import { toast } from 'react-toastify';
import Axios from '../../config/axios.js';
import { Store, UpdateStore } from '../../StoreContext';
import { BeatLoader } from 'react-spinners'
import { ShoppingCart, ShoppingBagOutlined } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NoItem from '../../images/no-item.jpg'

const StoreList = () => {

    const nav = useNavigate()
    const { user, loggedIn, cartItems } = Store();
    const [products, setProducts] = useState([]);
    const [loading, setLoadng] = useState(true)

    const getProductList = () => {
        setLoadng(true);
        Axios.get('/common/store-items/')
            .then((res) => {
                setLoadng(false);
                if (res && res.data) {
                    setProducts(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoadng(false);
                setProducts([]);
            });
    };

    useEffect(() => {
        getProductList();
    }, []);

    return (
        <>
            <Navbar />
            <Breadcrumbs breadCrumbParent='Home' breadCrumbChild='Store' breadCrumbActive='Manage Products' />

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
                                Products
                            </Typography>

                            <Box display="flex" alignItems="center" sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', lg: 'flex-end' }, gap: 2 }}>

                                {/* <Button
                                    sx={{
                                        backgroundColor: '#EFF4FB',
                                        color: '#737D9B',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        borderRadius: '6px',
                                        px: 2,
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        '&:hover': { backgroundColor: '#EFF4FB' }
                                    }}
                                    className="add-item-button"
                                    onClick={() => nav(`/store/cart`)}
                                >
                                    <Badge color="primary"  badgeContent={cartItems.reduce((sum, i) => sum + i.quantity, 0)} invisible={false}>
                                        <ShoppingBagOutlined />
                                    </Badge>
                                </Button> */}

                            </Box>
                        </Box>
                        {(loading) ? <>
                            <div className='text-center w-100' style={{ minHeight: "300px", marginTop: "8rem" }}>
                                <BeatLoader />
                            </div>
                        </> : <>
                            {(products && products.length > 0) ? <>
                                <div className='p-4'>
                                    <Grid container spacing={3}>
                                        {products.map((item, index) => (
                                            <Grid item xs={12} sm={4} md={3} lg={3} key={index}>
                                                <Link to={`/store/item/${item.id}`} style={{ textDecoration: 'none' }}>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: '#EFF4FB',
                                                            borderRadius: 3,
                                                            boxShadow: '0 0 0 1px #e2e8f0',
                                                            overflow: 'hidden',
                                                            transition: 'transform 0.2s',
                                                            '&:hover': { transform: 'scale(1.02)' },
                                                            cursor: 'pointer',
                                                            height: 370
                                                        }}
                                                    >
                                                        <img
                                                            src={(item.thumbnail && item.thumbnail !== "N/A") ? item.thumbnail : (item.photos && item.photos.length > 0) ? item.photos[0].photo : NoItem}
                                                            alt="product"
                                                            style={{ width: '100%', padding: '15px', height: 300, objectFit: 'cover' }}
                                                        />
                                                        <Box px={2} pb={2} pt={1}>
                                                            <Box display="flex" flexDirection="column">
                                                                <Typography fontWeight={600} fontSize={14}>{item.name}</Typography>
                                                                <Typography fontSize={14} color="#2d2d2d">${item.price}</Typography>
                                                            </Box>
                                                        </Box>

                                                    </Box>
                                                </Link>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div>
                            </> : <>
                                <div className='text-center w-100' style={{ minHeight: "300px", paddingTop: "8rem", backgroundColor: '#fff', borderTop: '1px solid #e0e0e0', }}>
                                    <p>No Products Found!</p>
                                </div>
                            </>}
                        </>}
                    </div>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
};

export default StoreList;
