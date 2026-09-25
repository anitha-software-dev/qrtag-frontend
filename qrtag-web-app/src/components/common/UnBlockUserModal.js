import * as React from 'react';
import Box from '@mui/material/Box';
import { Modal, Button, FormControl, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { ChatService } from '../../services/chat';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 480,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

export default function BasicModal({ open, setOpen, currentChannel, setIsUserBlocked }) {

    let [loading, setLoading] = React.useState();
    const [formState, setFormState] = React.useState({
        message: ''
    });

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        setOpen(false);
    };

    const closeModal = () => {
        setOpen(false);
    };

    async function submitForm() {

        setLoading(true);
        try {
            ChatService(`/message/channel-list/${currentChannel?.id}/unblock/`, { channel: currentChannel?.id }, (response) => {
                setLoading(false);
                if (response && response.success) {
                    setOpen(false)
                    setIsUserBlocked(false)
                    toast.success('You have unblocked this user successfully!');
                } else {
                    if (response && response.error && response.error.data && response.error.data.detail) {
                        toast.error(`${response && response.error && response.error.data.detail}`)
                    } else {
                        toast.error(`Failed to block the user!`)
                    }
                }
            });
        } catch (error) {
            setLoading(false);
        }
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
                        <div
                            style={{
                                position: 'absolute',
                                right: '-5%',
                                marginTop: '-5%',
                                border: '2px solid #000',
                                borderRadius: '50%',
                                padding: '3px',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onClick={closeModal}
                        >
                            <CloseIcon />
                        </div>

                    </div>
                    <div
                        className='text-center'
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>

                        <Typography id='modal-modal-description' sx={{ mt: 3, mb: 3 }}>
                            Are you sure you want to unblock this user?
                        </Typography>

                        <Button
                            variant="outlined"
                            sx={{
                                mt: 3,
                                display: 'block',
                                width: '100%',
                                height: '50px',
                                mx: 'auto',
                                borderColor: '#1e5af9',
                                borderRadius: '5px',
                                backgroundColor: '#1e5af9',
                                color: '#fff',
                                '&:hover': {
                                    borderColor: '#1e5af9',
                                    color: '#fff',
                                    backgroundColor: '#1e5af9',
                                },
                            }}
                            onClick={submitForm}
                        >
                            {!loading ? (
                                <div>Unblock</div>
                            ) : (
                                <PulseLoader size={15} color='#ffffff' />
                            )}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}