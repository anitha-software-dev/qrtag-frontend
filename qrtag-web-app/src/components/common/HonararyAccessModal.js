import * as React from 'react';
import Box from '@mui/material/Box';
import { Drawer, IconButton, Button, FormControl, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber, validatePhoneNumberLength, parsePhoneNumberFromString } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import { GetStates } from '../../services/user';
import { Store as ContextStore, UpdateStore } from '../../StoreContext';
import { RequestHonoraryAccess } from '../../services/user';
import { useForm, Controller } from 'react-hook-form';

const formstyle = {
    padding: '3%',
    margin: '2% 0',
    background: '#ffffff',
    borderColor: '#818181',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '5px',
    outline: 'none',
    marginBottom: '.5rem'
}


export default function BasicModal({ open, setOpen, setApplied, setHideButton }) {

    const { user } = ContextStore();
    const updateStore = UpdateStore();
    let [loading, setLoading] = React.useState();
    let [states, setStates] = React.useState([]);

    const { handleSubmit, control, formState: { errors }, reset, getValues, setValue } = useForm()

    const getStateList = () => {
        try {
            GetStates((response) => {
                if (response && response.success) {
                    setStates(response?.data)
                } else {
                    setStates([])
                }
            });
        } catch (error) {
            console.log(false);
        }
    }

    React.useEffect(() => {
        getStateList()

        if (user) {
            setValue('name', user?.name || '');
            setValue('email', user?.email || '');
            setValue('phone_number', user?.phone_number ? parsePhoneNumberFromString(user?.phone_number, user?.country_code)?.formatInternational() || '' : '');

            setValue('state', user?.looser?.shipping_state || '');
            setValue('city', user?.looser?.shipping_city || '');
            setValue('address', user?.looser?.shipping_address || '');
            setValue('postal_code', user?.looser?.shipping_postal_code || '');
            setValue('apartment_or_suite', user?.looser?.shipping_apartment_or_suite || '');
        }
    }, [])

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        setOpen(false);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const submitForm = (data) => {

        const params = {
            name: data?.name,
            phone_number: data?.phone_number.replace(/\+/g, ''),
            address: data?.address,
            apartment_or_suite: data?.apartment_or_suite,
            city: data?.city,
            state: data?.state,
            postal_code: data?.postal_code,
            honorary_access_reason: data?.description,
            mos: data?.mos,
            rank_at_seperation: data?.rank_at_seperation,
            years_of_service: data?.years_of_service,
            branch_of_military: data?.branch_of_military
        }

        try {
            const phone = (data.phone_number.startsWith('+') ? data.phone_number : `+${data.phone_number}`)

            if (validatePhoneNumberLength(phone) === 'TOO_SHORT') {
                toast.error('Please enter valid phone number');
                return false
            }

            const parsedNumber = parsePhoneNumber(phone);
            if (parsedNumber) {
                params.phone_number = parsedNumber?.nationalNumber
                params.country_code = parsedNumber?.country || 'US'

                if (parsedNumber?.nationalNumber === "") {
                    toast.error('Please enter valid phone number');
                    return false
                }
            }
        } catch (e) {
            console.error(e);
        }

        setLoading(true);

        try {
            RequestHonoraryAccess(params, (response) => {
                setLoading(false);
                if (response && response.success) {
                    setOpen(false)
                    setApplied(true)
                    setHideButton(true)
                    const temp = { ...user }

                    temp['name'] = params?.name;
                    temp['phone_number'] = params?.phone_number
                    temp['country_code'] = params?.country_code
                    temp['looser']['shipping_state'] = params?.state
                    temp['looser']['shipping_city'] = params?.city
                    temp['looser']['shipping_postal_code'] = params?.postal_code
                    temp['looser']['shipping_address'] = params?.address
                    temp['looser']['shipping_apartment_or_suite'] = params?.apartment_or_suite
                    temp['looser']['access_request'] = "P"

                    localStorage.setItem('user', JSON.stringify(temp));
                    updateStore({ user: temp });
                    localStorage.setItem('userData', JSON.stringify(temp));

                    toast.success(response.data?.message || 'Your details have been successfully submitted. Please wait while your request is reviewed and approved.');
                } else {
                    if (response && response.error && response.error.data && response.error.data.detail) {
                        toast.error(`${response && response.error && response.error.data.detail}`)
                    } else if (response && response.error && response.error.data && response.error.data.message) {
                        toast.error(response.error.data.message)
                    } else {
                        toast.error(`Failed to request access!`)
                    }
                }
            });
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={handleClose}
                PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 5 } }}
            >
                <IconButton onClick={closeModal} sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: '#1e5af9' }}>
                    Honorary access grants you lifetime access to our premium features.
                </Typography>
                <Typography fontSize={13} color="#64748B" mb={3}>
                    Please complete the form below to enroll in the Honorary Access program.
                </Typography>

                <form onSubmit={handleSubmit(submitForm)}>
                    <div
                        className='text-center'
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>

                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mt-2'>
                                <label for="name" style={{ display: "inline-flex" }}>
                                    Name <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="name"
                                    rules={{ required: "Name is required" }}
                                    control={control}
                                    render={({ field }) => (
                                        <input style={{
                                            ...formstyle,
                                            borderColor: errors.address ? '#d32f2f' : '#818181',
                                        }} {...field} placeholder='Enter Name' />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mt-2'>
                                <label for="email" style={{ display: "inline-flex" }}>
                                    Email <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="email"
                                    rules={{ required: "Email is required" }}
                                    control={control}
                                    render={({ field }) => (
                                        <input style={{
                                            ...formstyle,
                                            borderColor: errors.address ? '#d32f2f' : '#818181',
                                        }} {...field} readOnly placeholder='Enter Email' />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mb-1 mt-2'>
                                <label for="phone_number" style={{ display: "inline-flex" }}>
                                    Phone Number <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="phone_number"
                                    control={control}
                                    rules={{
                                        required: "Phone number is required",
                                        validate: (value) =>
                                            value && value.length >= 10 ? true : "Invalid phone number"
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <PhoneInput
                                                international
                                                className='LogIn_InputEmail m-0'
                                                placeholder='Enter Phone Number'
                                                defaultCountry='US'
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mt-2'>
                                <label for="address" style={{ display: "inline-flex" }}>
                                    Street Address <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="address"
                                    rules={{ required: "Street Address is required" }}
                                    control={control}
                                    render={({ field }) => (
                                        <input style={{
                                            ...formstyle,
                                            borderColor: errors.address ? '#d32f2f' : '#818181',
                                        }} {...field} placeholder='Enter Street Address' />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mt-2'>
                                <label for="apartment_or_suite" style={{ display: "inline-flex", alignItems: 'center' }}>
                                    Apt, Suite, etc. <small>(optional)</small>
                                </label>
                                <Controller
                                    name="apartment_or_suite"
                                    control={control}
                                    render={({ field }) => (
                                        <input style={formstyle} {...field} placeholder='Enter Apt, Suite, etc.' />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mt-2'>
                                <label for="city" style={{ display: "inline-flex" }}>
                                    City <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="city"
                                    control={control}
                                    rules={{ required: "City is required" }}
                                    render={({ field }) => (
                                        <input style={{
                                            ...formstyle,
                                            borderColor: errors.city ? '#d32f2f' : '#818181',
                                        }} {...field} placeholder='Enter City' />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mt-2'>
                                <label for="state" style={{ display: "inline-flex" }}>
                                    State <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="state"
                                    control={control}
                                    rules={{ required: "State is required" }}
                                    render={({ field }) => (
                                        <select style={{
                                            ...formstyle,
                                            borderColor: errors.state ? '#d32f2f' : '#818181',
                                        }} {...field}>
                                            <option value="">Select</option>
                                            {states.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                        </select>
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mt-2'>
                                <label for="state" style={{ display: "inline-flex" }}>
                                    Zip Code <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="postal_code"
                                    control={control}
                                    rules={{ required: "Zip Code is required" }}
                                    render={({ field }) => (
                                        <input style={{
                                            ...formstyle,
                                            borderColor: errors.postal_code ? '#d32f2f' : '#818181',
                                        }} {...field} placeholder='Enter Zip Code' />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mb-1 mt-2'>
                                <label for="branch_of_military" style={{ display: "inline-flex" }}>
                                    What was your branch of the military you served in? <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="branch_of_military"
                                    control={control}
                                    rules={{ required: "Branch of the military is required" }}
                                    render={({ field }) => (
                                        <select style={{
                                            ...formstyle,
                                            borderColor: errors.state ? '#d32f2f' : '#818181',
                                        }} {...field}>
                                            <option value="">Select</option>
                                            <option value="Army">Army</option>
                                            <option value="Navy">Navy</option>
                                            <option value="Air Force">Air Force</option>
                                            <option value="Marines">Marines</option>
                                            <option value="Coast Guard">Coast Guard</option>
                                            <option value="Space Force">Space Force</option>
                                            <option value="National Guard">National Guard</option>
                                            <option value="Reserves">Reserves</option>
                                        </select>
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mb-1 mt-2'>
                                <label for="mos" style={{ display: "inline-flex" }}>
                                    What was you MOS? <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="mos"
                                    control={control}
                                    rules={{ required: "MOS is required" }}
                                    render={({ field }) => (
                                        <input style={{
                                            ...formstyle,
                                            borderColor: errors.description ? '#d32f2f' : '#818181',
                                        }} {...field} id="mos" name="mos" placeholder='Enter MOS' />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mb-1 mt-2'>
                                <label for="years_of_service" style={{ display: "inline-flex" }}>
                                    What were your years of service? <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="years_of_service"
                                    control={control}
                                    rules={{ required: "Service Year is required" }}
                                    render={({ field }) => (
                                        <input style={{
                                            ...formstyle,
                                            borderColor: errors.description ? '#d32f2f' : '#818181',
                                        }} {...field} id="years_of_service" name="years_of_service" placeholder='Enter Start Year - End Year' />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mb-1 mt-2'>
                                <label for="rank_at_seperation" style={{ display: "inline-flex" }}>
                                    What was your rank at the time of separation? <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="rank_at_seperation"
                                    control={control}
                                    rules={{ required: "Rank is required" }}
                                    render={({ field }) => (
                                        <input style={{
                                            ...formstyle,
                                            borderColor: errors.description ? '#d32f2f' : '#818181',
                                        }} {...field} id="rank_at_seperation" name="rank_at_seperation" placeholder='Enter Rank' />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: '100%' }}>
                            <FormControl fullWidth className='mb-1 mt-2'>
                                <label for="description" style={{ display: "inline-flex" }}>
                                    Why should I be granted honorary access? <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: "Description is required" }}
                                    render={({ field }) => (
                                        <textarea style={{
                                            ...formstyle,
                                            borderColor: errors.description ? '#d32f2f' : '#818181',
                                        }} {...field} id="description" name="description" rows="3" cols="29" placeholder='Enter Description' />
                                    )}
                                />
                            </FormControl>
                        </div>

                        <Button
                            variant="outlined"
                            type="submit"
                            sx={{
                                mt: 2,
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
                                    opacity: 0.8
                                },
                            }}

                        >
                            {!loading ? (
                                <div>Submit</div>
                            ) : (
                                <PulseLoader size={15} color='#ffffff' />
                            )}
                        </Button>
                    </div>
                </form>
            </Drawer>
        </div >
    );
}