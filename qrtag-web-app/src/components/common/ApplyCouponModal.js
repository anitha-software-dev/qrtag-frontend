import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { ApplyCouponCode } from '../../services/user';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { Store, UpdateStore } from '../../StoreContext';
import { GetUserProfile } from '../../services/user';
import { useForm, Controller } from 'react-hook-form'
import GiftBox from '../../images/gift-box-svgrepo-com.svg'
import { useEffect } from 'react'

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

    const { user, messages } = Store();
    const updateStore = UpdateStore();

    let [loading, setLoading] = React.useState(false);

    let [flyerMessage, setFlyerMessage] = React.useState(null);

    const { getValues, control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            couponCode: ''
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

    React.useEffect(() => {
        if (messages) {
            const res = messages.filter((item) => item.key === 'flyer_message')
            if (res && res.length > 0) {
                setFlyerMessage(res[0])
            }
        }
    }, [messages])

    const getProfile = () => {
        try {
            GetUserProfile((response) => {
                if (response && response.success) {
                    if (response?.data) {
                        const temp = { ...user }
                        temp['is_flyer_activated'] = true;
                        temp['subscription_plan'] = response?.data?.subscription_plan || null;
                        localStorage.setItem('user', JSON.stringify(response?.data));
                        updateStore({ user: temp });
                        localStorage.setItem('userData', JSON.stringify(response?.data));
                    }
                }
            });
        } catch (error) {
            console.log(false);
        }
    }

    const submitCouponCode = () => {
        if (loading) {
            return;
        }

        setLoading(true);
        try {
            ApplyCouponCode({ coupon: getValues("couponCode") }, (response) => {
                console.log('API response', response);
                setLoading(false);
                if (response && response.success) {
                    setOpen(false)
                    reset()
                    getProfile()
                    toast.success('Coupon code applied successfully!');
                } else {
                    if (response && response.error && response.error.data && response.error.data.detail) {
                        toast.error(`${response && response.error && response.error.data.detail}`)
                    } else if (response && response.error && response.error.data && response.error.data.message) {
                        toast.error(response.error.data.message)
                    } else {
                        toast.error(`Failed to apply coupon code!`)
                    }
                }
            });
        } catch (error) {
            setLoading(false);
        }

    }
    const isPopupHidden = () => {
        const cookies = document.cookie.split('; ')
        return cookies.some(cookie => cookie.startsWith('modalShown=true'))
    }
    const hidePopup = () => {
        const date = new Date()
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000)
        document.cookie = `modalShown=true; expires=${date.toUTCString()}; path=/`
        setOpen(false)
    }

    if (isPopupHidden() && !navigation) {
        setOpen(false)
        return null
    }

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
                <Box sx={style} className="modal-body">
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
                            Special Offer Just for You!
                        </Typography>
                        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                            {(flyerMessage && flyerMessage?.value) ? <>{flyerMessage?.value}</> : 'Please enter your coupon code to receive a ONE MONTH FREE subscription.'}
                        </Typography>
                        <form onSubmit={handleSubmit(submitCouponCode)} style={{ width: '100%' }}>
                            <label for="Message" className='mt-4' style={{ width: '100%', display: 'flex' }}>
                                Coupon Code <span className='text-danger'>*</span>
                            </label>

                            <Controller
                                name="couponCode"
                                control={control}

                                rules={{ required: 'Coupon code is required' }}
                                render={({ field }) => (
                                    <input
                                        className="LogIn_InputEmail"
                                        type="text"
                                        placeholder="Enter Coupon Code"
                                        style={{
                                            width: '100%',
                                            height: '50px',
                                            padding: '10px',
                                        }}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.couponCode && (
                                <p className='error-validation' style={{ textAlign: 'left' }} > {errors.couponCode.message}</p>
                            )}
                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{
                                    my: 2,
                                    display: 'block',
                                    width: '100%',
                                    height: '50px',
                                    mx: 'auto',
                                    borderColor: '#0a3f74',
                                    borderRadius: '30px',
                                    backgroundColor: '#0a3f74',
                                    color: '#fff',
                                    '&:hover': {
                                        borderColor: '#0a3f74',
                                        color: '#fff',
                                        backgroundColor: '#0a3f74',
                                    },
                                }}

                            >
                                {!loading ? (
                                    <div>Apply</div>
                                ) : (
                                    <PulseLoader size={15} color='#ffffff' />
                                )}
                            </Button>
                        </form>

                        <a href="javascript:void(0)" onClick={() => hidePopup()}>Please don’t show this again</a>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
