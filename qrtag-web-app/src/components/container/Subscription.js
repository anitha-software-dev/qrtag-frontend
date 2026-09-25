import Navbar from '../common/Navbar'
import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Grid, Typography, Box, Link } from '@mui/material';

import '../css/App.css'
import Bluetick from '../../images/blue-tick.png'
import Footer from '../common/Footer'
import Breadcrumbs from '../common/Breadcrumbs'
import { Store } from '../../StoreContext';
import Axios from '../../config/axios';
import HonoraryAccessModal from '../common/HonararyAccessModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReactReadMoreReadLess from "react-read-more-read-less";
import Config from '../../config/config.json';
import moment from 'moment-timezone'
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { AddAlert, InfoOutlined, RequestPage, Warning } from '@mui/icons-material';

const Subscription = () => {

    const { user, loggedIn, messages } = Store();
    const [plans, setPlans] = useState([])
    const [selected, setSelected] = useState('year')
    const [packages, setPackages] = useState([])
    const [access, setAccess] = useState(false)
    const [applied, setApplied] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [planId, setPlanId] = useState(null)
    const [hideButton, setHideButton] = useState(true)
    const [approved, setApproved] = useState(false)
    const [honoraryMessage, setHonoraryMessage] = useState(null)
    const [subscriptionsVisibility, setSubscriptionsVisibility] = useState(false)
    const [honoraryVisibility, setHonoraryVisibility] = useState(false)
    const [waitingPeriod, setWaitingPeriod] = useState(0);
    const [isAnnual, setIsAnnual] = useState(false);
    const [honoraryStatus, setHonoraryStatus] = useState(null);
    const [daysExpiryMonthly, setDaysExpiryMonthly] = useState(7);
    const [daysExpiryYearly, setDaysExpiryYearly] = useState(30);

    const PlanData = () => {
        setLoading(true)
        Axios.get('/payment/stripe-products/')
            .then(response => {
                setLoading(false)
                if (response?.data) {
                    setPackages(response.data);
                    // console.log('package:', response.data)
                }
            })
            .catch(error => {
                setLoading(false)
                console.error('Error fetching plan data:', error);
            });
    };

    useEffect(() => {
        PlanData();
    }, []);

    useEffect(() => {
        if (messages) {
            messages.forEach(item => {
                if (item.key === "subscriptions_visibility") {
                    setSubscriptionsVisibility(JSON.parse(item.value));
                } else if (item.key === "honorary_access_feature_toggle") {
                    setHonoraryVisibility(JSON.parse(item.value));
                } else if (item.key === "honorary_access_apply_message") {
                    setHonoraryMessage(item.value);
                } else if (item.key === "honorary_request_waiting_period") {
                    setWaitingPeriod(Number(item.value));
                } else if (item.key === "reminder_for_monthly_subscription") {
                    setDaysExpiryMonthly(Number(item.value));
                } else if (item.key === "reminder_for_yearly_subscription") {
                    setDaysExpiryYearly(Number(item.value));
                }
            });
        }
    }, [messages])

    useEffect(() => {
        const currentPlan = packages?.find(item => item.id === user?.plan_product_id);
        setIsAnnual(currentPlan?.metadata?.duration === 'yearly');
    }, [packages, user]);

    useEffect(() => {
        if (packages) {
            const selectedPlans = packages.filter((item) => item.prices.some(price => price.recurring?.interval === selected))
            setPlans(selectedPlans);
        }
    }, [packages, selected]);

    const localTimeZone = (dateTime) => {
        const utcDate = moment.utc(dateTime)
        const localTimezone = moment.tz.guess()
        const localDate = utcDate.tz(localTimezone)
        return localDate.format('YYYY-MM-DD h:mm A')
    }

    const handleHide = (date) => {
        const declinedDate = new Date(localTimeZone(date));
        const currentDate = new Date();

        const diffTime = currentDate - declinedDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const dayCount = waitingPeriod ? waitingPeriod : 30

        if (diffDays < dayCount) {
            setHideButton(true);
        } else {
            setHideButton(false);
        }
    }

    useEffect(() => {
        const accessRequest = user?.looser?.access_request;

        if (!accessRequest) {
            setHonoraryStatus(null);
            setHideButton(false);
        } else if (accessRequest === 'P') {
            setHonoraryStatus('PENDING');
        } else if (accessRequest === 'A') {
            setHonoraryStatus('APPROVED');
        } else if (accessRequest === 'D' && user.looser?.declined_at) {
            setHonoraryStatus('DECLINED');
            handleHide(user.looser.declined_at)
        } else if (accessRequest === 'R' && user.looser?.revoked_at) {
            setHonoraryStatus('REJECTED');
            handleHide(user.looser.revoked_at)
        }
    }, [user]);

    const handleSubscription = (item) => {

        if (item && item?.prices?.[0]?.id) {

            if (user && user.plan_product_id === item?.id) {
                return false
            }

            if (isAnnual && (item.metadata && item.metadata?.duration && item.metadata?.duration === 'monthly')) {
                return false
            }
            setSubmitting(true)
            setPlanId(item.id)
            Axios.post(`/payment/create-checkout-session/`, { price_id: item.prices[0]?.id })
                .then((res) => {
                    setSubmitting(false)
                    setPlanId(null)
                    if (res?.status === 200) {
                        if (res.data && res.data.checkout_url) {
                            window.location.href = res.data.checkout_url
                        }
                    } else {
                        console.error('Checkout Failed!');
                    }
                })
                .catch((err) => {
                    setSubmitting(false);
                    setPlanId(null)
                    console.log(err)
                    const message = err?.response?.data?.error || err?.message || "Something went wrong. Please try again.";
                    toast.error(message);
                });
        }
    }

    const isPlanEnabled = (planId) => {

        const currentPlan = packages.find(p => p.id === user?.plan_product_id);
        if (!currentPlan) return true;

        const targetPlan = packages.find(p => p.id === planId);
        if (!targetPlan) return false;

        if (currentPlan.id === targetPlan.id) return false;

        const currentPriceInfo = currentPlan.prices[0];
        const targetPriceInfo = targetPlan.prices[0];

        const currentInterval = currentPriceInfo.recurring.interval;
        const currentPrice = currentPriceInfo.unit_amount;

        const targetInterval = targetPriceInfo.recurring.interval;
        const targetPrice = targetPriceInfo.unit_amount;

        // Calculate expiry date based on plan start date and interval
        const planStartDate = new Date(user?.plan_start_date); // Make sure this exists

        let expiryDate = new Date(planStartDate);
        if (currentInterval === "month") {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else if (currentInterval === "year") {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        const DAYS_BEFORE_EXPIRY_TO_ENABLE = (currentInterval === "month") ? daysExpiryMonthly : daysExpiryYearly;

        // Calculate date when switching becomes allowed
        const enableDate = new Date(expiryDate);
        enableDate.setDate(enableDate.getDate() - DAYS_BEFORE_EXPIRY_TO_ENABLE);

        const now = new Date();
        if (now < enableDate) {
            return false; // Too early to change plan
        }

        // Plan logic based on upgrade/downgrade
        if (currentInterval === "year") {
            if (targetInterval === "month") return false;
            if (targetInterval === "year" && targetPrice < currentPrice) return false;
            return true;
        }

        if (currentInterval === "month") {
            if (targetPrice > currentPrice) return true;
            return false;
        }

        return true;
    };

    {/************ CURRENT ACTIVE VIEW *************/ }
    const CurrentActiveView = ({ type }) => {
        return (
            <>
                <Grid container display="flex" alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={12} sx={{ mx: { xs: '5%', sm: 0 } }}>
                        <Grid sx={{
                            display: 'flex',
                            flexDirection: { xs: "column", sm: "column" },
                            alignItems: 'center',
                            background: '#EFF4FB',
                            padding: '1.5rem 1.5rem',
                            borderRadius: '5px',
                            boxShadow: 1,
                        }} className='mt-4 mb-4'>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    alignItems: "center",
                                    justifyContent: { xs: "center", sm: "flex-start" },
                                    marginRight: '10px',
                                    marginBottom: { xs: "16px", sm: 0 }
                                }}
                            >
                                <CheckCircleIcon sx={{ color: "#8acd42", fontSize: 65 }} />
                            </Box>

                            {/***** SUBSCRIPTION ******/}
                            {(type && type === 'subscription') && <>
                                <Typography
                                    sx={{
                                        textAlign: { xs: 'center', sm: 'center' },
                                    }}
                                >
                                    <h5 style={{ color: '#1e5af9', fontWeight: 'bold', textTransform: "capitalize" }}>{user.subscription_plan} activated</h5>
                                    <p>Your subscription for the <span className='text-capitalize'>{user.subscription_plan}</span> plan is active.</p>
                                    {(user.plan_expires_at) && <p className='mb-0'>Expires at: <strong >{moment(user.plan_expires_at).format('LL')}</strong> </p>}

                                    {(user.cancellation_requested) && <>
                                        <Stack className='container' sx={{ width: '100%', mt: 3 }} spacing={2}>
                                            <Alert severity="error" icon={false}>
                                                <p className='mb-1' style={{ color: '#ea4736', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><InfoOutlined fontSize='small' />&nbsp;<strong>Cancellation Requested</strong> </p>
                                                <p>Your subscription remains active until {moment(user.plan_expires_at).format('LL')}, after which it will not renew automatically. You can continue to enjoy <span className='text-capitalize'>{user.subscription_plan}</span> features until then.</p>
                                            </Alert>
                                        </Stack>
                                    </>}
                                </Typography>
                            </>}

                            {/***** HONORARY ******/}
                            {(type && type === 'honorary') && <>
                                <Typography
                                    sx={{
                                        textAlign: { xs: 'center', sm: 'center' },
                                    }}
                                >
                                    <h5 style={{ color: '#1e5af9', fontWeight: 'bold' }}>Honorary Subscription Activated</h5>
                                </Typography>
                            </>}

                            {/***** TRIAL ******/}
                            {(type && type === 'trial') && <>
                                <Typography
                                    sx={{
                                        textAlign: { xs: 'center', sm: 'center' },
                                    }}
                                >
                                    <h5 style={{ color: '#1e5af9', fontWeight: 'bold' }}>Trial Activated</h5>
                                    <p> Your trial subscription is active for {user.free_trial_expires_in}.</p>
                                    {(user.free_trial_expires_at) && <p className='mb-0'>Expires at: <strong >{moment(user.free_trial_expires_at).format('LL')}</strong> </p>}
                                </Typography>
                            </>}

                        </Grid>
                    </Grid>
                </Grid>
            </>
        )
    }

    const DisabledHonoraryButton = () => {
        return (
            <>
                <Grid container className='mt-4'>
                    <Card sx={{ background: "#EFF4FB", boxShadow: 1, borderRadius: '10px', position: 'relative' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <Grid item xs={12} sm={12} display="flex" justifyContent={{ xs: 'center', sm: 'center', lg: 'center' }} className='mt-3 mb-3 text-center'>
                                {(honoraryMessage) &&
                                    <div style={{ whiteSpace: 'pre-line' }}>
                                        <ReactReadMoreReadLess
                                            charLimit={300}
                                            readMoreText={"Read more"}
                                            readLessText={"Read less"}
                                        >
                                            {honoraryMessage}
                                        </ReactReadMoreReadLess>
                                    </div>
                                }
                            </Grid>
                            <Grid item xs={12} sm={6} display="flex" justifyContent={{ xs: 'center', sm: 'center', lg: 'center' }} className='my-3'>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        width: { xs: 'auto', sm: 'auto' },
                                        height: { xs: '0', sm: '56px', lg: '42px' },
                                        borderColor: '#8acd42',
                                        borderRadius: '5px',
                                        backgroundColor: '#8acd42',
                                        color: '#fff !important',
                                        opacity: 0.5
                                    }}
                                    disabled={true}
                                >
                                    Applied For Honorary Access
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </>
        )
    }

    const ApplyHonoraryButton = () => {
        return (
            <>
                <Grid container className='mt-4'>
                    <Card sx={{ background: "#EFF4FB", boxShadow: 1, borderRadius: '10px', position: 'relative' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <Grid item xs={12} sm={12} display="flex" justifyContent={{ xs: 'center', sm: 'center', lg: 'center' }} className='mt-3 mb-3 text-center'>
                                {(honoraryMessage) &&
                                    <div style={{ whiteSpace: 'pre-line' }}>
                                        <ReactReadMoreReadLess
                                            charLimit={300}
                                            readMoreText={"Read more"}
                                            readLessText={"Read less"}
                                        >
                                            {honoraryMessage}
                                        </ReactReadMoreReadLess>
                                    </div>
                                }
                            </Grid>
                            <Grid item xs={12} sm={3} display="flex" justifyContent={{ xs: 'center', sm: 'center', lg: 'center' }} className='mb-3'>
                                <Button onClick={() => setAccess(true)}
                                    variant="outlined"
                                    sx={{
                                        width: { xs: 'auto', sm: '100%' },
                                        height: { xs: '0', sm: '56px', lg: '42px' },
                                        borderColor: '#8acd42',
                                        borderRadius: '5px',
                                        backgroundColor: '#8acd42',
                                        color: '#fff',
                                        '&:hover': {
                                            borderColor: '#8acd42',
                                            color: '#fff',
                                            backgroundColor: '#8acd42',
                                        },
                                    }}
                                    disabled={applied}
                                >
                                    Apply For Honorary Access
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbChild='Subscriptions' breadCrumbActive='Manage Subscriptions' />

            <div className='pt-2' style={{ background: '#e1e8fc', paddingBottom: '10%' }}>
                <div className='container my-5 pb-5'>
                    <Grid container display="flex" alignItems="center" justifyContent={{ xs: 'center', sm: 'space-between', lg: 'space-between' }}>
                        <Grid item xs={12} sm={6} display="flex" justifyContent={{ xs: 'center', sm: 'flex-start', lg: 'flex-start' }}>
                            <h3
                                style={{
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    color: '#1e5af9',
                                    marginBottom: '0px'
                                }}>
                                Subscriptions
                            </h3>
                        </Grid>
                    </Grid>

                    {(user?.subscription_plan) ? (
                        <CurrentActiveView type="subscription" />
                    ) : (honoraryVisibility && user?.is_honorary) ? (
                        <CurrentActiveView type="honorary" />
                    ) : (user?.is_trial) ? (
                        <>
                            <CurrentActiveView type="trial" />

                            {honoraryVisibility && (
                                honoraryStatus === 'PENDING' ? (
                                    <DisabledHonoraryButton />
                                ) : (
                                    !hideButton && <ApplyHonoraryButton />
                                )
                            )}
                        </>
                    ) : (honoraryVisibility && !user?.subscription_plan && !user?.is_honorary) ? (
                        honoraryStatus && honoraryStatus === 'PENDING' ? (
                            <DisabledHonoraryButton />
                        ) : (
                            !hideButton && <ApplyHonoraryButton />
                        )
                    ) : null}


                    {/******* SUBSCRIPTION LISTING *******/}
                    {(loading) ? <>
                        <div className='text-center w-100' style={{ minHeight: "200px", marginTop: "8rem" }}>
                            <BeatLoader />
                        </div>
                    </> : <>
                        {(subscriptionsVisibility === true) && <>

                            <Grid item xs={12} sm={12} md={12} sx={{
                                display: 'flex',
                                justifyContent: {
                                    xs: 'center', sm: 'center', md: 'center'
                                },
                                marginTop: {
                                    xs: 7, lg: 7
                                }
                            }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#d0d8ef',
                                        borderRadius: '999px',
                                        padding: '4px',
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: '220px',
                                        height: '42px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            left: selected === 'month' ? 4 : 'calc(100% - 112px)',
                                            width: '108px',
                                            height: '34px',
                                            backgroundColor: '#fff',
                                            borderRadius: '999px',
                                            transition: 'left 0.3s ease',
                                            zIndex: 1,
                                        }}
                                    />

                                    <Box
                                        onClick={() => setSelected('month')}
                                        sx={{
                                            width: '50%',
                                            textAlign: 'center',
                                            zIndex: 2,
                                            color: selected === 'month' ? '#0f172a' : '#334155',
                                            fontWeight: 500,
                                            fontSize: '14px',
                                        }}
                                    >
                                        Monthly
                                    </Box>

                                    <Box
                                        onClick={() => setSelected('year')}
                                        sx={{
                                            width: '50%',
                                            textAlign: 'center',
                                            zIndex: 2,
                                            color: selected === 'year' ? '#0f172a' : '#334155',
                                            fontWeight: 500,
                                            fontSize: '14px',
                                        }}
                                    >
                                        Annual
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }}>
                                {plans.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} sx={{ position: 'relative' }}>
                                        {(item.metadata && item.metadata?.plan_type && item.metadata?.plan_type === 'premium') && <>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: {
                                                        xs: '5px',
                                                        sm: '10px,',
                                                        md: '0'
                                                    },
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    backgroundColor: '#facc15',
                                                    color: '#000',
                                                    fontWeight: 600,
                                                    fontSize: '12px',
                                                    px: 2,
                                                    py: '4px',
                                                    borderRadius: '999px',
                                                    zIndex: 1,
                                                    boxShadow: 1,
                                                }}
                                            >
                                                Recommended
                                            </Box>
                                        </>}
                                        <Card sx={{ boxShadow: 3, borderRadius: '10px', position: 'relative', border: (item.metadata && item.metadata?.plan_type && item.metadata?.plan_type === 'premium') ? '2px solid #ff503d' : 'none' }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Grid container direction="column" alignItems="center">
                                                    <Grid item>
                                                        <h3 style={{ fontWeight: 400, paddingBottom: '15px', borderBottom: '1px solid #e8e9ee' }}>{item.name}</h3>
                                                        <div style={{ paddingBlock: '20px', borderBottom: '1px solid #e8e9ee' }}>
                                                            {(item.prices && item.prices.length > 0) &&
                                                                <h1 style={{ color: (item.metadata && item.metadata?.plan_type && item.metadata?.plan_type === 'premium') ? '#ff503d' : '#8acd42' }}>
                                                                    ${item.prices[0]?.unit_amount / 100}
                                                                    <span style={{ color: '#000', marginLeft: '4px', fontWeight: 400 }}>/</span>
                                                                    <span style={{ color: '#000', fontSize: '25px', marginLeft: '2px', textTransform: "capitalize" }}>{item.prices[0]?.recurring?.interval}</span>
                                                                </h1>
                                                            }
                                                        </div>
                                                        {(item.metadata && item.metadata?.content) &&
                                                            <div className='d-flex justify-content-center align-item-center py-2'>
                                                                <img src={Bluetick} style={{ marginRight: '10px', marginTop: '10px', width: '20px', height: '20px' }} />
                                                                <Typography variant="body1" sx={{ mt: 1, fontWeight: 400, color: '#1C2434' }}>
                                                                    {item.metadata?.content}
                                                                </Typography>
                                                            </div>
                                                        }
                                                    </Grid>

                                                    <Box sx={{ width: '100%', mt: 2 }}>
                                                        {(item.metadata && item.metadata?.plan_type && item.metadata?.plan_type === 'premium') ? <>
                                                            <Button
                                                                variant="contained"
                                                                fullWidth
                                                                sx={{
                                                                    height: '50px',
                                                                    borderRadius: '5px',
                                                                    backgroundColor: '#ff503d',
                                                                    color: '#fff',
                                                                    '&:hover': {
                                                                        backgroundColor: '#ff503d'
                                                                    }
                                                                }}
                                                                disabled={!isPlanEnabled(item.id)}
                                                                onClick={() => handleSubscription(item)}
                                                            >
                                                                {(submitting && planId && planId === item.id) ? <BeatLoader color='#fff' /> : (user && user.plan_product_id === item?.id) ? 'Subscribed' : 'Get started'}
                                                            </Button>
                                                        </> : <>
                                                            <Button
                                                                variant="contained"
                                                                fullWidth
                                                                sx={{
                                                                    height: '50px',
                                                                    borderRadius: '5px',
                                                                    backgroundColor: '#8acd42',
                                                                    color: '#fff',
                                                                    '&:hover': {
                                                                        backgroundColor: '#8acd42'
                                                                    }
                                                                }}
                                                                disabled={!isPlanEnabled(item.id)}
                                                                onClick={() => handleSubscription(item)}
                                                            >
                                                                {(submitting && planId && planId === item.id) ? <BeatLoader color='#fff' /> : (user && user.plan_product_id === item?.id) ? 'Subscribed' : 'Get started'}
                                                            </Button>
                                                        </>}
                                                    </Box>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}

                            </Grid>
                        </>}
                    </>}
                </div>
            </div>

            <div>
                <Footer />
            </div>

            {access && (
                <HonoraryAccessModal
                    open={access}
                    setOpen={setAccess}
                    setApplied={setApplied}
                    setHideButton={setHideButton}
                />
            )}
        </>
    )
}

export default Subscription