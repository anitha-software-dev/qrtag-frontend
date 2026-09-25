import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Modal, Button, FormControl, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AuthService } from '../../services/auth';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { useForm, Controller } from 'react-hook-form'
import { Store, UpdateStore } from '../../StoreContext';
import moment from 'moment-timezone'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 480,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

export default function PlanCancellationModal({ open, setOpen }) {

    const updateStore = UpdateStore();
    const { user, loggedIn, messages } = Store();
    const [loading, setLoading] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    const { getValues, control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
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

    useEffect(() => {
        if (open) {
            setIsCancelled(false)
        }
    }, [open])

    async function submitCancellation() {

        if (loading) {
            return;
        }
        setLoading(true);
        try {
            AuthService('/payment/subscription-cancel/', { cancellation_reason: getValues("message") }, (response) => {
                setLoading(false);
                if (response && response.success) {
                    setIsCancelled(true)

                    const temp = { ...user }
                    temp['cancellation_requested'] = true
                    localStorage.setItem('user', JSON.stringify(temp));
                    updateStore({ user: temp });
                    localStorage.setItem('userData', JSON.stringify(temp));

                    reset();
                } else {
                    if (response && response.error && response.error.data && response.error.data.detail) {
                        toast.error(`${response && response.error && response.error.data.detail}`)
                    } else {
                        toast.error(`Failed to submit cancellation request!`)
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

                        {(isCancelled) ? <>
                            <Typography sx={{ marginTop: { xs: "10%", sm: "5%" } }} id='modal-modal-title' style={{ fontWeight: 'bold' }} component='h6' variant='h6'>
                                Explore All Benefits
                            </Typography>
                            <Typography id='modal-modal-description' sx={{ mt: 2, mb: 3 }}>
                                Your cancellation request is confirmed, and your service will remain active until {(user.plan_expires_at) ? moment(user.plan_expires_at).format('LL') : 'the plan expires.'}
                            </Typography>

                            <Button
                                type="button"
                                variant="outlined"
                                onClick={closeModal}
                                sx={{
                                    mt: 3,
                                    display: 'block',
                                    height: '50px',
                                    mx: 'auto',
                                    borderColor: '#2563eb',
                                    borderRadius: '5px',
                                    backgroundColor: '#2563eb',
                                    color: '#fff',
                                }}

                            >
                                OKAY
                            </Button>
                        </> : <>
                            <Typography sx={{ marginTop: { xs: "10%", sm: "5%" } }} id='modal-modal-title' style={{ fontWeight: 'bold' }} component='h6' variant='h6'>
                                Cancel Subscription
                            </Typography>
                            <Typography id='modal-modal-description' style={{ fontWeight: 'bold' }} sx={{ mt: 2, mb: 3 }}>
                                Are you sure you want to cancel your subscription?
                            </Typography>
                            <form onSubmit={handleSubmit(submitCancellation)} className='w-100'>

                                <FormControl fullWidth className='mb-1'>
                                    <label for="Message" style={{ display: "inline-flex" }}>
                                        What is your reason for cancellation <span className='text-danger'>*</span>
                                    </label>
                                    <Controller
                                        name="message"
                                        control={control}
                                        rules={{
                                            required: 'Reason is required',
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
                                                placeholder="Enter Reason for Cancellation"
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
                                        borderColor: '#ea4736',
                                        borderRadius: '5px',
                                        backgroundColor: '#ea4736',
                                        color: '#fff',
                                        '&:hover': {
                                            borderColor: '#ef4444',
                                            color: '#fff',
                                            backgroundColor: '#ef4444',
                                        },
                                    }}

                                >
                                    {!loading ? (
                                        <div>SUBMIT</div>
                                    ) : (
                                        <PulseLoader size={15} color='#ffffff' />
                                    )}
                                </Button>
                            </form>
                        </>}
                    </div>
                </Box>
            </Modal>
        </div>
    );
}