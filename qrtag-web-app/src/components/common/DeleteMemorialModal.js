import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Axios from '../../config/axios';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function BasicModal({ open, setOpen, itemId, getList, }) {

  const [loading, setLoading] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };
  const closeModal = () => {
    setOpen(false);
  };


  const handleDelete = async () => {
    try {
      await Axios.delete(`/common/digital-memorial/${itemId}/`)
      toast.success('Digital Memorial deleted successfully.')
      setOpen(false)
      getList()
    } catch (error) {
      console.error(error)
      const message = error?.response?.data?.message || 'Failed to delete memorial. Please try again.'
      toast.error(message)
    }
  }

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
            Confirm Delete Memorial
          </Typography>
          <Typography id="modal-modal-description" className='text-center' sx={{ mt: 2, mb: 3 }}>
            Are you sure you want to Delete this Memorial ?
          </Typography>

          <div className='mt-1 w-50'>

            <Button
              type="submit"
              variant="outlined"
              sx={{
                mt: 3,
                mb: 2,
                display: 'block',
                width: '100%',
                height: '50px',
                mx: 'auto',
                borderColor: '#1e5af9',
                borderRadius: '5px',
                backgroundColor: '#1e5af9',
                color: '#fff',
                '&:hover': {
                  borderColor: '#1e5af9',
                  color: '#fff',
                  backgroundColor: '#1e5af9',
                },
              }}
              onClick={handleDelete}
            >
              {!loading ? (
                <div>Delete</div>
              ) : (
                <PulseLoader size={15} color='#ffffff' />
              )}
            </Button>
          </div>

        </Box>
      </Modal>
    </div>
  );
}
