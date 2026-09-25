import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Modal, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { Store, UpdateStore } from '../../StoreContext';
import { useNavigate } from 'react-router-dom';
import Axios from '../../config/axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckCircleOutline, LockRounded } from '@mui/icons-material';

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

export default function ConfirmCheckoutModal({ open, setOpen }) {

    const nav = useNavigate();
    const updateStore = UpdateStore();
    const { user, cartItems } = Store();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (open) {
            setClientSecret(null);
            setLoading(false);
            setPaymentSuccess(false);
        }
    }, [open]);

    const stripe = useStripe();
    const elements = useElements();

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') return;
        setOpen(false);
        setClientSecret(null);
        setPaymentSuccess(false);
    };

    const closeModal = () => {
        setOpen(false);
        setClientSecret(null);
        setPaymentSuccess(false);
    };

    async function handleCheckout() {
        if (loading) return;
        setLoading(true);

        try {
            const params = (cartItems || []).map(item => ({
                item_id: item.id,
                quantity: item.quantity
            }));

            const response = await Axios.post('/payment/store-checkout/', params);
            const secret = response?.data?.client_secret;

            if (secret) {
                setClientSecret(secret);
            } else {
                toast.error('Checkout failed!');
            }
        } catch (err) {
            console.log(err)
            const message = err?.response?.data?.error || err?.message || "Error during checkout!";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    async function handleStripePayment() {
        if (!stripe || !elements || loading) return;
        setLoading(true);

        try {
            const cardElement = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }
            });

            if (error) {
                toast.error(error.message || 'Payment failed!');
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                updateStore({ cartItems: [] });
                setPaymentSuccess(true);
                setClientSecret(null);
            } else {
                toast.error('Payment not completed!');
            }
        } catch (err) {
            console.log(err)
            const message = err?.response?.data?.error || err?.message || "Error during payment!";
            toast.error(message);
        } finally {
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
                            onClick={() => {
                                setPaymentSuccess(false);
                                closeModal();
                            }}
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
                        {paymentSuccess ? (
                            <Box sx={{ py: 3 }}>
                                <CheckCircleOutline sx={{ color: "#8acd42", fontSize: 65 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8acd42', mb: 2, mt: 2 }}>
                                    Payment Successful!
                                </Typography>
                                <Typography sx={{ mb: 2 }}>
                                    Thank you for your purchase!
                                </Typography>
                                <Typography sx={{ mb: 3 }}>
                                    We're getting your order ready to be shipped. You will receive a confirmation email shortly.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{
                                        display: 'block',
                                        height: '50px',
                                        mx: 'auto',
                                        borderColor: '#2563eb',
                                        borderRadius: '5px',
                                        backgroundColor: '#2563eb',
                                        color: '#fff',
                                        '&:hover': { backgroundColor: '#1d4ed8', color: '#fff' }
                                    }}
                                    onClick={() => {
                                        setPaymentSuccess(false);
                                        closeModal();
                                    }}
                                >
                                    Close
                                </Button>
                            </Box>
                        ) : (
                            <>
                                {!clientSecret ? (
                                    <>
                                        <Typography sx={{ marginTop: { xs: "10%", sm: "5%" } }} id='modal-modal-title' style={{ fontWeight: 'bold' }} component='h6' variant='h6'>
                                            Confirm Shipping Address
                                        </Typography>
                                        <Typography id='modal-modal-description' sx={{ mt: 2, mb: 3 }}>
                                            Please confirm that the following shipping address is correct before proceeding with your payment:
                                        </Typography>
                                        <Box sx={{
                                            backgroundColor: '#EFF4FB',
                                            padding: 2
                                        }}>
                                            {(user?.looser?.shipping_address && user?.looser?.shipping_address !== '') ? (
                                                <>
                                                    <p className='mb-1' style={{ fontSize: '14px' }}><strong>{user?.name}</strong></p>
                                                    <p className='mb-1' style={{ fontSize: '14px' }}>{user?.looser?.shipping_address}, {user?.looser?.shipping_apartment_or_suite}</p>
                                                    <p className='mb-1' style={{ fontSize: '14px' }}>{user?.looser?.shipping_city}, {user?.looser?.shipping_state} - {user?.looser?.shipping_postal_code}</p>
                                                </>
                                            ) : (
                                                <p style={{ mt: 2, fontStyle: 'italic', fontSize: 13 }}>Shipping address is not available!</p>
                                            )}
                                        </Box>
                                        <Box sx={{ mt: 3, fontStyle: 'italic', fontSize: 13 }}>
                                            <p className='mb-1'>If this address is correct, click <strong>Confirm</strong> to proceed to payment.</p>
                                            <p>Otherwise, click <strong>Cancel</strong> to update the shipping information.</p>
                                        </Box>
                                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} gap={1}>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                onClick={() => nav('/editprofile')}
                                                sx={{
                                                    mt: 3,
                                                    display: 'block',
                                                    height: '50px',
                                                    mx: 'auto',
                                                    borderColor: '#2563eb',
                                                    borderRadius: '5px',
                                                    backgroundColor: '#FFF',
                                                    color: '#2563eb',
                                                }}
                                            >
                                                Edit Address
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                onClick={handleCheckout}
                                                sx={{
                                                    mt: 3,
                                                    display: 'block',
                                                    height: '50px',
                                                    mx: 'auto',
                                                    borderColor: '#2563eb',
                                                    borderRadius: '5px',
                                                    backgroundColor: '#2563eb',
                                                    color: '#fff',
                                                    '&:hover': { backgroundColor: '#1d4ed8', color: '#fff' }
                                                }}
                                                disabled={!user?.looser?.shipping_address || loading}
                                            >
                                                {loading ? 'Processing...' : 'Confirm'}
                                            </Button>
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                        <Typography sx={{ marginTop: { xs: "10%", sm: "5%" } }} id='modal-modal-title' style={{ fontWeight: 'bold' }} component='h6' variant='h6'>
                                            Complete Your Payment
                                        </Typography>
                                        <p>
                                            Please enter your card details to complete the payment.
                                        </p>
                                        <Box sx={{
                                            mt: 2,
                                            mb: 2,
                                            width: '100%',
                                            backgroundColor: '#F5F7FA',
                                            borderRadius: '8px',
                                            padding: 2,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                                        }}>
                                            <CardElement options={{
                                                hidePostalCode: true,
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#32325d',
                                                        '::placeholder': { color: '#a0aec0' },
                                                        fontFamily: 'inherit'
                                                    },
                                                    invalid: { color: '#fa755a' }
                                                }
                                            }} />
                                        </Box>
                                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }} gap={1}>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                onClick={handleStripePayment}
                                                sx={{
                                                    mt: 3,
                                                    height: '50px',
                                                    width: '100%',
                                                    borderColor: '#2563eb',
                                                    borderRadius: '5px',
                                                    backgroundColor: '#2563eb',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                    '&:hover': { backgroundColor: '#1d4ed8', color: '#fff' }
                                                }}
                                                disabled={loading}
                                            >
                                                {loading ? 'Paying...' : `Pay $${cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`}
                                            </Button>
                                        </Box>

                                        <Box sx={{ mt: 2, fontStyle: 'italic', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <LockRounded fontSize='13' />&nbsp;<p className='mb-0'>Secured by Stripe</p>
                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
