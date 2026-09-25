/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../StoreContext';
import { CheckCircle, CheckCircleOutline, CheckCircleOutlineOutlined, InfoOutlined } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function TopNavbar() {

  const { user, loggedIn, messages } = Store();
  const nav = useNavigate();
  const [message1, setMessage1] = useState(null)
  const [message2, setMessage2] = useState(null)

  const checkIfUserIsSecured = () => {
    return (
      user?.subscription_plan != null ||
      user?.is_honorary === true ||
      user?.is_flyer_activated === true ||
      user?.is_trial === true
    )
  }

  useEffect(() => {
    if (messages) {
      const msg1 = messages.find(item => item.key === 'not_secured_message');
      const msg2 = messages.find(item => item.key === 'not_secured_cta_message');
  
      if (msg1) setMessage1(msg1?.value);
      if (msg2) setMessage2(msg2?.value);
    }
  }, [messages]);

  return (
    <>
      <Stack className='container' sx={{ width: '100%' }} spacing={2}>
        {(loggedIn === true && checkIfUserIsSecured() === false) &&
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <Alert severity="error" className={`${(message1) ? "" : "hide-icon"}`} style={{ color: '#d34053', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}><>{message1 || ''} <span onClick={() => nav('/subscription')} style={{ cursor: 'pointer', color: '#3c50e0', textDecoration: 'underline' }}>{message2 || 'Act Now!'}</span></></Alert>
          </div>
        }
      </Stack>
    </>
  );
}

export default TopNavbar;
