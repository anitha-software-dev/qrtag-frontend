import * as React from 'react';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Store, UpdateStore } from '../../StoreContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, setOpen, onConfirm }) {

  const { user, messages } = Store();
  const nav = useNavigate();
  const handleOpen = () => setOpen(true);

  const [message, setMessage] = React.useState(null);

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };
  const closeModal = () => {
    setOpen(false);
  };

  const onSubscribe = () => {
    nav('/subscription')
  }

  React.useEffect(() => {
    if (messages) {
      const res = messages.filter((item) => item.key === 'unlock_premium_message')
      if (res) {
        setMessage(res[0])
      }
    }
  }, [messages])

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        disableEscapeKeyDown
      >
        <Box
          sx={style}
          style={{
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          className="modal-body"
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
          <Typography sx={{ marginTop: '5%' }} id='modal-modal-title' style={{ fontWeight: 'bold' }} component='h6' variant='h6'>
            Unlock Premium Features
          </Typography>
          <Typography id='modal-modal-description' className='text-center' sx={{ mt: 2, mb: 3 }}>
            {(message && message?.value) ? <>{message?.value}</> : 'Upgarde to our subscription plan and enjoy unlimited access, and more. <br/>Get started today!'}
          </Typography>
          <div className='LogIn_BtnDivs mt-3'>
            <button onClick={onSubscribe} className='LogIn_Btns'>
              <div> Subscribe Now </div>
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
