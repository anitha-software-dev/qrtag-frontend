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
import { Add, Remove, ShoppingBagOutlined } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useNavigate, useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import NoItem from '../../images/no-item.jpg'

const StoreItem = () => {

    const { id } = useParams()
    const updateStore = UpdateStore()
    const nav = useNavigate()
    const { user, loggedIn, cartItems } = Store();
    const [data, setData] = useState(null);
    const [loading, setLoadng] = useState(true)
    const [images, setImages] = useState([])
    const [count, setCount] = useState(1)

    const getProductDetail = () => {
        setLoadng(true);
        Axios.get(`/common/store-items/${id}`)
            .then((res) => {
                setLoadng(false);
                if (res && res.data) {
                    setData(res.data);

                    if (res.data.photos && res.data.photos.length > 0) {
                        const temp = res.data?.photos.map(item => ({
                            original: item.photo,
                            thumbnail: item.photo,
                            originalHeight: '300'
                        }))
                        setImages(temp)
                    } else {
                        setImages([{
                            original: NoItem,
                            thumbnail: NoItem,
                            originalHeight: '300'
                        }])
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                setLoadng(false);
                setData(null);
            });
    };

    useEffect(() => {
        if (id) {
            getProductDetail();
        }
    }, [id]);

    const handleProduct = (item) => {
        const x = [...cartItems]
        const existingIndex = x.findIndex((i) => i.id === item.id)

        if (item.stock_quantity === 0) {
            toast.error(`Item is not available in stock!`)
            return false
        }

        if (existingIndex > -1) {
            const newQuantity = x[existingIndex].quantity + count
            x[existingIndex].quantity = Math.min(newQuantity, item.stock_quantity)
        } else {
            x.push({ ...item, quantity: count })
        }

        updateStore({ cartItems: x })
        setCount(1);
    };

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
                            <Box display="flex" justifyContent="start" alignItems="center" onClick={() => nav(`/store`)} style={{ cursor: 'pointer' }}>
                                <ArrowBackIcon style={{ color: '#1e5af9' }} />
                                <Typography variant="h6" sx={{
                                    fontWeight: 600,
                                    color: '#1e5af9',
                                    whiteSpace: 'nowrap',
                                    fontSize: 18
                                }}>
                                    Back
                                </Typography>
                            </Box>
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
                                    <Badge color="primary" badgeContent={cartItems.reduce((sum, i) => sum + i.quantity, 0)} invisible={false}>
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
                            {(data) ? <>
                                <div className='main_layout detail_layout mt-4 mb-4 px-2 pt-4 px-lg-5'>
                                    <div className=' all_images '>
                                        <div className='main_img_div border rounded p-3'>
                                            {images && images.length > 0 && (
                                                <ImageGallery
                                                    items={images}
                                                    showThumbnails={true}
                                                    thumbnailPosition="bottom"
                                                    showFullscreenButton={false}
                                                    showPlayButton={false}
                                                    autoPlay={false}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className='details_div'>
                                        <div className='name_detail_div mt-4 mt-md-0'>
                                            <h2 style={{ color: '#1E5AF9', fontSize: '30px' }}>{data?.name}</h2>
                                        </div>
                                        <div className='row g-0 border rounded overflow-hidden mb-3'>
                                            <div className='col-md-6 col-6 border-end  border-bottom px-3 py-2'>
                                                <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Category:</p>
                                                <p style={{ textTransform: 'capitalize' }}>{data?.item_type.replaceAll('_', ' ')}</p>
                                            </div>
                                            <div className='col-md-6 col-6 border-end px-3 py-2'>
                                                <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Price:</p>
                                                <p>${data?.price}</p>
                                            </div>
                                            {/* <div className='col-md-4 col-6 border-end border-bottom px-3 py-2'>
                                                <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }} >Stock:</p>
                                                <p>{data?.stock_quantity}</p>
                                            </div> */}
                                            <div className='col-md-12 border-top px-3 py-2'>
                                                <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Description:</p>
                                                <p className='LostItem_Description'>
                                                    {data?.description}
                                                </p>
                                            </div>
                                        </div>

                                        <Box display="flex" alignItems="center" justifyContent="space-between"
                                            style={{ position: "relative", border: "1px solid #64748B", borderRadius: "30px", padding: "10px 20px", margin: "30px auto", width: "250px" }}
                                        >
                                            <Box onClick={() => { setCount(Math.max(count - 1, 1)) }} style={{ lineHeight: 0, cursor: "pointer" }}>
                                                <Remove fontSize="small" />
                                            </Box>
                                            <Typography fontSize={14}>{count}</Typography>
                                            <Box
                                                style={{ lineHeight: 0, cursor: "pointer" }}
                                                onClick={() => {
                                                    if (count < data?.stock_quantity) {
                                                        setCount(Math.min(count + 1, data?.stock_quantity))
                                                    } else {
                                                        toast.error(`Only ${data?.stock_quantity} items can be added to your cart due to limited availability!`);
                                                    }
                                                }}
                                            >
                                                <Add fontSize="small" />
                                            </Box>
                                        </Box>

                                        <Button
                                            style={{ backgroundColor: '#ef4444', borderRadius: '10px', color: '#fff', lineHeight: '3' }}
                                            className='found_btn'
                                            onClick={() => handleProduct(data)}
                                        >
                                            Add to Cart
                                        </Button>

                                    </div>

                                </div>
                            </> : <>
                                <div className='text-center w-100' style={{ minHeight: "300px", paddingTop: "8rem", backgroundColor: '#fff', borderTop: '1px solid #e0e0e0', }}>
                                    <p>No Product Found!</p>
                                </div>
                            </>}
                        </>}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default StoreItem;
