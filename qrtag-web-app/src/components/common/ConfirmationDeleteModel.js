import * as React from 'react';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ReactCodeInput from 'react-code-input';
import { AuthService } from '../../services/auth';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { Store, ResetStore } from '../../StoreContext';
import '../css/App.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, setOpen }) {

  const nav = useNavigate();
  const { user, loggedIn } = Store();
  const [isVerified, setIsVerified] = React.useState(false);
  let [loading, setLoading] = React.useState(false);
  const [formState, setFormState] = React.useState({
    code: ''
  });

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };
  const closeModal = () => {
    setOpen(false);
  };

  const handleDeleteAccount = async () => {
    setLoading((s) => !s);
    try {
      AuthService('/users/delete-user/send-code/', { email: user?.email }, (response) => {
        setLoading((s) => !s);
        if (response && response.success) {
          setIsVerified(true)
        } else {
          setIsVerified(false)
          if (response && response.error && response.error.data && response.error.data.detail) {
            toast.error(`${response && response.error && response.error.data.detail}`)
          } else {
            toast.error(`Failed to delete account!`)
          }
        }
      });
    } catch (error) {
      setLoading((s) => !s);
      console.log('Failed to delete account: ', error.message);
      setIsVerified(false)
    }

  };

  async function handleVerify() {

    if (formState.code === '') {
      toast.error('Verification code cannot be empty!');
      return false
    }

    setLoading((s) => !s);
    try {
      AuthService('/users/delete-user/verify-code/', { code: formState.code }, (response) => {
        setLoading((s) => !s);
        if (response && response.success) {
          toast.success('Account deleted successfully!');
          localStorage.setItem('isLoggedIn', 'false');
          localStorage.clear();
          nav('/');
          setTimeout(() => {
            window.location.reload();
          }, 100)
        } else {
          toast.error("Invalid code. Please try again later!")
        }
      });
    } catch (error) {
      if (error.message === 'Verification code cannot be empty') {
        toast.error('Verification code cannot be empty.');
      } else {
        toast.error('Invalid verification code provided, please try again.');
      }
      console.log('Failed to delete account', error);
      setLoading((s) => !s);
    }
  }

  return (
    <div className='deleteAccount'>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={style}
          style={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            // textAlign: "center",
          }}
          className='mui-body'
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                right: '-7%',
                marginTop: '-7%',
                border: '2px solid #000',
                borderRadius: '50%',
                padding: '3px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={closeModal}
              onClose={handleClose}
            >
              <CloseIcon />
            </div>
          </div>

          {(isVerified) ? <>
            <div className='LogIn_HeadingDivs mb-4'>
              <h2>Verification Code</h2>
              <p>To continue please enter the 6 digit token sent to your email</p>
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

            <div className='LogIn_BtnDivs mt-3'>
              <button onClick={handleVerify} className='LogIn_Btns'>
                {!loading ? <div> Submit</div> : <PulseLoader size={15} color='#ffffff' />}
              </button>
            </div>

          </> : <>
            <Typography
              sx={{ marginTop: '5%' }}
              id='modal-modal-title'
              variant='h6'
              component='h2'
            >
              Confirm Delete Account
            </Typography>
            <Typography id="modal-modal-description" className='text-center' sx={{ mt: 2, mb: 3 }}>
              Are you sure you want to delete account?
            </Typography>

            <div className='LogIn_BtnDivs mt-3'>
              <button onClick={handleDeleteAccount} className='LogIn_Btns'>
                {!loading ? <div> Yes </div> : <PulseLoader size={15} color='#ffffff' />}
              </button>
            </div>

          </>}
        </Box>
      </Modal>
    </div>
  );
}
