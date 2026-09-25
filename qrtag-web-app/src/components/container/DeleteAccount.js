/* eslint-disable jsx-a11y/alt-text */
import '../css/App.css';
import QR_BG from '../../images/login-bg.svg';
import AuthImage from '../../images/auth-image.png'
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthService } from '../../services/auth';
import { FormControl, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import Navbar from '../common/Navbar'

function DeleteAccount() {

  const nav = useNavigate();

  let [loading, setLoading] = useState(false);

  const { getValues, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: ''
    },
  });

  async function handleDelete() {

    setLoading(true);
    try {
      AuthService('/users/delete-user/send-code/', { email: getValues('email') }, (response) => {
        setLoading(false);
        if (response && response.success) {
          nav('/account/delete/code', { state: { username: getValues('email') } });
        } else {
          if (response && response.error && response.error.data && response.error.data.detail) {
            toast.error(`${response && response.error && response.error.data.detail}`)
          } else if (response && response.error && response.error.data && response.error.data.message) {
            toast.error(response.error.data.message)
          } else {
            toast.error('Delete account failed!');
          }
        }
      });
    } catch (error) {
      if (
        error.message ===
        'Cannot reset password for the user as there is no registered/verified email or phone_number'
      ) {
        toast.error('User not registered');
      } else toast.error(error.message);

      console.log('error signing up', error);
      setLoading(false);
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
          <form className='LogIn_FormDiv' onSubmit={handleSubmit(handleDelete)}>
            <div className='LogIn_HeadingDiv'>
              <h3>Delete Account?</h3>
              <p>
                Please Enter the mail associated with your account and we will send you a link to
                delete the account.
              </p>
            </div>
            <div className='LogIn_InputDiv'>
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
            </div>
            <div className='LogIn_BtnDiv mt-4' >
              <button className='LogIn_Btn' style={{ height: '55px' }}>
                {!loading ? <div>Submit</div> : <PulseLoader size={15} color='#ffffff' />}
              </button>
            </div>

            <div className='LogIn_SignUpDiv mt-4 d-md-block d-none'>
              <p style={{ color: '#5B6172' }}>
                Back to {' '}
                <Link to='/' style={{ color: '#1e5af9', fontWeight: '700' }}>
                  Sign In
                </Link>
              </p>
            </div>

            <div className='LogIn_SignUpDiv mt-4 d-block d-md-none'>
              <p className='Back_login'>
                Back to {' '}
                <Link to='/' style={{ color: '#1e5af9', fontWeight: '700' }}>
                  Sign In
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

export default DeleteAccount;
