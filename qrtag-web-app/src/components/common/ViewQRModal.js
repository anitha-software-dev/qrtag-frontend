import { useState, useRef } from 'react';
import { Drawer, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Store } from '../../StoreContext';

export default function ViewQRModal({ open, setOpen, openData }) {

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
    <Drawer anchor="right" open={open} onClose={handleClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 3 } }}
    >
      <IconButton onClick={closeModal} sx={{ position: 'absolute', top: 10, right: 10 }}>
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: '#1e5af9' }}>
        View QRTag
      </Typography>


      <div className='details_div w-100 mt-3'>
        <div className='row g-0 border rounded overflow-hidden mb-3'>
          {(openData && openData.item_details) && <>
            <div className='col-md-12 border-end border-bottom px-3 py-2'>
              <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }} >Item Name:</p>
              <p style={{ fontWeight: 600 }}>{openData.item_details?.name}</p>
            </div>
            <div className='col-md-6 col-6 border-end border-bottom px-3 py-2'>
              <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }} >Item ID:</p>
              <p style={{ fontWeight: 600 }}>#{openData.item_details?.id}</p>
            </div>
            <div className='col-md-6 col-6 border-end  border-bottom px-3 py-2'>
              <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Manufacturer</p>
              <p style={{ fontWeight: 600 }}>{openData.item_details?.manufacturer}</p>
            </div>
            <div className='col-md-6 col-6 border-end px-3 py-2'>
              <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Serial Number</p>
              <p style={{ fontWeight: 600 }}>{openData.item_details?.serial_no}</p>
            </div>
            <div className='col-md-6 col-6 px-2 py-2'>
              <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Estimated Value</p>
              <p style={{ fontWeight: 600 }}>${openData.item_details?.estimated_value}</p>
            </div>
            <div className='col-md-12 border-top px-3 py-2'>
              <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Description:</p>
              <p style={{ color: '#1C2434' }} className='LostItem_Description'>
                {openData.item_details?.description}
              </p>
            </div>
          </>}
          <div className='col-md-12 border-top px-3 py-2'>
            <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>QR Code:</p>
            <img
              src={openData && openData?.qr_code}
              style={{ width: '60%', borderRadius: '8px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

    </Drawer>
  );
}