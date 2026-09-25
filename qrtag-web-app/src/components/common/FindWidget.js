/* eslint-disable jsx-a11y/alt-text */
import { getCurrentPosition } from 'geolocation';
import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Axios from '../../config/axios';
import { Store, UpdateStore } from '../../StoreContext';
import { determineDeviceType } from '../../utils/functions';
import BasicModal from './locationPopup';
import Geocode from "react-geocode";
import { firebaseConfig } from '../../config/firebase';
import mixpanel from 'mixpanel-browser';
import { BeatLoader } from 'react-spinners'

Geocode.setApiKey(firebaseConfig.apiKey);

function FindWidget() {

  let { wid } = useParams();
  const navigate = useNavigate();
  const { user, loggedIn } = Store();
  const [lostItem, setLostItem] = useState(null);
  const [cookies, setCookie] = useCookies(['uid'])
  const updateStore = UpdateStore();
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()
  const [loading, setLoadng] = useState(true)

  const getLostItems = async (latitude, longitude) => {
    await Geocode.fromLatLng(latitude, longitude).then(
      (response) => {
        setLongitude(longitude)
        setLatitude(latitude)

        setLoadng(true)
        Axios.post(`/users/widget/process-token/`, {
          latitude,
          longitude,
          token: wid
        })
          .then((response) => {
            setLoadng(false)
            if (Object.values(response?.data || {}).length === 0) {
              navigate('/about', {
                state: { error: true, message: "Invalid token. No matching widget found" },
              });
              return
            }

            if (!response.data) {
              window.location = '/*';
            }

            setLostItem(response?.data);
            localStorage.setItem('widgetDetail', JSON.stringify(response?.data));

            if (wid) {
              sessionStorage.setItem('widgetcode', wid)
            }
          })
          .catch((error) => {
            console.log(error.response)
            setLoadng(false)
            navigate('/about', {
              state: { error: true, message: error.response?.data?.message ? error.response?.data?.message : "Something went wrong. Please try again later." },
            });
          });
      },
      (error) => {
        console.error(error);
        setLoadng(false)
      }
    );
  };
  const getLostItemsWithoutLoc = async () => {
    setLoadng(true)
    Axios.post(`/users/widget/process-token/`, { token: wid })
      .then((response) => {
        setLoadng(false)
        if (Object.values(response?.data || {}).length === 0) {
          navigate('/about', {
            state: { error: true },
          });
          return
        }

        if (!response.data) {
          window.location = '/*';
        }

        setLostItem(response?.data);
        localStorage.setItem('widgetDetail', JSON.stringify(response?.data));

        if (wid) {
          sessionStorage.setItem('widgetcode', wid)
        }
      })
      .catch((error) => {
        setLoadng(false)
        navigate('/about', {
          state: { error: true },
        });
      });
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getLostItems(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          getLostItemsWithoutLoc()
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      toast.error(error)
    }
  }, [])

  useEffect(() => {
    if (cookies?.uid) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, []);

  const handleClose = () => {
    if (wid) {
      setCookie('wid', wid)
      updateStore({ cookies })
      setOpen(false);
    }
  };
  const handleDeclineClose = () => {
    setOpen(false);
  };

  return (
    <>
      {open && <div className="CookieBanner_Div">
        <div className="CookieBanner_TypoDiv">
          <p className="CookieBanner_desp">
            We use our own and third-party cookies to personalize content and to analyze web traffic.
          </p>
        </div>
        <div className="CookieBanner_BtnDiv">
          <button onClick={handleClose} className="CookieBanner_AgreeBtn">
            Agree
          </button>
          <button onClick={handleDeclineClose} className="CookieBanner_DeclineBtn" >
            Decline
          </button>
        </div>
      </div>}

      {(loading) ? <>
        <div className='text-center w-100' style={{ minHeight: "300px", marginTop: "8rem" }}><BeatLoader /></div>
      </> : <>
        <div className='container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className='LostItem_BodyDiv' style={{ minHeight: "350px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className='LostItem_TextDiv'>
              <div className='LostItem_BtnDiv'>
                {lostItem && user.id !== lostItem.data.user && (
                  <div className='LostItem_ChatBtn'>
                    <BasicModal widget={true} data={lostItem} btnText='Chat with owner' />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>}
    </>
  );
}

export default FindWidget;
