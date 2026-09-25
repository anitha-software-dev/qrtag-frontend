import * as React from 'react';
import Box from '@mui/material/Box';
import { Drawer, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QrReader from 'react-qr-scanner'
import { InfoOutlined, QrCodeScanner } from '@mui/icons-material';
import { determineDeviceType } from '../../utils/functions';
import QRCodeCheck from '../../images/qr-code-pay.png';
import Axios from '../../config/axios';
import { useNavigate } from 'react-router-dom'
import ChatModal from './locationPopup'
import { Store } from '../../StoreContext';
import { BeatLoader } from 'react-spinners';


const previewStyle = {
    width: '100%',
    marginTop: '1rem'
}

export default function BasicModal({ setItemId, open, setOpen }) {

    const { user, loggedIn } = Store();
    const [loading, setLoading] = React.useState(false);
    const [start, setStart] = React.useState(false);
    const [exist, setExist] = React.useState(false);
    const [scanned, setScanned] = React.useState(false);
    const [item, setItem] = React.useState(null);
    const [uuid, setUuid] = React.useState(null);

    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 767);

    const style = {
        p: isMobile ? 1 : 4
    }

    const nav = useNavigate()

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        setOpen(false);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleCheck = (uid) => {
        if (uid) {
            setLoading(true)
            Axios.post(`/looser/find-item/${uid}/`).then((response) => {
                setLoading(false)
                if (Object.values(response?.data || {}).length > 0) {
                    setExist(true)
                    setStart(false)
                    setItem(response?.data)
                } else if (Object.values(response?.data || {}).length === 0) {
                    setExist(false)
                    setStart(false)
                }
            })
        }
    }

    const handleScan = (data) => {
        if (data && data.text) {

            const res = data.text.split('/').pop()

            if (res) {
                setUuid(res)
                handleCheck(res)
                setScanned(true)
                return false
            }
        }
    }

    const handleError = (err) => {
        console.error(err)
        setOpen(false)
        setScanned(false)
        setExist(false)
    }

    const handleAdd = () => {
        setOpen(false)
        setItemId(uuid)
    }

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={closeModal}
                PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 3 } }}
            >
                <IconButton onClick={closeModal} sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: '#1e5af9' }}>
                    Add item
                </Typography>
                <Typography fontSize={13} color="#64748B" mb={3}>
                    Scan the digital QR code from your QRTag
                </Typography>
                <Box sx={style}>

                    <div
                        className='text-center'
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {(scanned) ? <>

                            {(loading) ? <>
                                <div style={{ marginTop: '2rem', marginBottom: '1rem' }}><BeatLoader /></div>
                            </> : <>

                                {(exist) ? <>

                                    <div style={{ marginTop: '2rem', marginBottom: '1rem', width: '90%' }}>

                                        <img style={{ width: '150px', marginBottom: '1rem' }} src={item && item?.thumbnail} />

                                        <div className='LostItem_DetailDiv mt-2'>
                                            {item && item?.name &&
                                                <p>
                                                    <b>Item Name:</b> {item?.name}
                                                </p>
                                            }
                                            {item && item?.manufacturer &&
                                                <p>
                                                    <b>Manufacturer: </b> {item?.manufacturer}
                                                </p>
                                            }
                                            {item && item.description &&
                                                <p>
                                                    <b>Description:</b> {item?.description}
                                                </p>
                                            }
                                        </div>

                                        {user && item && user.id !== item.user_id && (
                                            <div className='LostItem_ChatBtn'>
                                                <ChatModal data={item} btnText='Chat with owner' />
                                            </div>
                                        )}

                                    </div>

                                </> : <>

                                    <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>

                                        <img style={{ width: '150px' }} src={QRCodeCheck} />

                                        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                                            <b>Item not registered!</b>
                                        </p>

                                        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                                            Your scan is completed. <br /> Now let's gather additional information about the item.
                                        </p>

                                        <Button
                                            variant="outlined"
                                            sx={{
                                                mt: 3,
                                                display: 'block',
                                                width: '100%',
                                                height: '50px',
                                                mx: 'auto',
                                                borderColor: '#1e5af9',
                                                borderRadius: '30px',
                                                backgroundColor: '#1e5af9',
                                                color: '#fff',
                                                '&:hover': {
                                                    borderColor: '#1e5af9',
                                                    color: '#fff',
                                                    backgroundColor: '#1e5af9',
                                                },
                                            }}
                                            onClick={() => handleAdd()}
                                        >
                                            Add Item
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                mt: 3,
                                                display: 'block',
                                                width: '100%',
                                                height: '50px',
                                                mx: 'auto',
                                                borderColor: '#1e5af9',
                                                borderRadius: '30px',
                                                backgroundColor: '#fff',
                                                color: '#1e5af9',
                                                '&:hover': {
                                                    borderColor: '#1e5af9',
                                                    color: '#1e5af9',
                                                    backgroundColor: '#fff',
                                                }
                                            }}
                                            onClick={() => {
                                                setOpen(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>}
                            </>}
                        </> : <>
                            {(start) ? <>
                                {typeof navigator !== 'undefined' && navigator.mediaDevices ? (
                                    <QrReader
                                        delay={100}
                                        style={previewStyle}
                                        onError={handleError}
                                        onScan={handleScan}
                                        constraints={
                                            determineDeviceType === 'web'
                                                ? undefined
                                                : {
                                                    video: {
                                                        facingMode: { ideal: 'environment', fallback: 'user' }
                                                    }
                                                }
                                        }
                                    />
                                ) : (
                                    <div>Camera access is not supported!</div>
                                )}
                            </> : <>
                                <div style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                                    <QrCodeScanner sx={{ fontSize: 150 }} />

                                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                                        Align the QR code inside the frame while start scanning.
                                    </p>

                                    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '14px', color: '#a5a5a5' }}>
                                        <InfoOutlined /> Make sure to allow camera access!
                                    </p>

                                    <Button
                                        variant="outlined"
                                        className='scanner-button'
                                        sx={{
                                            mt: 3,
                                            display: 'block',
                                            width: '100%',
                                            height: '50px',
                                            mx: 'auto',
                                            borderColor: '#8acd42',
                                            borderRadius: '30px',
                                            backgroundColor: '#8acd42',
                                            color: '#fff',
                                            '&:hover': {
                                                borderColor: '#8acd42',
                                                color: '#fff',
                                                backgroundColor: '#8acd42',
                                            },
                                        }}
                                        onClick={() => setStart(true)}
                                    >
                                        Start Scan
                                    </Button>
                                </div>
                            </>}

                        </>}

                    </div>
                </Box>
            </Drawer>
        </div>
    );
}