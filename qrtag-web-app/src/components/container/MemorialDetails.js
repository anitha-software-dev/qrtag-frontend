import React, { useEffect, useState } from 'react'
import { Box, Tabs, Tab, Typography, Avatar, Paper, Button, Grid, Switch, FormControlLabel, Badge } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Navbar from '../common/Navbar'
import TopNavbar from '../common/TopNavContent'
import moment from 'moment-timezone'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import Axios from '../../config/axios'
import PublishModal from '../common/PublishModal'
import { toast } from 'react-toastify'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import EditTributeModal from '../common/EditTributeModal'
import ApprovalTributeModal from '../common/ApprovalTributeModal'
import DeleteTributeModal from '../common/DeleteTributeModal'
import Breadcrumbs from '../common/Breadcrumbs'
import Footer from '../common/Footer'

import CoverPhoto from '../../images/coverPhoto.png'
import Camera from '../../images/Camera.png'
import Bio from '../../images/Bio.png'
import BioActive from '../../images/Bio-active.png'
import Photos from '../../images/Photos.png'
import PhotosActive from '../../images/Photos-active.png'
import Tributes from '../../images/Tributes.png'
import { BeatLoader } from 'react-spinners'

const TabPanel = ({ children, value, index }) => {

    return (
        <div hidden={value !== index} role="tabpanel">
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    )
}

