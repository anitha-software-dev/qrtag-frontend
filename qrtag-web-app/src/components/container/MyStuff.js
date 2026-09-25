import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar'
import Footer from '../common/Footer'
import Breadcrumbs from '../common/Breadcrumbs'
import TopNavbar from '../common/TopNavContent';
import {
    Typography, Button, Box, Grid, TextField, Drawer,
    Table, TableBody, ToggleButton, ToggleButtonGroup, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
    Tooltip,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import RemoveIcon from '@mui/icons-material/Remove'

import ViewIcon from '../../images/view-icon.png'
import Collapse from '../../images/burger-menu.png'
import CollapseActive from '../../images/burger-menu-active.png'
import Action from '../../images/grid-icon.png'
import ActionActive from '../../images/grid-active.png'
import AddIcon from '../../images/add-item.png'
import AddItemDrawer from '../common/AddItemDrawer';
import UnlockFeatureModal from '../common/UnlockFeatureModal'
import QRScanModal from '../common/QRScanModal'

import Axios from '../../config/axios'
import mixpanel from 'mixpanel-browser'
import { Store } from '../../StoreContext'
import FeedbackModal from '../common/FeedbackModal';
import { GetUserProfile } from '../../services/user';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BeatLoader } from 'react-spinners'
import { Add } from '@mui/icons-material'

