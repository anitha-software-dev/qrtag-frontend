/* eslint-disable jsx-a11y/alt-text */
import '../css/App.css';
import QR_BG from '../../images/login-bg.svg';
import AuthImage from '../../images/auth-image.png'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { toast } from 'react-toastify';
import Navbar from '../common/Navbar'

import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth';
import { FormControl, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

function ConfirmPassword() {
  const nav = useNavigate();
  const { state } = useLocation();
  // const username = state?.username;
  const [username] = useState(state?.username);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  let [loading, setLoading] = useState(false);

  const { handleSubmit, control, formState: { errors }, getValues } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
  })

  async function confirmPassword() {

    try {
      if (loading) {
        return;
      }
      setLoading((s) => !s);
      AuthService('/users/password-reset/set-password/', { email: username, password1: getValues('password'), password2: getValues('confirmPassword') }, (response) => {
        if (response && response.success) {
          nav('/');
          toast.success('Password Updated');
        } else {
          if (response && response.error && response.error.response && response.error.response.data && response.error.response.data.non_field_errors && response.error.response.data.non_field_errors.length > 0) {
            toast.error(`Reset failed. ${response.error.response.data.non_field_errors[0]}`)
          } else {
            toast.error('Reset failed!');
          }
        }
      })
    } catch (error) {
      if (error.message === 'Attempt limit exceeded, please try after some time.') {
        toast.error('Attempt limit exceeded, please try after some time.');
      } else {
        toast.error(error.message);
      }
    }
    setLoading((s) => !s);

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
        <div className='LogIn_RightDiv Auth_Bg' style={{ paddingBottom: isMobile ? "50%" : "0" }}>
          <form className='LogIn_FormDiv' onSubmit={handleSubmit(confirmPassword)}>
            <div className='LogIn_HeadingDiv'>
              <h3>New Password</h3>
              <p>To continue, please enter the new password and confirm password</p>
            </div>
            <div className='LogIn_InputDiv'>

              <FormControl fullWidth className='mb-1' style={{ position: 'relative' }}>
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
                        label="Password"
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

              <FormControl fullWidth className='mb-1' style={{ position: 'relative' }}>
                <Controller
                  name='confirmPassword'
                  control={control}
                  rules={{
                    required: 'Confirm Password is required',
                    validate: value =>
                      value === getValues('password') || 'Passwords do not match',
                  }}
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
                        type={!showConfirmPassword ? 'password' : 'text'}
                        label="Confirm Password"
                        required
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                      />
                      <div style={{
                        position: 'absolute',
                        right: '20px',
                        top: '17px'
                      }}>
                        {showConfirmPassword ? (
                          <VisibilityOutlinedIcon
                            style={{ color: '#818181', cursor: 'pointer' }}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          />
                        ) : (
                          <VisibilityOffOutlinedIcon
                            style={{ color: '#818181', cursor: 'pointer' }}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                />
              </FormControl>
            </div>

            <div className='LogIn_BtnDiv mt-3'>
              <button className='LogIn_Btn' style={{ height: '55px' }}>
                {!loading ? <div> Submit</div> : <PulseLoader size={15} color='#ffffff' />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ConfirmPassword;
