/* eslint-disable jsx-a11y/alt-text */
import '../css/App.css';
import Navbar from '../common/Navbar'
import QR_BG from '../../images/login-bg.svg';
import AuthImage from '../../images/auth-image.png'
import HidePassword from '../../images/hide-password.svg';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber, validatePhoneNumberLength } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';

import { AuthSignup } from '../../services/auth';
import SocialLogin from '../common/SocialLogin';
import { FormControl, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

function SignUp() {

  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  let [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false)

  const { handleSubmit, watch, control, formState: { errors }, getValues } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: ''
    },
  })


  async function signUp() {

    if (loading) {
      return;
    }

    try {

      const params = {
        name: getValues('name'),
        email: getValues('email'),
        password: getValues('password'),
        phone_number: getValues('phone').replace(/\+/g, '')
      }

      try {
        const phone = (getValues('phone').startsWith('+') ? getValues('phone') : `+${getValues('phone')}`)

        if (validatePhoneNumberLength(phone) === 'TOO_SHORT') {
          toast.error('Please enter a valid phone number');
          return false
        }

        const parsedNumber = parsePhoneNumber(phone);
        if (parsedNumber) {
          params.phone_number = parsedNumber?.nationalNumber
          params.country_code = parsedNumber?.country || 'US'

          if (parsedNumber?.nationalNumber === "") {
            toast.error('Please enter a valid phone number');
            return false
          }
        }
      } catch (e) {
        console.error(e);
      }

      setLoading((s) => !s);

      AuthSignup(params, (response) => {
        setLoading((s) => !s);
        if (response && response.success) {
          nav('/verificationcode', { state: { username: getValues('email') } });
        } else {
          const errorData = response.error?.data;
          if (errorData && errorData.phone_number && errorData.phone_number.length > 0) {
            toast.error(errorData.phone_number[0]);
          } else if (errorData && errorData.email) {
            toast.error(errorData.email);
          }

        }
      });

    } catch (error) {
      setLoading((s) => !s);
      if (error.message === 'Invalid phone number format.') {
        toast.error('Invalid phone number format.');
      } else if (error.message === 'An account with the given email already exists') {
        toast.error('An account with the given email already exists');
      } else {
        toast.error(error.message);
      }
      console.log('error signing up', error);
    }

  }
  return (
    <>
      <div className='mt-2 d-block d-md-none'>
        <Navbar />
      </div>

      {/* <div style={{ position: 'absolute', bottom: '2%', right: '2%' }}>
        <Link to='/about' style={{ fontWeight: '600', textDecoration: 'none' }}>
          About Us
        </Link>
      </div> */}
      <div className='LogInContainer'>
        <div className='LogIn_ImageDiv'>
          <img className='LogIn_Image' src={AuthImage} />
        </div>
        <div className='LogIn_RightDiv Auth_Bg py-lg-5 py-md-4 py-0'>
          <form className='LogIn_FormDiv' onSubmit={handleSubmit(signUp)}>
            <div className='LogIn_HeadingDiv d-md-block d-none'>
              <h3>Create an account</h3>
              <p>Please enter the details to create an account.</p>
            </div>

            <div className='LogIn_HeadingDiv d-block d-md-none'>
              <h3 className='pt-3'>Register Now!</h3>
              <p>Sign up today for effortless tracking and retrieval.</p>
            </div>
            <div className='LogIn_InputDiv'>

              <FormControl fullWidth className='mb-1 pb-1' style={{ position: 'relative' }}>
                <Controller
                  name='name'
                  control={control}
                  rules={{
                    required: 'Full Name is required',
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='LogIn_InputEmail'
                      label="Enter Full Name"
                      required
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth className='mt-1 mb-1' style={{ position: 'relative' }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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

              <FormControl fullWidth className='mb-1'>
                <Controller
                  name='phone'
                  control={control}
                  rules={{
                    required: 'Phone number is required',
                    maxLength: {
                      value: 15,
                      message: 'Ensure this field has no more than 15 characters',
                    }
                  }}
                  render={({ field }) => (
                    <div style={{ position: 'relative' }}>
                      <PhoneInput
                        {...field}
                        international
                        defaultCountry='US'
                        className='LogIn_InputEmail'
                      />
                      {(!field.value || field.value === '+1') ? (
                        <div className='phone-placeholder'>Enter Phone Number <span style={{ color: '#DE3B3B' }}>*</span></div>
                      ) : null}
                    </div>
                  )}
                />
                {/* {!watch("phone") && (
                  <span style={{ position: 'absolute', left: '200px', top: errors.phone ? '37%' : '50%', transform: 'translateY(-50%)', color: '#DE3B3B' }}>*</span>
                )} */}
                {errors.phone && (<p className='error-validation'>{errors.phone.message}</p>)}
              </FormControl>

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
            {/* <div className='LogIn_ForgotPasswordDiv'>
              <p>Forgot password?</p>
            </div> */}

            <div className='LogIn_SignUpDiv mt-2' style={{ display: 'flex', alignItems: 'start', justifyContent: 'start' }}>
              <input className="form-check-input" style={{ width: '2em' }} name="development" checked={checked} onChange={(e) => setChecked(e.target.checked)} type="checkbox"></input>
              <p className='ml-1 text-align-left-important'>
                I have read, understood, and hereby accept the&nbsp;
                <a href='https://qrtag.it/terms-and-conditions/' target='_blank' style={{ color: '#2159D6' }}>
                  Terms and Conditions
                </a> and&nbsp;
                <a href='https://qrtag.it/privacy-policy/' target='_blank' style={{ color: '#2159D6' }}>
                  Privacy Policy
                </a>
              </p>
            </div>

            <div className='LogIn_BtnDiv my-4 '  >
              <button className='LogIn_Btn '
                style={{
                  height: '55px',
                  borderRadius: '5px',
                  backgroundColor: !checked || loading ? '#d3d3d3' : '#EA4736',
                  opacity: !checked || loading ? 0.5 : 1,
                  cursor: !checked || loading ? 'not-allowed' : 'pointer'
                }}
                disabled={!checked || loading}>
                {!loading ? <div> Sign up</div> : <PulseLoader size={15} color='#ffffff' />}
              </button>

            </div>

            <div style={{ border: '1px solid #e4e7ef', padding: '20px', backgroundColor: '#f8fafd', borderRadius: '8px' }} className='d-md-block d-none'>
              <div className='LogIn_SignUpDiv'>
                <p>
                  Already have an account?{' '}
                  <Link to='/' style={{ color: '#2159D6' }}>
                    Sign in
                  </Link>
                </p>
              </div>
              <div className='LogIn_DividerDiv'>
                <div className='LogIn_Divider' />
                <p>or sign in with</p>
                <div className='LogIn_Divider' />
              </div>
              <div style={{ marginBottom: "5px" }}>
                <SocialLogin />
              </div>
            </div>

            <div className='d-block d-md-none'>

              <div className='LogIn_DividerDiv'>
                <div className='LogIn_Divider' />
                <p>or sign up with</p>
                <div className='LogIn_Divider' />
              </div>
              <div style={{ marginBottom: "5px" }}>
                <SocialLogin />
              </div>

              <div className='LogIn_SignUpDiv mt-5'>
                <p>
                  Already have an account?{' '}
                  <Link to='/' style={{ color: '#2159D6' }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div >
      </div >
    </>
  );
}

export default SignUp;
