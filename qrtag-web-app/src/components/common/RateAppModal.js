import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../StoreContext';
import GiftBox from '../../images/gift-box-svgrepo-com.svg'
import { determineDeviceType } from '../../utils/functions';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

export default function BasicModal({ open, setOpen, navigation = false }) {

    const { messages } = Store();
    const nav = useNavigate();
    const [headingContent, setHeadingContent] = useState(null);


    const handleRateApp = () => {
        const deviceType = determineDeviceType()

        const deviceRedirects = {
            iOS: () => window.location.href = "https://apps.apple.com/app/id6444082603",
            Android: () => window.location.href = "https://play.google.com/store/apps/details?id=com.withered_feather_36062",
            web: () => window.open("https://play.google.com/store/apps/details?id=com.withered_feather_36062", "_blank")
        }

        deviceRedirects[deviceType]()
    }

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        setOpen(false);
    };


    useEffect(() => {
        if (messages) {
            const res = messages.filter((item) => item.key === 'rate_app_message')
            if (res && res.length > 0) {
                setHeadingContent(res[0])
            }
        }
    }, [messages])

    const closeModal = () => {
        setOpen(false);
    };

    if (!open) return null

    const handleGoBack = () => {
        closeModal()
        nav("/mystuff")
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                disableEscapeKeyDown
            >
                <Box sx={style} className="modal-body">
                    <div style={{ position: 'relative', width: '100%' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                           
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '-85px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '100px',
                                    height: '100px',
                                    backgroundColor: '#fff',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <img
                                    src={GiftBox}
                                    alt="Gift Box"
                                    style={{
                                        width: '70px',
                                        height: '70px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='text-center' style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Typography sx={{ marginTop: '5%' }} id='modal-modal-title' variant='h5' component='h2' style={{ fontWeight: 'bold' }} className='mt-5'>
                            Congratulations!
                        </Typography>

                        <Typography id='modal-modal-description' sx={{ mt: 4 }}>
                            {(headingContent && headingContent?.value) ? headingContent?.value : "You have unlocked the two months subscription. Would you mind to rate the application on the Store"}
                        </Typography>
                        <div className='LogIn_BtnDivs mt-4'>
                            <button className='LogIn_Btns' onClick={handleRateApp}>
                                <div> Rate app </div>
                            </button>
                        </div>

                        <a href="javascript:void(0)" onClick={handleGoBack}>Go Back</a>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
