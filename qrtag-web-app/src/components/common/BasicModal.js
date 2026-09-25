import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
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
  borderRadius: '5px',
};

export default function BasicModal() {

  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/about', { state: null });
    setOpen(false);
  };
  const closeModal = () => {
    navigate('/about', { state: null });
    setOpen(false);
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style} className="modal-body">
          <div style={{ position: 'relative', width: '100%', background: 'red' }}>
            <div
              style={{
                position: 'absolute',
                right: '-40px',
                top: '-40px',
                border: '1px solid #000',
                cursor: 'pointer',
                background:'#fff'
                //    right: '-5%',
                //  marginTop: '-7%'
              }}
              onClick={closeModal}
            //   onClose={handleClose}
            >
              <CloseIcon />
            </div>
          </div>
          <div className='text-center'>
            <Typography sx={{ marginTop: '5%' }} id='modal-modal-title' variant='h5' component='h2' style={{ fontweight: 'bold' }}>
              OOPS!
            </Typography>
            <Typography id='modal-modal-description' sx={{ mt: 2 }}>
              { location?.state?.message ?  location?.state?.message : 'This QR is not registered.' }
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                mt: 4,
                display: 'block',
                mx: 'auto',
                borderColor: 'gray', 
                color: 'gray',       
                '&:hover': {
                  borderColor: 'darkgray', 
                  backgroundColor: 'rgba(128, 128, 128, 0.1)', 
                },
              }}
            >
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
