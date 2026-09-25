import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../StoreContext';

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

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        if (messages) {
            const res = messages.filter((item) => item.key === 'extend_trial_with_survey_message')
            if (res && res.length > 0) {
                setHeadingContent(res[0])
            }
        }
    }, [messages])

    const closeModal = () => {
        setOpen(false);
    };

    if (!open) return null

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                disableEscapeKeyDown
            >
                <Box sx={style}>
                    <div style={{ position: 'relative', width: '100%' }}>
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
                    </div>
                    <div className='text-center' style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                        <Typography id='modal-modal-description' sx={{ mt: 4 }}>
                            {(headingContent && headingContent?.value) ? headingContent?.value : "If you want to extend your trial for two months then please fill out this survey form"}
                        </Typography>
                        <div className='LogIn_BtnDivs mt-4'>
                            <button className='LogIn_Btns' onClick={() => nav('/submit-survey')}>
                                <div> Okay </div>
                            </button>
                        </div>

                        <a href="javascript:void(0)" onClick={closeModal}>I'll do it later</a>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