const MyStuffNew = () => {

    const nav = useNavigate()
    const { user, loggedIn, messages } = Store();
    const { state } = useLocation();
    const [allData, setAllData] = useState([])
    const [isList, setIsList] = useState(true)
    const [itemTypes, setItemTypes] = useState([]);
    const [isEligible, setIsEligible] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [instructions, setInstructions] = useState(null);
    const [featureModal, setFeatureModal] = useState(false);
    const [feedback, setFeedback] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [isAppGuide, setIsAppGuide] = useState(state?.appGuide || false);
    const [applycoupon, setApplyCoupon] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [itemId, setItemId] = useState(null);

    const fetchMyStuff = async () => {
        setLoading(true)
        const { data } = await Axios.get('/looser/items/')
        setLoading(false)
        if (data) {
            setAllData(data)
        }
    }

    const fetchItemTypes = () => {
        Axios.get(`/common/item-type/`)
            .then((res) => {
                setItemTypes(res?.data);
            })
            .catch((err) => console.log(err));
    };

    const fetchUser = () => {
        GetUserProfile((response) => {
            if (response && response.success) {
                if (response?.data) {
                    setUserData(response?.data);
                }
            }
        });
    }
    
    const checkIsEligible = () => {
        setIsFetching(true)
        Axios.get(`/users/addItemEligibility/`)
            .then((res) => {
                setIsFetching(false)
                if (res?.data && res?.data?.status === true) {
                    setIsEligible(true)
                }
            })
            .catch((err) => {
                console.log(err)
                setIsFetching(false)
            });
    }

    useEffect(() => {
        fetchMyStuff()
        fetchItemTypes()
        fetchUser()
        checkIsEligible()
        mixpanel.track('My Stuff Page', {
            pageName: "My Stuff"
        });
    }, [])

    const handleAddItem = () => {
        if (isEligible === true) {
            setOpenModal(true)
        } else {
            setFeatureModal(true)
        }
    }

    useEffect(() => {
        if (itemId) {
            setOpenAddModal(true)
        }
    }, [itemId])

    useEffect(() => {
        if (user && user.is_tutorial_complete === true && user.is_flyer_activated === false && user.is_trial === false) {
            if (isMobile) {
                if (isAppGuide === false) {
                    setApplyCoupon(true);
                }
            } else {
                setApplyCoupon(true);
            }
        }
    }, [user]);

    useEffect(() => {
        if (messages) {
            const res = messages.filter((item) => item.key === 'add_item_instruction')
            if (res && res.length > 0) {
                setInstructions(res[0])
            }
        }
    }, [messages])

    return (
        <>
            <Navbar />

            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbActive='MyStuff' />

            <TopNavbar />

            <div className='section-background' style={{ minHeight: '100vh' }}>
                <div className='container py-5'>

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
                                My Stuff
                            </Typography>

                            <Box display="flex" alignItems="center" sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', lg: 'flex-end' }, gap: 2 }}>

                                <img
                                    onClick={() => setIsList(true)}
                                    style={{ marginRight: '10px', cursor: 'pointer' }}
                                    src={isList ? CollapseActive : Collapse}
                                    alt="list view"
                                    width={40}
                                />

                                <img
                                    onClick={() => setIsList(false)}
                                    style={{ marginRight: '10px', cursor: 'pointer' }}
                                    src={!isList ? ActionActive : Action}
                                    alt="grid view"
                                    width={40}
                                />

                                <Button
                                    sx={{
                                        backgroundColor: '#ef4444',
                                        color: '#fff',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        borderRadius: '6px',
                                        px: 2,
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        '&:hover': { backgroundColor: '#dc2626' }
                                    }}
                                    className="add-item-button"
                                    onClick={handleAddItem}
                                    disabled={isFetching}
                                >
                                    Add Item
                                    <img src={AddIcon} alt="add" width={25} />
                                </Button>

                            </Box>
                        </Box>

                        {(loading) ? <>
                            <div className='text-center w-100' style={{ minHeight: "200px", marginTop: "8rem" }}>
                                <BeatLoader />
                            </div>
                        </> : <>

                            {(allData && userData && allData.length === 0 && 'total_items_can_add' in userData && userData.total_items_can_add === 0) ? <>
                                <div className='item-box item-box-add' style={{ position: 'relative' }}>
                                    <div className='item_img_div_add text-center'>
                                        <Add onClick={handleAddItem} style={{ cursor: 'pointer' }} />
                                        <p style={{ whiteSpace: "pre-wrap" }}>{(instructions && instructions?.value) ? instructions?.value : 'Add Item'}</p>
                                    </div>
                                </div>
                            </> : <>

                                {(isList) ? <>

                                    <TableContainer component={Paper} elevation={2} sx={{ padding: '1%', marginTop: { xs: '5%', md: 0 } }}>
                                        <Table >
                                            <TableHead>
                                                <TableRow >
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Item Name</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Manufacturer</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px' }}>Status</TableCell>
                                                    <TableCell style={{ color: '#64748b', paddingTop: '1%', fontSize: '16px', textAlign: 'right' }}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody >
                                                {allData.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center" gap={2}>
                                                                <img src={item.thumbnail} alt="Img" width={45} />
                                                                <Typography fontWeight={400}>{item.name}</Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography fontSize={14}>{item.manufacturer}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.status === 'lost' && (
                                                                <Box
                                                                    px={1.5}
                                                                    py={0.5}
                                                                    bgcolor="#fee2e2"
                                                                    color="#dc2626"
                                                                    fontSize={12}
                                                                    fontWeight={500}
                                                                    borderRadius="12px"
                                                                    display="inline-block"
                                                                >
                                                                    Lost
                                                                </Box>
                                                            )}
                                                            {item.status === 'found' && (
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
                                                                    Found
                                                                </Box>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box style={{ textAlign: 'right' }}>
                                                                <Tooltip title="View Item" placement="top" arrow>
                                                                    <img src={ViewIcon} alt="view" style={{ cursor: 'pointer' }} width={35} onClick={() => nav(`/mystuff/item/${item?.id}`)} />
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                {(allData && userData && 'total_items_can_add' in userData && userData.total_items_can_add > 0) && <>
                                                    {[...Array(userData.total_items_can_add)].map((item) => (
                                                        <>
                                                            <TableRow>
                                                                <TableCell colSpan={4} style={{ color: '#b1b1b1' }}>
                                                                    <Add onClick={handleAddItem} style={{ cursor: 'pointer', border: '1px solid #adadad', borderRadius: '50%', fontSize: '2rem', marginRight: '5px', marginBottom: '2px' }} /> <span>Add Item</span>
                                                                </TableCell>
                                                            </TableRow>
                                                        </>
                                                    ))}
                                                </>}
                                            </TableBody>
                                        </Table>

                                        {(allData && userData && 'total_items_can_add' in userData && userData.total_items_can_add > 0) && <>

                                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                                <Box
                                                    className='item-box'
                                                    sx={{
                                                        backgroundColor: '#fff',
                                                        borderRadius: 3,
                                                        overflow: 'hidden',
                                                        padding: 3
                                                    }}
                                                >
                                                    <div className='item_img_div_add'>
                                                        <h5 style={{ color: '#adadad' }}>Note:</h5>
                                                        <p style={{ whiteSpace: "pre-wrap" }}>{(instructions && instructions?.value) ? instructions?.value : 'Add Item'}</p>
                                                    </div>
                                                </Box>
                                            </Grid>
                                        </>}

                                    </TableContainer>
                                </> : <>
                                    <div className='p-4'>
                                        <Grid container spacing={3}>
                                            {allData.map((item, index) => (
                                                <Grid item xs={12} sm={4} md={3} lg={3} key={index}>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: '#fff',
                                                            borderRadius: 3,
                                                            boxShadow: '0 0 0 1px #e2e8f0',
                                                            overflow: 'hidden',
                                                            transition: 'transform 0.2s',
                                                            '&:hover': { transform: 'scale(1.02)' },
                                                            cursor: 'pointer',
                                                            height: 370
                                                        }}
                                                        onClick={() => nav(`/mystuff/item/${item?.id}`)}
                                                    >
                                                        <img
                                                            src={item.thumbnail}
                                                            alt="product"
                                                            style={{ width: '100%', padding: '10px', height: 300 }}
                                                        />
                                                        <Box px={2} py={2}>
                                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                                <Box>
                                                                    <Typography fontWeight={600} fontSize={14}>{item.name}</Typography>
                                                                    <Typography fontSize={13} color="#64748B">{item.manufacturer}</Typography>
                                                                </Box>
                                                                {item.status && (
                                                                    <Box
                                                                        px={1.5}
                                                                        py={0.5}
                                                                        bgcolor={item.status === 'lost' ? '#fee2e2' : '#d1fae5'}
                                                                        color={item.status === 'lost' ? '#dc2626' : '#059669'}
                                                                        fontSize={12}
                                                                        fontWeight={500}
                                                                        borderRadius="12px"
                                                                        display="inline-block"
                                                                        height="fit-content"
                                                                        textTransform="capitalize"
                                                                    >
                                                                        {item.status}
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </Box>

                                                    </Box>
                                                </Grid>
                                            ))}

                                            {(allData && userData && 'total_items_can_add' in userData && userData.total_items_can_add > 0) && <>
                                                {[...Array(userData.total_items_can_add)].map((item) => (
                                                    <>
                                                        <Grid item xs={12} sm={4} md={3} lg={3}>
                                                            <Box
                                                                className='item-box item-box-add'
                                                                sx={{
                                                                    backgroundColor: '#fff',
                                                                    borderRadius: 3,
                                                                    boxShadow: '0 0 0 1px #e2e8f0',
                                                                    overflow: 'hidden',
                                                                    height: 370,
                                                                    marginTop: 0
                                                                }}
                                                            >
                                                                <div className='item_img_div_add text-center'>
                                                                    <Add onClick={handleAddItem} style={{ cursor: 'pointer' }} />
                                                                </div>
                                                            </Box>
                                                        </Grid>
                                                    </>
                                                ))}
                                            </>}
                                        </Grid>

                                        <div className='pt-4'>

                                            {(allData && userData && 'total_items_can_add' in userData && userData.total_items_can_add > 0) && <>

                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <Box
                                                        className='item-box'
                                                        sx={{
                                                            backgroundColor: '#fff',
                                                            borderRadius: 3,
                                                            overflow: 'hidden',
                                                            padding: 3
                                                        }}
                                                    >
                                                        <div className='item_img_div_add'>
                                                            <h5 style={{ color: '#adadad' }}>Note:</h5>
                                                            <p style={{ whiteSpace: "pre-wrap" }}>{(instructions && instructions?.value) ? instructions?.value : 'Add Item'}</p>
                                                        </div>
                                                    </Box>
                                                </Grid>
                                            </>}
                                        </div>
                                    </div>

                                </>}

                            </>}

                        </>}

                    </div>
                </div>
            </div >

            <Footer />

            {openAddModal && (
                <AddItemDrawer
                    open={openAddModal}
                    setOpen={setOpenAddModal}
                    itemTypes={itemTypes}
                    itemId={itemId}
                    getList={fetchMyStuff}
                    checkIsEligible={checkIsEligible}
                    fetchUser={fetchUser}
                />
            )}

            {featureModal && (
                <UnlockFeatureModal
                    open={featureModal}
                    setOpen={setFeatureModal}
                />
            )}

            {openModal && (
                <QRScanModal className="scanner"
                    setItemId={setItemId}
                    open={openModal}
                    setOpen={setOpenModal}
                />
            )}

            {feedback && (
                <FeedbackModal className="feedback"
                    open={feedback}
                    setOpen={setFeedback}
                />
            )}
        </>
    )
}

export default MyStuffNew
