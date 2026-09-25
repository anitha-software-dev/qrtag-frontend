import * as React from 'react';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

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

export default function BasicModal({ open, setOpen, onConfirm }) {
  //   const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };
  const closeModal = () => {
    setOpen(false);
  };

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
            alignItems: 'center',
            // textAlign: "center",
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
          <Typography
            sx={{ marginTop: '5%' }}
            id='modal-modal-title'
            variant='h6'
            component='h2'
          >
            Confirm Sign Out
          </Typography>
          <Typography id="modal-modal-description" className='text-center' sx={{ mt: 2, mb: 3 }}>
            Are you sure you want to Sign Out?
          </Typography>

          <div className='LogIn_BtnDivs mt-3'>
            <button onClick={onConfirm} className='LogIn_Btns'>
              <div> Yes </div>
            </button>
          </div>
          {/* <button
            style={{
              border: 'none',
              borderRadius: '5px',
              color: 'red',
              padding: '2% 5%',
            }}
            onClick={onConfirm}
          >
            {' '}
            Sign Out
          </button> */}
        </Box>
      </Modal>
    </div>
  );
}
