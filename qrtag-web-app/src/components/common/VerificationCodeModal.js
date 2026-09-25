import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ReactCodeInput from 'react-code-input';
import PulseLoader from 'react-spinners/PulseLoader';

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
};

export default function BasicModal({ open, setOpen, onConfirm,  loading, handleVerifyCode }) {
    const [formState, setFormState] = useState({
        code: '',
    });
    const navigate = useNavigate();
    const handleClose = () => {
        navigate('/about', { state: null });
        setOpen(false);
    };

    const closeModal = () => {
        navigate('/about', { state: null });
        setOpen(false);
    };
   

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box
                    sx={style}
                    className="modal-body"
                    style={{
                        borderRadius: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ position: 'relative', width: '100%' }}>
                        <div
                            style={{
                                position: 'absolute',
                                right: '-5%',
                                marginTop: '-7%',
                            }}
                            onClick={closeModal}
                        >
                            <CloseIcon />
                        </div>
                    </div>

                    <Typography
                        sx={{ marginTop: '5%', marginBottom: '5%' }}
                        id='modal-modal-title'
                        variant='h6'
                        component='h2'
                    >
                        Verification Code 
                    </Typography>

                    <form
                        className='LogIn_FormDiv'
                        onSubmit={(e) => e.preventDefault()}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <p style={{ textAlign: 'center' }}>
                            To continue please enter the 6-digit code sent to your email
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                marginBottom: '15px',
                            }}
                        >
                            <ReactCodeInput
                                className='OtpInputBox'
                                fields={6}
                                value={formState.code}
                                onChange={(e) => setFormState((s) => ({ ...s, code: e }))}
                            />
                        </div>

                        <button
                            onClick={()=> handleVerifyCode(formState.code)}
                            className='LogIn_Btn'
                            style={{
                                border: 'none',
                                borderRadius: '5px',
                                backgroundColor: '#3f51b5',
                                color: '#fff',
                                padding: '10px 20px',
                                cursor: 'pointer',
                            }}
                        >
                            {!loading ? 'Submit' : <PulseLoader size={10} color='#fff' />}
                        </button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
