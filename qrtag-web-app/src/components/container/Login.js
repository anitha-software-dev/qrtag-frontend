/* eslint-disable jsx-a11y/alt-text */
import '../css/App.css';
import Navbar from '../common/Navbar'
import QR_BG from '../../images/login-bg.svg';
import AuthImage from '../../images/auth-image.png'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { UpdateStore } from '../../StoreContext';
import SocialLogin from '../common/SocialLogin';

// import { toast } from "react-toastify";
import { toast } from 'react-toastify';
import { Auth } from 'aws-amplify';
import { useEffect, useState, useCallback } from 'react';
import { PulseLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLogin, AuthResendSignup, AuthSendActivation } from '../../services/auth';
import { FormControl, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

function Login() {
    const nav = useNavigate();
    const updateStore = UpdateStore();
    const [showPassword, setShowPassword] = useState(false);
    // const [token, setToken] = useState(null)

    let [loading, setLoading] = useState();
    // const toast = toast({ position: toast.POSITION.BOTTOM_RIGHT });

    const { getValues, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [isDeleted, setIsDeleted] = useState(false);
    const [accountDeletedMessage, setAccountDeletedMessage] = useState('');

    const handleReactivate = () => {
        resendActivationCode();
        nav('/reactivationcode', { state: { username: getValues('email') } });
    }

    const handleCancel = () => {
        setIsDeleted(false)
    }

    async function resendConfirmationCode() {
        try {
            AuthResendSignup({ email: getValues('email') }, (response) => {
                if (response && response.success) {
                    // toast.success('Code resent successfully');
                } else {
                    // toast.error("Resend failed. Please try again later!")
                }
            });
        } catch (err) {
            console.log('error resending code: ', err);
        }
    }

    async function resendActivationCode() {
        try {
            AuthSendActivation({ email: getValues('email') }, (response) => {
                if (response && response.success) {
                    // toast.success('Code resent successfully');
                } else {
                    // toast.error("Resend failed. Please try again later!")
                }
            });
        } catch (err) {
            console.log('error resending code: ', err);
        }
    }

    async function signIn() {

        if (loading) {
            return;
        }
        setLoading((s) => !s);
        try {
            // const user = await Auth.signIn(formState.email, formState.password);
            AuthLogin({ username: getValues('email'), password: getValues('password') }, (response) => {

                setLoading((s) => !s);
                if (response && response.success) {
                    if (response?.data && !response.data.user?.has_accepted_terms) {
                        toast.error(`Please agree to the Terms & Conditions!`)
                        nav('/acceptterms', { state: { username: getValues('email') } });
                    } else if (response.data && !response.data.user?.email_verified) {
                        toast.error(`Please verify your email account!`)
                        resendConfirmationCode()
                        nav('/verificationcode', { state: { username: getValues('email') } });
                    } else if (response.data && !response.data.user?.is_active) {
                        setIsDeleted(true)
                        setAccountDeletedMessage(response.data?.message || 'It appears that your account was previously deleted. To reactivate your account, please verify your email address. A verification OTP will be sent to your registered email. Would you like to proceed with reactivation.');

                    } else if (response.data) {
                        localStorage.setItem('user', JSON.stringify(response?.data.user));
                        updateStore({ user: response?.data.user, loggedIn: true, accessToken: response?.data.access });
                        localStorage.setItem('userData', JSON.stringify(response?.data.user));
                        localStorage.setItem('accessToken', response?.data.access);
                        localStorage.setItem('refreshToken', response?.data.refresh);

                        if (sessionStorage.getItem('uuidcode')) {
                            nav(`/uuid/${sessionStorage.getItem('uuidcode')}`)
                        } else {
                            nav('/')
                        }
                    }
                } else {
                    if (response && response.error && response.error.data && response.error.data.detail) {
                        toast.error(`${response && response.error && response.error.data.detail}`)
                    } else {
                        toast.error(`Invalid login credentials!`)
                    }
                }
            });
            // const uid = localStorage.getItem('uid');
            // if (uid) {
            //   nav('/chat');
            // } else {
            //   nav('/');
            // }
            // setLoading((s) => !s);
            // toast.success('Login Successfully');
        } catch (error) {
            setLoading((s) => !s);

            if (error.message === 'User is not confirmed.') {
                toast.error('User is not confirmed.');
            } else if (error.message === 'Incorrect username or password.') {
                toast.error('Incorrect username or password.');
            } else {
                toast.error(error.message);
            }
            console.log('error signing in', error.message);
        }
    }
    return (
        <>
            <div className='mt-2 d-block d-md-none'>
                <Navbar />
            </div>

            <div className='LogInContainer'>
                <div className='LogIn_ImageDiv'>
                    <img className='LogIn_Image' src={AuthImage} />
                </div>
                <div className='LogIn_RightDiv Auth_Bg' >
                    {isDeleted ? (
                        <>
                            <form className='LogIn_FormDiv' >
                                <div className='LogIn_HeadingDiv'>
                                    <h3 style={{ textAlign: 'center', fontWeight: 600 }}>Account Deleted</h3>
                                    <p className='pt-3' style={{ textAlign: 'justify' }}>
                                        {accountDeletedMessage}
                                    </p>
                                </div>

                                <div className='LogIn_BtnDiv'>
                                    <button onClick={handleReactivate} className='LogIn_Btn'>
                                        {!loading ? <div> Reactivate</div> : <PulseLoader size={15} color='#ffffff' />}
                                    </button>
                                </div>
                                <div className='LogIn_SignUpDiv' >
                                    <p>
                                        <Link style={{ color: '#000', fontWeight: '700' }} onClick={handleCancel}>Cancel</Link>
                                    </p>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>

                            <form className='LogIn_FormDiv' onSubmit={handleSubmit(signIn)}>
                                <div className='LogIn_HeadingDiv'>
                                    <h3>Welcome Back!</h3>
                                    <p>Please enter the details to continue.</p>
                                </div>
                                <div className='LogIn_InputDiv'>
                                    {/* <h3 className='pb-4'>Login</h3> */}

                                    <FormControl fullWidth className='mb-2' style={{ position: 'relative' }}>
                                        <Controller
                                            name="email"
                                            control={control}
                                            rules={{
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Invalid email address",
                                                },
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    className='LogIn_InputEmail'
                                                    label="Enter Email"
                                                    required
                                                    fullWidth
                                                    error={!!errors.email}
                                                    helperText={errors.email?.message}
                                                />
                                            )}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth className='mb-2' style={{ position: 'relative' }}>
                                        <Controller
                                            name="password"
                                            control={control}
                                            rules={{ required: "Password is required" }}
                                            render={({ field }) => (
                                                <div
                                                    className='LogIn_InputPasswordDiv'
                                                    style={{
                                                        border: 'none',
                                                        position: 'relative',
                                                        paddingLeft: '0px',
                                                        paddingRight: '0px'
                                                    }}
                                                >
                                                    <TextField
                                                        {...field}
                                                        className='LogIn_InputPassword'
                                                        type={!showPassword ? 'password' : 'text'}
                                                        label="Enter Password"
                                                        required
                                                        fullWidth
                                                        error={!!errors.password}
                                                        helperText={errors.password?.message}
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        right: '20px',
                                                        top: '17px'
                                                    }}>
                                                        {showPassword ? (
                                                            <VisibilityOutlinedIcon
                                                                style={{ color: '#818181', cursor: 'pointer' }}
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            />
                                                        ) : (
                                                            <VisibilityOffOutlinedIcon
                                                                style={{ color: '#818181', cursor: 'pointer' }}
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </FormControl>
                                </div>

                                <div className='LogIn_BtnDiv' style={{ marginLeft: '0px', marginRight: '0px' }}>
                                    <button className='LogIn_Btn' color='#ea4736' style={{ height: '55px' }}>
                                        {!loading ? (
                                            <div> Sign in</div>
                                        ) : (
                                            <PulseLoader size={15} color='#ffffff' />
                                        )}
                                    </button>
                                </div>

                                <div className='d-none d-lg-block'>
                                    <div className='LogIn_ForgotPasswordDiv my-4'>
                                        <Link to='forgetpassword' style={{ textDecoration: 'none' }}>
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div style={{ border: '1px solid #e4e7ef', padding: '20px', backgroundColor: '#f8fafd', borderRadius: '8px' }}>
                                        <div className='LogIn_SignUpDiv'>
                                            <p>
                                                Don’t have an account?{' '}
                                                <Link
                                                    to='/signup'
                                                    style={{ color: '#2159D6' }}
                                                >
                                                    Sign up
                                                </Link>
                                            </p>
                                        </div>
                                        <div className='LogIn_DividerDiv'>
                                            <div className='LogIn_Divider' />
                                            <p>or sign in with</p>
                                            <div className='LogIn_Divider' />
                                        </div>

                                        <SocialLogin />
                                    </div>
                                </div>


                                <div className='d-block d-md-none d-lg-none'>
                                    <div className='LogIn_ForgotPasswordDiv mt-4 mb-3'>
                                        <Link to='forgetpassword' style={{ textDecoration: 'none', fontSize: '16px' }}>
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div className='LogIn_DividerDiv mb-3'>
                                        <div className='LogIn_Divider' />
                                        <p style={{ fontSize: '14px' }}>or sign up with</p>
                                        <div className='LogIn_Divider' />
                                    </div>

                                    <SocialLogin />

                                    <div className='LogIn_SignUpDiv mt-5 pt-5'>
                                        <p>
                                            Don’t have an account?{' '}
                                            <Link
                                                to='/signup'
                                                style={{ color: '#2159D6' }}
                                            >
                                                Sign up
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                            </form>

                        </>
                    )}
                </div >
            </div >
        </>
    );
}

export default Login;
