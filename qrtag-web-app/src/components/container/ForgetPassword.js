/* eslint-disable jsx-a11y/alt-text */
import '../css/App.css';
import Navbar from '../common/Navbar'
import QR_BG from '../../images/login-bg.svg';
import AuthImage from '../../images/auth-image.png'
import FB_Logo from '../../images/facebook-logo.svg';
import Apple_Logo from '../../images/apple-logo.svg';
import Google_Logo from '../../images/google-logo.svg';
import HidePassword from '../../images/hide-password.svg';
import SignUp from './SignUp';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '../../services/auth';
import { FormControl, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Store } from '../../StoreContext';

function ForgetPassword() {

  const { messages } = Store();
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [headingContent, setHeadingContent] = useState(null);

  let [loading, setLoading] = useState(false);

  const { getValues, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: ''
    },
  });

  useEffect(() => {
    if (messages) {
      const res = messages.filter((item) => item.key === 'forgot_password_heading_message')
      if (res && res.length > 0) {
        setHeadingContent(res[0])
      }
    }
  }, [messages])

  async function forgetPassword() {

    if (loading) {
      return;
    }
    setLoading((s) => !s);
    try {
      AuthService('/users/password-reset/send-token/', { email: getValues('email') }, (response) => {
        setLoading((s) => !s);
        if (response && response.success) {
          console.log('Verification code sent');
          nav('/verifyresetcode', { state: { username: getValues('email') } });
        } else {
          const emailError = response?.error?.response?.data?.email?.[0]
          if (emailError) {
            toast.error(emailError)
          } else {
            toast.error('Forgot password failed!');
          }
        }
      });
    } catch (error) {

      setLoading((s) => !s);
      if (
        error.message ===
        'Cannot reset password for the user as there is no registered/verified email or phone_number'
      ) {
        toast.error('User not registered');
      } else toast.error(error.message);

      console.log('error signing up', error);
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
        <div className='LogIn_RightDiv Auth_Bg'>
          <form className='LogIn_FormDiv' onSubmit={handleSubmit(forgetPassword)}>
            <div className='LogIn_HeadingDiv'>
              <h3>Forgot Password?</h3>
              <p>
                {(headingContent && headingContent?.value) ? headingContent?.value : "Please Enter the mail associated with your account and we will send you a Token to reset your password"}
              </p>
            </div>

            <div className='LogIn_InputDiv'>

              <FormControl fullWidth className='mb-1' style={{ position: 'relative' }}>
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
                      label="Enter Your Email"
                      required
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className='LogIn_BtnDiv mt-4' >
              <button className='LogIn_Btn' style={{ height: '55px' }}>
                {!loading ? <div>Submit</div> : <PulseLoader size={15} color='#ffffff' />}
              </button>
            </div>

            <div className='LogIn_SignUpDiv mt-4 d-md-block d-none'>
              <p >
                Back to {' '}
                <Link to='/' style={{ color: '#4d7ade' }}>
                  Login
                </Link>
              </p>
            </div>

            <div className='LogIn_SignUpDiv mt-4 d-block d-md-none'>
              <p className='Back_login'>
                Back to {' '}
                <Link to='/' style={{ color: '#4d7ade' }}>
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;
