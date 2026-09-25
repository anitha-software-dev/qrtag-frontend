/* eslint-disable jsx-a11y/alt-text */
import '../css/App.css';
import QR_BG from '../../images/login-bg.svg';
import AuthImage from '../../images/auth-image.png'
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactCodeInput from 'react-code-input';
// import { reactCodeInput } from 'CodeInputField.scss';
import { AuthService } from '../../services/auth';
import { Store } from '../../StoreContext';
import Navbar from '../common/Navbar'

function VerificationResetCode() {

  const { messages } = Store();
  const { state } = useLocation();
  const [username] = useState(state?.username);
  const nav = useNavigate();
  // const [showPassword, setShowPassword] = useState(false);

  let [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    code: '',
    password: '',
    confirmpassword: '',
  });

  const [timer, setTimer] = useState(0);
  const [timerActual, setTimerActual] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [headingContent, setHeadingContent] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [didntReceiveToken, setDidntReceiveToken] = useState(null);

  useEffect(() => {
    if (messages) {
      console.log("messages", messages)
      const res = messages.filter((item) => item.key === 'new_password_heading_message');
      if (res.length > 0) {
        setHeadingContent(res[0]);
      }

      const res1 = messages.filter((item) => item.key === 'didnot_receive_token');
      if (res1.length > 0) {
        setDidntReceiveToken(res1[0]);
      }

      const otpMessages = messages.filter((item) => item.key === 'otp_resend_time')
      if (otpMessages.length > 0) {
        const expirationTime = parseInt(otpMessages[0].value, 10)

        if (isNaN(expirationTime) || expirationTime <= 0) {
          setTimer(60)
        } else {
          setTimer(expirationTime * 60)
          setTimerActual(expirationTime * 60)
        }

        setIsTimerActive(true)
      }

    }
  }, [messages]);


  useEffect(() => {
    let timerInterval;
    if (isTimerActive && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerInterval);
            setIsTimerActive(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isTimerActive, timer]);

  const formatTimer = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  async function resendConfirmationCode() {

    try {
      // await Auth.resendSignUp(username);
      AuthService('/users/password-reset/send-token/', { email: username }, (response) => {

        if (response && response.success) {
          toast.success('Code resent successfully');
          setTimer(timerActual);
          setIsTimerActive(true);
        } else {
          toast.error("Resend failed. Please try again later!")
        }
      });
    } catch (err) {
      toast.error(err);
      console.log('error resending code: ', err);
    }

  }

  useEffect(() => {
    if (!username) nav('/');
    // if()
  }, []);

  async function verifyForgot() {

    if (formState.code === '') {
      toast.error('Verification reset code cannot be empty');
      return false
    }

    setLoading((s) => !s);
    try {
      AuthService('/users/password-reset/verify-token/', { email: username, token: Number(formState.code) }, (response) => {
        setLoading((s) => !s);
        if (response && response.success) {
          nav('/confirmpassword', { state: { username: username } });

          toast.success('Reset code verified successfully');
        } else {
          toast.error("Invalid code. Please try again later!")
        }
      });
    } catch (error) {
      if (error.message === 'Confirmation code cannot be empty') {
        toast.error('Confirmation code cannot be empty.');
      } else {
        toast.error('Invalid verification code provided, please try again.');
      }
      console.log('error confirming sign up', error);
      setLoading((s) => !s);
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
        <div className='LogIn_RightDiv Auth_Bg'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: isMobile ? '85vh' : 'auto',
          }}>
          <form className='LogIn_FormDiv'
            style={{
              textAlign: isMobile ? 'center' : 'left'
            }}
            onSubmit={(e) => e.preventDefault()}>
            <div className='LogIn_HeadingDiv'>
              <h3 style={{
                marginBottom: isMobile ? '10%' : '1%'
              }}>
                Verify Reset Code</h3>
              <p style={{ color: '#5B6172' }}> {(headingContent && headingContent?.value) ? headingContent?.value : "To continue please enter the 6 digit token sent to your email"}</p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <ReactCodeInput
                className='OtpInputBox'
                fields={6}
                value={formState.code}
                onChange={(e) => {
                  setFormState((s) => ({ ...s, code: e }));
                }}
              />
            </div>

            <div className='LogIn_BtnDiv'
              style={{
                marginTop: '5%'
              }}>
              <button onClick={verifyForgot} className='LogIn_Btn' style={{ height: '55px' }}>
                {!loading ? <div> Verify</div> : <PulseLoader size={15} color='#ffffff' />}
              </button>
            </div>
            <div className='LogIn_SignUpDiv'
              style={{
                marginTop: isMobile ? '35%' : '5%'
              }}>
              <p style={{ color: '#5B6172' }}>
                {(didntReceiveToken && didntReceiveToken.value) ? didntReceiveToken.value : "Didn't receive token?"}{' '}
                <Link
                  style={{
                    color: isTimerActive ? '#ccc' : '#5B6172',
                    fontWeight: '700',
                    pointerEvents: isTimerActive ? 'none' : 'auto',
                    textDecoration: isTimerActive ? 'none' : 'underline',
                    display: 'block',
                    marginTop: isMobile ? '5px' : '0'
                  }}
                  onClick={resendConfirmationCode}
                >
                  Request again {isTimerActive && <span style={{ color: '#ccc' }}> in </span>}
                </Link>
                {isTimerActive && (
                  <span style={{ marginLeft: '10px', color: '#1e5af9' }}>
                    {formatTimer()}
                  </span>
                )}
              </p>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default VerificationResetCode;
