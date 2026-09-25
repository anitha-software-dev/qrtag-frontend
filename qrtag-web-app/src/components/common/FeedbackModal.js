import * as React from 'react';
import Box from '@mui/material/Box';
import { Modal, Button, FormControl, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { AuthService } from '../../services/auth';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { useForm, Controller } from 'react-hook-form'

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

export default function BasicModal({ open, setOpen }) {

    let [loading, setLoading] = React.useState();

    const { getValues, control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            subject: '',
            message: ''
        },
    })
    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        setOpen(false);
    };

    const closeModal = () => {
        setOpen(false);
    };

    async function submitFeedback() {

        if (loading) {
            return;
        }
        setLoading(true);
        try {
            AuthService('/users/feedback/', { subject: getValues("subject"), message: getValues("message") }, (response) => {
                setLoading(false);
                if (response && response.success) {
                    setOpen(false)
                    toast.success('Feedback submitted successfully!');
                    reset();
                } else {
                    if (response && response.error && response.error.data && response.error.data.detail) {
                        toast.error(`${response && response.error && response.error.data.detail}`)
                    } else {
                        toast.error(`Failed to submit feedback!`)
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
                <Box sx={style} className="mui-body">
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

                        <Typography sx={{ marginTop: { xs: "10%", sm: "5%" } }} id='modal-modal-title' style={{ fontWeight: 'bold' }} component='h6' variant='h6'>
                            We want to hear from you
                        </Typography>
                        <Typography id='modal-modal-description' sx={{ mt: 2, mb: 3 }}>
                            Send us a message through the form below for your comments or suggestions.
                        </Typography>
                        <form onSubmit={handleSubmit(submitFeedback)}>

                            <FormControl fullWidth className='mb-1'>
                                <label for="Subject" style={{ display: "inline-flex" }}>
                                    Subject <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="subject"
                                    control={control}
                                    rules={{
                                        required: 'Subject is required',
                                    }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className="LogIn_InputEmail mb-2"
                                            type="text"
                                            id="subject"
                                            placeholder="Enter Subject"
                                            style={{
                                                width: '100%',
                                                height: '50px',
                                                padding: '10px',
                                            }}
                                        />
                                    )}
                                />
                                {errors.subject && (
                                    <p className='error-validation' style={{ textAlign: 'left' }} >
                                        {errors.subject.message}
                                    </p>
                                )}
                            </FormControl>

                            <FormControl fullWidth className='mb-1'>
                                <label for="Message" style={{ display: "inline-flex" }}>
                                    Message <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="message"
                                    control={control}
                                    rules={{
                                        required: 'Message is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Message must be at least 10 characters long',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="LogIn_InputEmail"
                                            id="message"
                                            rows="4"
                                            placeholder="Enter Message"
                                            style={{
                                                width: '100%',
                                                padding: '3% 3%',
                                            }}
                                        />
                                    )}
                                />
                                {errors.message && (
                                    <p className='error-validation' style={{ textAlign: 'left' }} >
                                        {errors.message.message}
                                    </p>
                                )}
                            </FormControl>

                            <Button
                                type="submit"
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

                            >
                                {!loading ? (
                                    <div>Send Message</div>
                                ) : (
                                    <PulseLoader size={15} color='#ffffff' />
                                )}
                            </Button>
                        </form>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}