const MemorialDetails = () => {

    const { id } = useParams()
    const nav = useNavigate()
    const [tabIndex, setTabIndex] = useState(0)
    const [isFetching, setIsFetching] = useState(true)
    const [isApproving, setIsApproving] = useState(false)
    const [memorial, setMemorial] = useState(null)
    const [publish, setPublish] = useState(false);
    const [tributeStatus, setTributeStatus] = useState({})
    const [loading, setLoading] = useState(false)

    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedTributeId, setSelectedTributeId] = useState(null)
    const [openModal, setOpenModal] = useState(false)

    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const [confirmActionType, setConfirmActionType] = useState(null)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
    }

    const handleMenuOpen = (event, tributeId) => {
        setSelectedTributeId(tributeId)
        setAnchorEl(event.currentTarget)
    }
    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        if (memorial?.tributes?.length > 0) {
            const initialStatus = {}
            memorial.tributes.forEach(item => {
                initialStatus[item.id] = item.is_visible
            })
            setTributeStatus(initialStatus)
        }
    }, [memorial?.tributes])

    const handleAction = (actionType) => {

        handleMenuClose()

        if (actionType === 'edit') {
            setOpenModal(true)
        } else if (actionType === 'delete') {
            setDeleteModalOpen(true)
        } else if (['approve', 'reject'].includes(actionType)) {
            setConfirmActionType(actionType)
            setConfirmModalOpen(true)
        }
    }

    const handleApproveReject = (tributeId, actionType) => {

        const newStatus = actionType === 'approve'
        const params = {
            is_visible: newStatus
        }

        setIsApproving(true)

        Axios.patch(`/common/tributes/${tributeId}/`, params)
            .then((response) => {
                setIsApproving(false)
                if (response?.status === 200) {
                    toast.success(`Tribute ${newStatus ? 'approved' : 'rejected'} successfully!`)
                    setTributeStatus(prev => ({ ...prev, [tributeId]: newStatus }))
                    getMemorialData()
                    setConfirmModalOpen(false)

                } else {
                    toast.error('Failed to update tribute visibility!')
                }
            })
            .catch((error) => {
                setIsApproving(false)
                toast.error(error?.response?.data?.detail || 'Something went wrong while updating!')
            })
    }

    const getMemorialData = () => {
        setLoading(true)
        Axios.get(`/common/digital-memorial/${id}/`).then((res) => {
            setLoading(false)
            if (res && res?.data) {
                setMemorial(res?.data)
                // console.log("memorial:", res.data)
            }
        }).catch((err) => {
            console.log(err)
            setLoading(false)
            setMemorial(null)
        });
    }

    useEffect(() => {
        if (id) {
            getMemorialData()
        }
    }, [id])


    const handleDeleteTribute = async (tributeId) => {
        try {
            await Axios.delete(`/common/tributes/${tributeId}/`)

            setMemorial(prevData => ({
                ...prevData,
                tributes: prevData.tributes.filter(tribute => tribute.id !== tributeId),
            }))

            toast.success('Tribute deleted successfully!')
            setDeleteModalOpen(false)
        } catch (err) {
            console.error(err)
            toast.error('Failed to delete tribute')
        }
    }

    const tabContent = [
        {
            label: 'Bio',
            icon: <img src={tabIndex === 0 ? BioActive : Bio} alt="Bio" />,
            content: (
                <>
                    <Typography paragraph>
                        {(memorial && memorial.description) && <div style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: memorial.description }} />}
                    </Typography>
                </>
            )
        },
        {
            label: 'Photos',
            icon: <img src={tabIndex === 1 ? PhotosActive : Photos} alt="Photos" />,
            content: (
                <>
                    <Grid
                        container
                        justifyContent={{ xs: 'center', sm: 'flex-start' }}
                        rowSpacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                        {memorial?.photos?.length > 0 ? (
                            memorial.photos.map((item, i) => (
                                <Grid
                                    item
                                    xs={10} sm={4}
                                    key={i}
                                    sx={{
                                        mt: { xs: 2, sm: 0 },
                                        mx: { xs: 'auto', sm: 0 }
                                    }}
                                >
                                    <img
                                        src={item.photo}
                                        alt={`Photo ${i + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '350px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Grid container justifyContent="center" alignItems="center" mt={6} mb={6}>
                                    <Typography variant="body2">No Photos Found!</Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </>
            )
        },
        {
            label: 'Tributes',
            icon: <img src={Tributes} alt="Tributes" />,
            content: (
                <>
                    {(memorial && memorial?.tributes && memorial?.tributes.length > 0) ? (
                        <>
                            {memorial?.tributes.map((item) => (
                                <Box key={item.id} display="flex" flexDirection={{ xs: 'row', lg: 'row' }}
                                    alignItems={{ xs: 'stretch', lg: 'flex-start' }} gap={2} mb={5} position="relative">

                                    <Avatar sx={{ bgcolor: '#1E5AF9', width: 35, height: 35 }}>
                                        {item.name.charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Box
                                        className="tribute-text speech-bubble w-100"
                                        display="flex" flexDirection={{ xs: 'column', lg: 'row' }}
                                        alignItems={{ xs: 'flex-start', lg: 'flex-start' }}
                                        justifyContent={{ xs: 'center', lg: 'space-between' }}
                                        sx={{
                                            position: 'relative',
                                            flexGrow: 1,
                                            borderRight: '3px solid #d2d2d2',
                                            borderBottom: '3px solid #d2d2d2',
                                            borderTop: '1px solid #d2d2d2',
                                            borderRadius: '0px 12px 12px 12px',
                                            padding: '8px 16px',
                                            paddingBottom: 3,
                                            backgroundColor: '#f9f9f9',
                                            boxShadow: 1,
                                            marginLeft: 0,
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: '0px',
                                                left: '-10px',
                                                width: 0,
                                                height: 0,
                                                borderTop: '8px solid transparent',
                                                borderBottom: '8px solid transparent',
                                                borderRight: '8px solid #f9f9f9',
                                            }
                                        }}
                                    >
                                        <div className='mt-0 mt-md-0 me-0 me-md-5'>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '1rem', overflowWrap: 'anywhere' }}>
                                                {item.message}
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold" sx={{ marginTop: 1, fontSize: '1rem' }}>
                                                - {item.name}
                                            </Typography>
                                        </div>

                                        <Box display="flex" alignItems="end" justifyContent="space-between" flexDirection="column">
                                            <IconButton onClick={(e) => handleMenuOpen(e, item.id)} size="small">
                                                <MoreHorizIcon />
                                            </IconButton>
                                        
                                            <Badge color={(item.is_visible === true) ? 'success' : (item.is_visible === false) ? 'error' : 'warning'} className='me-4 mt-3' badgeContent={(item.is_visible === true)? 'Approved' : (item.is_visible === false) ? 'Rejected' : 'Pending'} />
                                        </Box>
                                    </Box>

                                    
                                </Box>
                            ))}
                        </>
                    ) : (
                        <>
                            <Box display="flex" alignItems="center" justifyContent="center" gap={2} mt={6} mb={6}>
                                <Typography variant="body2">No Tributes Found!</Typography>
                            </Box>
                        </>
                    )}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {['Edit', 'Delete', 'Approve', 'Reject'].map((label, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => handleAction(label.toLowerCase())}
                                sx={{ fontSize: '0.9rem' }}
                            >
                                {label}
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            )
        }
    ]

    return (
        <>
            <Navbar />

            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbChild='Memorial' breadCrumbActive='View Memorial' />

            <div className='section-background' style={{ minHeight: '100vh' }}>

                <div className='About_Container memorial_container container py-5'>

                    <div className='d-flex mb-md-3 mb-0 mt-3 pb-3 pb-md-0' onClick={() => nav(`/memorial`)} style={{ cursor: "pointer", fontWeight: 600 }}>
                        <ArrowBackIcon style={{ color: '#1e5af9' }} />
                        <p className='mb-0 mb-md-2' style={{ marginLeft: "5px", color: '#1e5af9' }}>Memorial</p>
                    </div>

                    <div className='' style={{ background: '#fff', borderRadius: '10px' }}>

                        {(loading) ? <>
                            <div className='text-center w-100' style={{ minHeight: "200px", paddingTop: "5rem" }}>
                                <BeatLoader />
                            </div>
                        </> : <>

                            {memorial ? (
                                <Grid container direction="column">
                                    <Grid
                                        item
                                        sx={{
                                            position: 'relative',
                                            height: { xs: '300px', sm: '450px' },
                                            backgroundImage: `url(${memorial?.cover_photo || ''})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'Top',
                                            borderRadius: 2,
                                            width: '100%',
                                            margin: 0,
                                        }}
                                    >
                                        <img src={CoverPhoto} alt='cover photo' style={{
                                            position: 'absolute',
                                            bottom: '20px',
                                            right: '30px'
                                        }} />
                                        <Grid
                                            container
                                            alignItems="center"
                                            justifyContent="space-between"
                                            direction={{ xs: 'column', md: 'row' }}
                                            sx={{
                                                position: 'absolute',
                                                bottom: { xs: -250, sm: -120 },
                                                left: { xs: 0, sm: 10 },
                                                px: 2,
                                                width: '100%',

                                            }}
                                        >
                                            <div className='d-md-block d-none'>
                                                <Grid item display="flex" alignItems="center" style={{ position: 'relative' }}>
                                                    {memorial?.profile_photo && (
                                                        <img
                                                            src={memorial.profile_photo}
                                                            style={{
                                                                width: '130px',
                                                                height: '140px',
                                                                border: '3px solid white',
                                                                borderRadius: '15px',
                                                                objectFit: 'cover',
                                                                position: 'absolute',
                                                                bottom: 40
                                                            }}
                                                        />
                                                    )}
                                                    <img
                                                        src={Camera}
                                                        alt="camera"
                                                        style={{ position: 'absolute', top: -5, left: '32%' }}
                                                    />
                                                    <div style={{ marginLeft: '170px', marginBottom: '40px' }}>
                                                        <Typography variant="h5" fontWeight="bold">
                                                            {memorial?.name}
                                                        </Typography>
                                                        <Typography variant="subtitle1">
                                                            {`${memorial?.from_date} - ${memorial?.to_date}`}
                                                        </Typography>
                                                    </div>
                                                </Grid>
                                            </div>

                                            <div className="d-block d-md-none">
                                                <div className="d-flex flex-column align-items-center justify-content-center">

                                                    {memorial?.profile_photo && (
                                                        <div style={{ position: 'relative' }}>
                                                            <img
                                                                src={memorial.profile_photo}
                                                                style={{
                                                                    width: '130px',
                                                                    height: '140px',
                                                                    border: '3px solid white',
                                                                    borderRadius: '15px',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                            <img
                                                                src={Camera}
                                                                alt="camera"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 70,
                                                                    left: '98%',
                                                                    transform: 'translateX(-50%)'
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                                        <Typography variant="h5" fontWeight="bold">
                                                            {memorial?.name}
                                                        </Typography>
                                                        <Typography variant="subtitle1">
                                                            {`${memorial?.from_date} - ${memorial?.to_date}`}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>

                                        </Grid>
                                    </Grid>

                                    <div style={{ height: window.innerWidth < 600 ? 260 : 100 }} />

                                    <Paper square elevation={0} sx={{ backgroundColor: 'transparent', width: '100%' }}>
                                        <Tabs
                                            value={tabIndex}
                                            onChange={handleTabChange}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            sx={{ '& .MuiTabs-indicator': { backgroundColor: 'transparent' } }}
                                        >
                                            {tabContent.map((tab, index) => (
                                                <Tab
                                                    key={index}
                                                    icon={tab.icon}
                                                    label={tab.label}
                                                    iconPosition="start"
                                                    disableRipple
                                                    sx={{
                                                        mx: { xs: 1, sm: 1.3 },
                                                        minHeight: 48,
                                                        px: 1.5,
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                        '&.Mui-selected': { color: '#EA4736' },
                                                        '&:hover': { backgroundColor: 'transparent' },
                                                    }}
                                                />
                                            ))}
                                        </Tabs>
                                    </Paper>

                                    <Grid item>
                                        <Box style={{ textAlign: 'justify' }} sx={{ padding: { xs: 2, sm: 3, md: 3.7 } }}>
                                            <Box
                                                style={{
                                                    border: '1px solid #E2E8F0',
                                                    borderRadius: '10px'
                                                }}
                                                sx={{ padding: { xs: 2, sm: 3, md: 3.7 } }}
                                            >
                                                {tabContent[tabIndex]?.content}
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            ) : (
                                !isFetching && memorial === null && (
                                    <Grid container direction="column">
                                        <Grid item>
                                            <div style={{ textAlign: 'center', paddingTop: '80px', color: 'gray' }}>
                                                No Memorial Found!
                                            </div>
                                        </Grid>
                                    </Grid>
                                )
                            )}
                        </>}
                    </div>

                </div>
            </div>

            <Footer />

            {publish && memorial && (
                <PublishModal
                    open={publish}
                    setOpen={setPublish}
                    itemId={memorial?.id}
                    getList={getMemorialData}
                />
            )}

            {openModal && memorial && (
                <EditTributeModal
                    open={openModal}
                    setOpen={setOpenModal}
                    itemId={selectedTributeId}
                    getList={getMemorialData}
                    memorial={memorial}
                />
            )}

            {deleteModalOpen && (
                <DeleteTributeModal
                    open={deleteModalOpen}
                    setOpen={setDeleteModalOpen}
                    itemId={selectedTributeId}
                    onDelete={handleDeleteTribute}

                />
            )}

            {confirmModalOpen && (
                <>
                    <ApprovalTributeModal
                        open={confirmModalOpen}
                        setOpen={setConfirmModalOpen}
                        itemId={selectedTributeId}
                        actionType={confirmActionType}
                        onConfirm={handleApproveReject}
                        isApproving={isApproving}
                    />
                </>
            )}
        </>
    )
}

export default MemorialDetails
