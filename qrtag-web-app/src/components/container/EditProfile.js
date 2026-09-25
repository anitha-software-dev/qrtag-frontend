import * as React from 'react';
import Navbar from '../common/Navbar';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Container, Button, Grid, FormControl, Typography, Link, Box, Avatar } from '@mui/material';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { GetStates } from '../../services/user';
import UploadIcon from '../../images/upload-icon.png'
import { Store as ContextStore, UpdateStore } from '../../StoreContext';
import { UpdateProfile } from '../../services/user';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber, validatePhoneNumberLength, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import TopNavbar from '../common/TopNavContent';
import { useForm, Controller } from 'react-hook-form';
import Footer from '../common/Footer'
import Breadcrumbs from '../common/Breadcrumbs'

const formstyle = {

    height: '50px',
    backgroundColor: '#eff4fb',
    border: '1px solid #cbd5e1',
    padding: '10px',
    borderRadius: '6px',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    color: '#0f172a',
}

const EditProfile = () => {

    const { loggedIn, user, channels, accessToken } = ContextStore();
    const updateStore = UpdateStore();

    const [selectedImage, setSelectedImage] = React.useState(null);
    const [profileImage, setProfileImage] = React.useState(null);
    const [deleteRequested, setDeleteRequested] = React.useState(false);
    const [isSame, setIsSame] = React.useState(true);
    const fileInputRef = React.useRef(null);
    let [loading, setLoading] = React.useState(false);
    let [saving, setSaving] = React.useState(false);
    let [states, setStates] = React.useState([]);
    let [email, setEmail] = React.useState(null);

    const { handleSubmit, control, formState: { errors }, reset, getValues, setValue } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone_number: '',
            state: '',
            city: '',
            address: '',
            postal_code: '',
            apartment_or_suite: '',
            shipping_address: '',
            shipping_city: '',
            shipping_state: '',
            shipping_postal_code: '',
            shipping_apartment_or_suite: ''
        },
    })

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
            setValue('phone_number', user?.phone_number ? parsePhoneNumberFromString(user?.phone_number, user?.country_code)?.formatInternational() || '' : '');
            setValue('state', user?.looser?.state_code || '');
            setValue('city', user?.looser?.city || '');
            setValue('address', user?.looser?.address || '');
            setValue('postal_code', user?.looser?.postal_code || '');
            setValue('apartment_or_suite', user?.looser?.apartment_or_suite || '');

            setIsSame(user?.looser?.is_same_address)
            setValue('shipping_state', user?.looser?.shipping_state || '');
            setValue('shipping_city', user?.looser?.shipping_city || '');
            setValue('shipping_address', user?.looser?.shipping_address || '');
            setValue('shipping_postal_code', user?.looser?.shipping_postal_code || '');
            setValue('shipping_apartment_or_suite', user?.looser?.shipping_apartment_or_suite || '');

            setEmail(user?.email);
            setProfileImage(user?.looser?.profile_picture);
        }
    }, [user, setValue])

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);  // Convert image to Base64
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleDeleteImage = () => {
        setSelectedImage(null)
        setProfileImage(null)

        setDeleteRequested(true)
    }

    function formatKey(key) {
        return key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    async function submitForm() {

        if (loading) {
            return;
        }

        try {
            const params = {
                'name': getValues('name'),
                'phone_number': getValues('phone_number').replace(/\+/g, ''),
                'shipping_state': getValues('shipping_state'),
                'shipping_city': getValues('shipping_city'),
                'shipping_address': getValues('shipping_address'),
                'shipping_postal_code': getValues('shipping_postal_code'),
                'is_same_address': isSame
            }

            if (getValues('shipping_apartment_or_suite') && getValues('shipping_apartment_or_suite') !== '') {
                params.shipping_apartment_or_suite = getValues('shipping_apartment_or_suite')
            }

            if (isSame) {
                params.address = getValues('shipping_address')
                params.city = getValues('shipping_city')
                params.state = getValues('shipping_state')
                params.postal_code = getValues('shipping_postal_code')

                if (getValues('shipping_apartment_or_suite') && getValues('shipping_apartment_or_suite') !== '') {
                    params.apartment_or_suite = getValues('shipping_apartment_or_suite')
                }
            } else {
                params.address = getValues('address')
                params.city = getValues('city')
                params.state = getValues('state')
                params.postal_code = getValues('postal_code')

                if (getValues('apartment_or_suite') && getValues('apartment_or_suite') !== '') {
                    params.apartment_or_suite = getValues('apartment_or_suite')
                }
            }

            try {
                const phone = (getValues('phone_number').startsWith('+') ? getValues('phone_number') : `+${getValues('phone_number')}`)
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
            UpdateProfile('/looser/me/', params, (response) => {
                setLoading(false);
                if (response && response.success) {
                    toast.success('Profile updated successfully!');

                    const temp = { ...user }
                    temp['name'] = response?.data.name;
                    temp['phone_number'] = response?.data.phone_number
                    temp['country_code'] = response?.data.country_code
                    temp['looser']['state_code'] = response?.data.state
                    temp['looser']['city'] = response?.data.city
                    temp['looser']['postal_code'] = response?.data.postal_code
                    temp['looser']['address'] = response?.data.address
                    temp['looser']['apartment_or_suite'] = response?.data.apartment_or_suite

                    temp['looser']['is_same_address'] = isSame
                    temp['looser']['shipping_state'] = response?.data.shipping_state
                    temp['looser']['shipping_city'] = response?.data.shipping_city
                    temp['looser']['shipping_postal_code'] = response?.data.shipping_postal_code
                    temp['looser']['shipping_address'] = response?.data.shipping_address
                    temp['looser']['shipping_apartment_or_suite'] = response?.data.shipping_apartment_or_suite


                    localStorage.setItem('user', JSON.stringify(temp));
                    updateStore({ user: temp });
                    localStorage.setItem('userData', JSON.stringify(temp));

                } else {
                    if (
                        response &&
                        response.error &&
                        response.error.response &&
                        response.error.response.data
                    ) {
                        const errorData = response.error.response.data;

                        // Loop through all keys and display key + message
                        for (const key in errorData) {
                            if (Array.isArray(errorData[key]) && errorData[key].length > 0) {
                                const label = formatKey(key);
                                toast.error(`${label}: ${errorData[key][0]}`);
                                break;
                            }
                        }
                    } else if (
                        response &&
                        response.error &&
                        response.error.response &&
                        response.error.response.data.detail
                    ) {
                        toast.error(response.error.response.data.detail);
                    } else {
                        toast.error(`Failed to update profile!`);
                    }
                }
            });
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    async function submitProfileForm() {

        if (saving) {
            return;
        }

        try {
            const params = {}

            if (selectedImage) {
                params.profile_picture = selectedImage
            } else {
                if (deleteRequested) {
                    params.profile_picture = null
                } else {
                    toast.error(`Please choose profile picture!`)
                    return false
                }
            }

            setSaving(true);
            UpdateProfile('/looser/me/', params, (response) => {
                setSaving(false);
                if (response && response.success) {
                    toast.success('Profile updated successfully!');

                    const temp = { ...user }

                    temp['looser']['profile_picture'] = response?.data.profile_picture;

                    localStorage.setItem('user', JSON.stringify(temp));
                    updateStore({ user: temp });
                    localStorage.setItem('userData', JSON.stringify(temp));
                    setDeleteRequested(false)

                } else {
                    if (response && response.error && response.error.response.data && response.error.response.data.phone_number && response.error.response.data.phone_number.length > 0) {
                        toast.error(response.error.response.data.phone_number[0]);
                    } else if (response && response.error && response.error.response && response.error.response.data.detail) {
                        toast.error(response.error.response.data.detail)
                    } else {
                        toast.error(`Failed to update profile!`)
                    }
                }
            });
        } catch (error) {
            console.log(error)
            setSaving(false);
            setDeleteRequested(false)
        }
    }

    return (
        <div>
            <Navbar />
            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbChild='Settings' breadCrumbActive='Edit Profile' />
            <TopNavbar />

            <div className='section-background'>
                <div className='container py-5'>
                    <div
                        className='p-3'
                    >
                        <h3 style={{ fontWeight: 600, color: '#1e5af9' }}>Edit Profile</h3>
                    </div>
                    <Grid container spacing={4}>

                        <Grid item xs={12} md={8}>
                            <Box p={3} sx={{ backgroundColor: '#fff', borderRadius: 3, boxShadow: 2 }}>
                                <div className='border-bottom mb-2 '>
                                    <Typography variant="h6" sx={{ color: '#ea4736', fontWeight: 600, mb: 2 }}>Personal Information</Typography>
                                </div>

                                <form onSubmit={handleSubmit(submitForm)}>

                                    <Grid container spacing={2} mt={1}>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <label htmlFor="name">Full Name <span className='text-danger'>*</span></label>
                                                <Controller
                                                    name="name"
                                                    control={control}
                                                    rules={{ required: "Name is required" }}
                                                    render={({ field }) => (
                                                        <input id="name" placeholder="Full Name" style={formstyle} {...field} />
                                                    )}
                                                />
                                                {errors.name && <p className='error-validation'>{errors.name.message}</p>}
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6} className=''>
                                            <FormControl fullWidth>
                                                <label for="Phone">
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
                                                                style={{
                                                                    backgroundColor: '#eff4fb',
                                                                    border: '1px solid #cbd5e1',
                                                                    borderRadius: '6px',
                                                                    padding: '10px',
                                                                    fontSize: '14px',
                                                                    color: '#0f172a',
                                                                    width: '100%',
                                                                    height: '50px'
                                                                }}
                                                            />

                                                            {errors.phone_number && (<p className='error-validation' style={{ textAlign: 'left' }}>{errors.phone_number.message}</p>)}
                                                        </>
                                                    )}
                                                />

                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <FormControl fullWidth>
                                                <label>Email Address <span className='text-danger'>*</span></label>
                                                <input value={email} readOnly style={formstyle} />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={12} className='border-bottom mt-2'>
                                            <Typography variant="h6" sx={{ color: '#ea4736', fontWeight: 600, mb: 2 }}>
                                                Shipping Address
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={12} className='mt-2 mb-2'>
                                            <FormControl fullWidth>
                                                <label for="shipping_address">
                                                    Street Address <span className='text-danger'>*</span>
                                                </label>
                                                <Controller
                                                    name="shipping_address"
                                                    rules={{ required: "Street Address is required" }}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input style={formstyle} {...field} placeholder='Street Address' />
                                                    )}
                                                />
                                                {errors.shipping_address && <p className='error-validation'>{errors.shipping_address.message}</p>}
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <label>Apt, Suite, etc. <small>(optional)</small></label>
                                                <Controller
                                                    name="shipping_apartment_or_suite"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input style={formstyle} {...field} placeholder='Apt, Suite, etc.' />
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <label>City <span className='text-danger'>*</span></label>
                                                <Controller
                                                    name="shipping_city"
                                                    control={control}
                                                    rules={{ required: "City is required" }}
                                                    render={({ field }) => (
                                                        <input style={formstyle} {...field} placeholder='City' />
                                                    )}
                                                />
                                                {errors.shipping_city && <p className='error-validation'>{errors.shipping_city.message}</p>}
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <label>State <span className='text-danger'>*</span></label>
                                                <Controller
                                                    name="shipping_state"
                                                    control={control}
                                                    rules={{ required: "State is required" }}
                                                    render={({ field }) => (
                                                        <select style={formstyle} {...field}>
                                                            <option value="">Select State</option>
                                                            {states.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                                        </select>
                                                    )}
                                                />
                                                {errors.shipping_state && <p className='error-validation'>{errors.shipping_state.message}</p>}
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <label>Zip Code <span className='text-danger'>*</span></label>
                                                <Controller
                                                    name="shipping_postal_code"
                                                    control={control}
                                                    rules={{ required: "Zip Code is required" }}
                                                    render={({ field }) => (
                                                        <input style={formstyle} {...field} placeholder='Zip Code' />
                                                    )}
                                                />
                                                {errors.shipping_postal_code && <p className='error-validation'>{errors.shipping_postal_code.message}</p>}
                                            </FormControl>
                                        </Grid>



                                        <Grid item xs={12} sm={12} className='border-bottom mt-3'>
                                            <Typography variant="h6" sx={{ color: '#ea4736', fontWeight: 600, mb: 2 }}>
                                                Billing Address
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={12}>
                                            <FormControl fullWidth>
                                                <Box
                                                    className='LogIn_SignUpDiv mt-1'
                                                    style={{ display: 'flex', alignItems: 'center' }}
                                                >
                                                    <input
                                                        type='checkbox'
                                                        id='terms-checkbox'
                                                        checked={isSame}
                                                        onChange={(e) => setIsSame(e.target.checked)}
                                                        style={{
                                                            marginRight: '8px'
                                                        }}
                                                    />
                                                    <label htmlFor='terms-checkbox' className='mb-0'>
                                                        Billing address is the same as my shipping address
                                                    </label>
                                                </Box>
                                            </FormControl>
                                        </Grid>

                                        {(!isSame) && <>
                                            <Grid item xs={12} sm={12} className='mb-2'>
                                                <FormControl fullWidth>
                                                    <label for="address">
                                                        Street Address <span className='text-danger'>*</span>
                                                    </label>
                                                    <Controller
                                                        name="address"
                                                        rules={{ required: "Street Address is required" }}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input style={formstyle} {...field} placeholder='Street Address' />
                                                        )}
                                                    />
                                                    {errors.address && <p className='error-validation'>{errors.address.message}</p>}
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <label>Apt, Suite, etc. <small>(optional)</small></label>
                                                    <Controller
                                                        name="apartment_or_suite"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input style={formstyle} {...field} placeholder='Apt, Suite, etc.' />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <label>City <span className='text-danger'>*</span></label>
                                                    <Controller
                                                        name="city"
                                                        control={control}
                                                        rules={{ required: "City is required" }}
                                                        render={({ field }) => (
                                                            <input style={formstyle} {...field} placeholder='City' />
                                                        )}
                                                    />
                                                    {errors.city && <p className='error-validation'>{errors.city.message}</p>}
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <label>State <span className='text-danger'>*</span></label>
                                                    <Controller
                                                        name="state"
                                                        control={control}
                                                        rules={{ required: "State is required" }}
                                                        render={({ field }) => (
                                                            <select style={formstyle} {...field}>
                                                                <option value="">Select State</option>
                                                                {states.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                                            </select>
                                                        )}
                                                    />
                                                    {errors.state && <p className='error-validation'>{errors.state.message}</p>}
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <label>Zip Code <span className='text-danger'>*</span></label>
                                                    <Controller
                                                        name="postal_code"
                                                        control={control}
                                                        rules={{ required: "Zip Code is required" }}
                                                        render={({ field }) => (
                                                            <input style={formstyle} {...field} placeholder='Zip Code' />
                                                        )}
                                                    />
                                                    {errors.postal_code && <p className='error-validation'>{errors.postal_code.message}</p>}
                                                </FormControl>
                                            </Grid>
                                        </>}

                                    </Grid>

                                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                borderRadius: '8px',
                                                backgroundColor: '#2563eb',
                                                color: '#fff',
                                                px: 3,
                                                height: 42,
                                                textTransform: 'capitalize',
                                                '&:hover': {
                                                    backgroundColor: '#1d4ed8',
                                                },
                                            }}
                                        >
                                            {!loading ? 'Save' : <PulseLoader size={10} color="#ffffff" />}
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4} className='pb-5 pb-md-0'>
                            <Box
                                p={3}
                                sx={{
                                    backgroundColor: '#fff',
                                    borderRadius: 3,
                                    boxShadow: 2,
                                    border: '1px solid #e2e8f0',
                                }}
                            >
                                <div className='border-bottom'>
                                    <Typography variant="h6" sx={{ color: '#ea4736', fontWeight: 600, mb: 2 }}>
                                        Your Photo
                                    </Typography>
                                </div>

                                <Box display="flex" alignItems="center" gap={2} mb={2} mt={4}>
                                    <Avatar
                                        src={selectedImage || profileImage}
                                        alt="User Photo"
                                        sx={{ width: 50, height: 50 }}
                                    />
                                    <Box>
                                        <Typography fontSize={14} fontWeight={500}>Edit your photo</Typography>
                                        <Box display="flex" gap={2}>
                                            <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto', color: '#64748B', textTransform: 'capitalize', }} onClick={handleDeleteImage}>Delete</Button>
                                            <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto', color: '#3C50E0', textTransform: 'capitalize', }} onClick={handleClick}>Update</Button>
                                        </Box>
                                    </Box>
                                </Box>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                />

                                <Box
                                    onClick={handleClick}
                                    sx={{
                                        border: '1px dashed #3C50E0',
                                        backgroundColor: '#f1f5f9',
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        py: 3,
                                        px: 2,
                                        cursor: 'pointer',
                                        mb: 3,
                                    }}
                                >
                                    <img src={UploadIcon} />
                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 1, mb: 0.5, color: '#3C50E0', fontWeight: 500 }}
                                    >
                                        Click to upload
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                                        or drag and drop
                                        SVG, PNG, JPG or GIF
                                        <br />
                                        (max, 800 x 800px)
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="flex-end" gap={2}>

                                    <Button
                                        onClick={submitProfileForm}
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            borderRadius: '8px',
                                            backgroundColor: '#2563eb',
                                            color: '#fff',
                                            px: 3,
                                            height: 42,
                                            textTransform: 'capitalize',
                                            '&:hover': {
                                                backgroundColor: '#1d4ed8',
                                            },
                                        }}
                                    >
                                        {!saving ? 'Save' : <PulseLoader size={10} color="#ffffff" />}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </div>
            </div>

            <div>
                <Footer />
            </div>
        </div >
    )
}
export default EditProfile