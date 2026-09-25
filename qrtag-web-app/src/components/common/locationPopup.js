import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate, useParams } from 'react-router-dom';
import { GetChannelID, GetWidgetChannelID, RecieveChannelList } from '../../services/chat';
import { UpdateStore, Store as ContextStore } from '../../StoreContext';

// import { Store } from '../../StoreContext';
import { PulseLoader } from 'react-spinners';
import { detectIncognito } from 'detect-incognito';
import { toast } from 'react-toastify';
import { getToken } from 'firebase/messaging';
import { messaging } from '../../config/firebase';
import { HandleTempUser } from '../../services/user';
import { determineDeviceType } from '../../utils/functions';
import mixpanel from 'mixpanel-browser';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '20px',
  boxShadow: 24,
  padding: '1% 0',
  '@media (max-width: 500px)': {
    width: '90%',
  }
}

export default function LocationModal(props) {

  const { loggedIn, user, channels, firebaseToken } = ContextStore();
  const [permission, setPermission] = React.useState(null);
  const nav = useNavigate();
  const updateStore = UpdateStore();
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleOpen = () => {
    mixpanel.track('Chat with owner', {
      buttonName: "Chat with owner button"
    });
    setOpen(true)
  };

  const handleClose = () => setOpen(false);
  const data = props?.data;
  const isWidget = props?.widget ? true : false;
  React.useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification?.permission);
    }
  }, []);
  React.useEffect(() => {
    const device_type = determineDeviceType();
    if (!user.id && !creating) {
      setCreating(true)
      HandleTempUser({ registration_id: firebaseToken || "", device_type });
    }
  }, [firebaseToken, permission]);

  return (
    <>
      <button
        style={{ backgroundColor: (props.status === 'lost') ? '#ef4444' : '#8acd42', borderRadius: '10px' }} 
        className='found_btn'
        onClick={props.handleButton ?? handleOpen}
        disabled={props.disabled}
      >
        {props.btnText}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        {props.location ? (
          <Box sx={style}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p>Allow this app to use your location?</p>
              <div
                style={{
                  height: '1px',
                  background: '#DDDDDD',
                  width: '100%',
                  margin: '3% 0',
                  padding: '0',
                }}
              />
              <p
                style={{ margin: '2% 0', fontWeight: '600', color: '#348E3D' }}
              >
                Allow Once
              </p>
              <div
                style={{
                  height: '1px',
                  background: '#DDDDDD',
                  width: '100%',
                  margin: '3% 0',
                  padding: '0',
                }}
              />
              <p
                style={{ margin: '2% 0', fontWeight: '600', color: '#1C1C1C' }}
              >
                Allow While Using
              </p>
              <div
                style={{
                  height: '1px',
                  background: '#DDDDDD',
                  width: '100%',
                  margin: '3% 0',
                  padding: '0',
                }}
              />
              <p
                style={{ margin: '2% 0', fontWeight: '600', color: '#FF5757' }}
              >
                Don’t Allow
              </p>
            </div>
          </Box>
        ) : (
          <Box sx={style}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 20,
              }}
            >
              <p>Chat with owner</p>

              <div
                style={{
                  height: '1px',
                  background: '#DDDDDD',
                  width: '100%',
                  padding: '0',
                }}
              />
              <Button
                onClick={() => {
                  mixpanel.track('Start Chat', {
                    buttonName: "Start Chat Button"
                  });
                  localStorage.setItem('uid', params.uid);
                  setLoading(true);
                  {(isWidget) ? 
                    GetWidgetChannelID(
                      {
                        send_by: user.id,
                        send_to: (data?.data && data?.data?.user) ? data?.data?.user : data?.user_id,
                        widget: data?.data.id
                      },
                      ({ success, data }) => {
                        success &&
                          RecieveChannelList(user.id, () => {
                            setLoading(false);
                            nav('/chat', { state: { currentChannelId: data?.channel_id } });
                          });
                      }
                    )
                  :
                    GetChannelID(
                      {
                        send_by: user.id,
                        send_to: (data?.data && data?.data?.user) ? data?.data?.user : data?.user_id,
                        item: data?.id,
                      },
                      ({ success, data }) => {
                        success &&
                          RecieveChannelList(user.id, () => {
                            setLoading(false);
                            nav('/chat', { state: { currentChannelId: data?.channel_id } });
                          });
                      }
                    )
                  }
                }}
                style={{
                  // margin: "2% 0",
                  height: 60,
                  width: '100%',
                  fontWeight: '600',
                  color: '#0C80A0',
                }}
              >
                {!loading ? (
                  <div> Start Chat</div>
                ) : (
                  <PulseLoader size={15} color='#0C80A0' />
                )}
              </Button>
              <div
                style={{
                  height: '1px',
                  background: '#DDDDDD',
                  width: '100%',
                  padding: '0',
                }}
              />
              {!loggedIn &&
                <div style={{ width: "100%" }}>
                  <Button
                    onClick={() => {
                      mixpanel.track('Create an Account', {
                        buttonName: "Create Account Button"
                      });
                      localStorage.setItem('uid', params.uid);
                      nav('/signup');
                    }}
                    style={{
                      // margin: "2% 0",
                      height: 60,
                      width: '100%',
                      fontWeight: '600',
                      color: '#0C80A0',
                    }}
                  >
                    Create an account
                  </Button>
                </div>
              }
            </div>
          </Box>
        )}
      </Modal>
    </>
  );
}
