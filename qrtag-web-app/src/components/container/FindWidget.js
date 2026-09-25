/* eslint-disable jsx-a11y/alt-text */
import { getCurrentPosition } from 'geolocation';
import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Axios from '../../config/axios';
import { Store, UpdateStore } from '../../StoreContext';
import BasicModal from '../common/locationPopup';
import Geocode from "react-geocode";
import { firebaseConfig } from '../../config/firebase';
import { BeatLoader } from 'react-spinners'
import Breadcrumbs from '../common/Breadcrumbs'
import CustomCookies from '../common/Cookies'
import Navbar from '../common/Navbar'
import GooglePlay from '../../images/Google Play.png'
import AppStore from '../../images/App Store.png'
import Footer from '../common/Footer.js'
import '../css/App.css'

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
  const [loading, setLoading] = useState(true)

  const getLostItems = async (latitude, longitude) => {
    await Geocode.fromLatLng(latitude, longitude).then(
      (response) => {
        setLongitude(longitude)
        setLatitude(latitude)

        setLoading(true)
        Axios.post(`/users/widget/process-token/`, {
          latitude,
          longitude,
          token: wid
        })
          .then((response) => {
            setLoading(false)
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
            setLoading(false)
            navigate('/about', {
              state: { error: true, message: error.response?.data?.message ? error.response?.data?.message : "Something went wrong. Please try again later." },
            });
          });
      },
      (error) => {
        console.error(error);
        setLoading(false)
      }
    );
  };
  const getLostItemsWithoutLoc = async () => {
    setLoading(true)
    Axios.post(`/users/widget/process-token/`, { token: wid })
      .then((response) => {
        setLoading(false)
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
        setLoading(false)
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
      <div>
        <Navbar />
      </div>

      {(open) ? <>
        <CustomCookies handleClose={handleClose} handleDeclineClose={handleDeclineClose} />
      </> : <>
        <Breadcrumbs breadCrumbParent='Home' breadCrumbActive='Item Details' />
      </>}

      <div className='py-3 py-lg-5 p-3 p-md-0' style={{ backgroundColor: '#f2f4f7' }}>
        <div className='container finder_layout p-2 ' style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '8px' }}>

          {(loading) ? <>
            <div className='text-center w-100' style={{ minHeight: "300px", marginTop: "8rem" }}><BeatLoader /></div>
          </> : <>
            <div className='container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
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
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <div className='mt-5'>
                  <h5 className='my-3'>
                    Download the QRTag.it App Now
                  </h5>
                  <p style={{ color: '#64748B', fontSize: '14px', fontWeight: 400, }}>
                    What are you waiting for? Download the QRTag.it App now! The user interface of QRTag.it is simple and easy to navigate
                  </p>
                </div>
                <div className='d-flex'>
                  <a href="https://apps.apple.com/us/app/qrtag-it/id6444082603" target="_blank">
                    <img
                      src={AppStore}
                      style={{ width: '120px', height: 'auto', marginRight: '10px' }}
                      alt='App Store'
                    />
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.withered_feather_36062" target="_blank">
                    <img
                      src={GooglePlay}
                      style={{ width: '120px', height: 'auto' }}
                      alt='Google Play'
                    />
                  </a>
                </div>
              </div>
            </div>
          </>}
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
}

export default FindWidget;
