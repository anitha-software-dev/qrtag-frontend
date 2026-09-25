import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Store } from '../../StoreContext';

import GiftBox from '../../images/gift-box-svgrepo-com.svg'

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

export default function BasicModal() {

    const { messages } = Store();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(true);
    const [headingContent, setHeadingContent] = React.useState(null);

    const handleClose = () => {
        navigate('/about', { state: null });
        setOpen(false);
    };

    const closeModal = () => {
        navigate('/about', { state: null });
        setOpen(false);
    };

    React.useEffect(() => {
        if (messages) {
            const res = messages.filter((item) => item.key === 'trial_message')
            if (res && res.length > 0) {
                setHeadingContent(res[0])
            }
        }
    }, [messages])

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box sx={style}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <div
                            style={{
                                position: 'absolute',
                                right: '-40px',
                                top: '-40px',
                                border: '1px solid #000',
                                cursor: 'pointer',
                                background: '#fff'
                            }}
                            onClick={closeModal}
                        >
                            <CloseIcon />
                        </div>
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
                    <div className='text-center' style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                        <Typography sx={{ marginTop: '5%' }} id='modal-modal-title' variant='h5' component='h2' style={{ fontWeight: 'bold' }} className='mt-5'>
                            Congratulations!
                        </Typography>
                        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                            {(headingContent && headingContent?.value) ? headingContent?.value : ""}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                mt: 4,
                                display: 'block',
                                mx: 'auto',
                                borderColor: '#003366',
                                borderRadius: '5px',
                                backgroundColor: '#1e5af9',
                                color: '#fff',
                                '&:hover': {
                                    borderColor: '#1e5af9',
                                    color: '#fff',
                                    backgroundColor: '#1e5af9',
                                },
                            }}
                        >
                            Okay
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
