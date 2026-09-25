import '../css/App.css'
import Navbar from '../common/Navbar'
import { useEffect, useState } from 'react';
import CustomCookies from '../common/Cookies'

import 'react-image-gallery/styles/css/image-gallery.css';
import Footer from '../common/Footer.js'
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Breadcrumbs from '../common/Breadcrumbs'
import { toast } from 'react-toastify';
import Axios from '../../config/axios.js';
import { Store, UpdateStore } from '../../StoreContext';
import Geocode from "react-geocode";
import { firebaseConfig } from '../../config/firebase';
import mixpanel from 'mixpanel-browser';
import { BeatLoader } from 'react-spinners'
import ItemBox from './ItemBox';

Geocode.setApiKey(firebaseConfig.apiKey);

const Finder = () => {
   
    const navigate = useNavigate();
    let { uid } = useParams();
    const { user, loggedIn } = Store();
    const [lostItem, setLostItem] = useState({});
    const [mainImage, setMainImage] = useState();
    const [cookies, setCookie] = useCookies(['uid'])
    const updateStore = UpdateStore();
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(null);
    const [latitude, setLatitude] = useState()
    const [longitude, setLongitude] = useState()
    const [loading, setLoadng] = useState(true)

    const getLostItems = async (latitude, longitude) => {
        await Geocode.fromLatLng(latitude, longitude).then(
            (response) => {
                setLongitude(longitude)
                setLatitude(latitude)
                const address = response?.results[0]?.formatted_address;
                setLoadng(true)
                Axios.post(`/looser/find-item/${uid}/`, {
                    latitude,
                    longitude,
                    location: address.slice(0, 255)
                })
                    .then((response) => {
                        setLoadng(false)
                        if (Object.values(response?.data || {}).length === 0) {

                            navigate('/about', {
                                state: { error: true },
                            });
                            return
                        }

                        if (!response.data) {
                            window.location = '/*';
                        }

                        setLostItem(response?.data);
                        localStorage.setItem('itemDetail', JSON.stringify(response?.data));
                        if (response?.data?.photos?.length) {
                            setMainImage(response?.data?.photos[0]?.photo);
                        }

                        if (uid) {
                            sessionStorage.setItem('uuidcode', uid)
                        }
                    })
                    .catch((error) => {
                        setLoadng(false)
                        navigate('/about', {
                            state: { error: true },
                        });
                    });
            },
            (error) => {
                console.error(error);
                setLoadng(false)
            }
        );
    };
    const getLostItemsWithoutLoc = async () => {
        setLoadng(true)
        Axios.post(`/looser/find-item/${uid}/`)
            .then((response) => {
                setLoadng(false)
                if (Object.values(response?.data || {}).length === 0) {

                    navigate('/about', {
                        state: { error: true },
                    });
                    return
                }

                if (!response.data) {
                    window.location = '/*';
                }

                setLostItem(response?.data);
                localStorage.setItem('itemDetail', JSON.stringify(response?.data));
                if (response?.data?.photos?.length) {
                    setMainImage(response?.data?.photos[0]?.photo);
                }
                if (uid) {
                    sessionStorage.setItem('uuidcode', uid)
                }
            })
            .catch((error) => {
                setLoadng(false)
                navigate('/about', {
                    state: { error: true },
                });
            });
    }

    useEffect(() => {
        if (lostItem?.status === 'lost') {
            mixpanel.track('Lost Item', {
                itemName: lostItem?.name,
                itemId: lostItem?.item_id,
                status: lostItem?.status,
            });
        }
    }, [lostItem])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    getLostItems(position.coords.latitude, position.coords.longitude)
                },
                (error) => {
                    getLostItemsWithoutLoc()
                    setError(error.message);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            toast.error(error)
        }
    }, [])

    useEffect(() => {
        if (cookies?.uid) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }, []);

    const handleClose = () => {
        if (uid) {
            setCookie('uid', uid, { path: '/' })
            updateStore({ cookies })
            setOpen(false);
        }
    };
    const handleDeclineClose = () => {
        setOpen(false);
    };

    let images = [];

    if (lostItem?.thumbnail) {
        images.push({
            original: lostItem?.thumbnail,
            thumbnail: lostItem?.thumbnail,
            originalHeight: '350'
        });
    }

    if (lostItem?.photos) {
        images = [
            ...images,
            ...lostItem?.photos
                .filter(item => item.photo !== lostItem?.thumbnail)
                .map(item => ({
                    original: item.photo,
                    thumbnail: item.photo,
                    originalHeight: '350'
                }))
        ];
    }

    return (
        <>
            <div>
                <Navbar />
            </div>

            {(open) ? <>
                <CustomCookies handleClose={handleClose} handleDeclineClose={handleDeclineClose} />
            </> : <>
                <Breadcrumbs breadCrumbParent='Home' breadCrumbActive='Item Details' />
            </>}

            <div className='py-3 py-lg-5 p-3 p-md-0' style={{ backgroundColor: '#f2f4f7' }}>
                <div className='container finder_layout p-2 ' style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '8px' }}>

                    {(loading) ? <>
                        <div className='text-center w-100' style={{ minHeight: "300px", marginTop: "8rem" }}>
                            <BeatLoader />
                        </div>
                    </> : <>
                        <ItemBox data={lostItem} enableDownload={true} />
                    </>}
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
};

export default Finder;
