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

function LostItem() {

  let { uid } = useParams();
  const navigate = useNavigate();
  const { user, loggedIn } = Store();
  const [lostItem, setLostItem] = useState({});
  const [mainImage, setMainImage] = useState();
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
        const address = response?.results[0]?.formatted_address;
        setLoadng(true)
        Axios.post(`/looser/find-item/${uid}/`, {
          latitude,
          longitude,
          location: address.slice(0, 255)
        })
          .then((response) => {
            setLoadng(false)
            if (Object.values(response?.data || {}).length === 0) {

              navigate('/about', {
                state: { error: true },
              });

              // let device_type = determineDeviceType()
              // let device = {
              //   iOS: () => {
              //     window.location.href = "https://testflight.apple.com/join/PK1Ua4LJ"
              //   },
              //   Android: () => {
              //     window.location.href = "https://play.google.com/store/apps/details?id=com.withered_feather_36062"
              //   },
              //   web: () => {

              //     navigate('/about', {
              //       state: { error: true },
              //     });
              //   }
              // }[device_type]
              // device()
              return
            }

            if (!response.data) {
              window.location = '/*';
            }

            setLostItem(response?.data);
            localStorage.setItem('itemDetail', JSON.stringify(response?.data));
            if (response?.data?.photos?.length) {
              setMainImage(response?.data?.photos[0]?.photo);
            }

            if (uid) {
              sessionStorage.setItem('uuidcode', uid)
            }
          })
          .catch((error) => {
            setLoadng(false)
            navigate('/about', {
              state: { error: true },
            });

            // let device_type = determineDeviceType()
            // let device = {
            //   iOS: () => {
            //     window.location.href = "https://testflight.apple.com/join/PK1Ua4LJ"
            //   },
            //   Android: () => {
            //     window.location.href = "https://play.google.com/store/apps/details?id=com.withered_feather_36062"
            //   },
            //   web: () => {

            //     navigate('/about', {
            //       state: { error: true },
            //     });
            //   }
            // }[device_type]
            // device()
          });
        // console.log(address);
      },
      (error) => {
        console.error(error);
        setLoadng(false)
      }
    );
  };
  const getLostItemsWithoutLoc = async () => {
    setLoadng(true)
    Axios.post(`/looser/find-item/${uid}/`)
      .then((response) => {
        setLoadng(false)
        if (Object.values(response?.data || {}).length === 0) {

          navigate('/about', {
            state: { error: true },
          });

          // let device_type = determineDeviceType()
          // let device = {
          //   iOS: () => {
          //     window.location.href = "https://testflight.apple.com/join/PK1Ua4LJ"
          //   },
          //   Android: () => {
          //     window.location.href = "https://play.google.com/store/apps/details?id=com.withered_feather_36062"
          //   },
          //   web: () => {

          //     navigate('/about', {
          //       state: { error: true },
          //     });
          //   }
          // }[device_type]
          // device()
          return
        }

        if (!response.data) {
          window.location = '/*';
        }

        setLostItem(response?.data);
        localStorage.setItem('itemDetail', JSON.stringify(response?.data));
        if (response?.data?.photos?.length) {
          setMainImage(response?.data?.photos[0]?.photo);
        }
        if (uid) {
          sessionStorage.setItem('uuidcode', uid)
        }
      })
      .catch((error) => {
        setLoadng(false)
        navigate('/about', {
          state: { error: true },
        });

        // let device_type = determineDeviceType()
        // let device = {
        //   iOS: () => {
        //     window.location.href = "https://testflight.apple.com/join/PK1Ua4LJ"
        //   },
        //   Android: () => {
        //     window.location.href = "https://play.google.com/store/apps/details?id=com.withered_feather_36062"
        //   },
        //   web: () => {

        //     navigate('/about', {
        //       state: { error: true },
        //     });
        //   }
        // }[device_type]
        // device()
      });
  }

  const handleFoundButton = () => {
    if (lostItem?.status === 'lost') {
      Axios.post(`/looser/items/${lostItem?.id}/mark-found/`)
        .then((res) => {
          getLostItems(latitude, longitude)
          toast.success(res?.data?.status);
        })
        .catch((err) => console.log(err));
    } else {
      Axios.post(`/looser/items/${lostItem?.id}/mark-lost/`)
        .then((res) => {
          getLostItems(latitude, longitude)
          toast.success(res?.data?.status);
        })
        .catch((err) => console.log(err));
    }
  };
  // console.log(lostItem, 'lt')
  useEffect(() => {
    if (lostItem?.status === 'lost') {
      mixpanel.track('Lost Item', {
        itemName: lostItem?.name,
        itemId: lostItem?.item_id,
        status: lostItem?.status,
        // belongs_to: lostItem?.user_id
      });
    }
  }, [lostItem])

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
    if (uid) {
      setCookie('uid', uid)
      updateStore({ cookies })
      setOpen(false);
    }
  };
  const handleDeclineClose = () => {
    setOpen(false);
  };

  function isPublic(key) {
    const visibility = lostItem?.visibility;
    if (!visibility || Object.keys(visibility).length === 0) {
      return true;
    }
    return visibility.hasOwnProperty(key) && visibility[key] === "public";
  }

  const [Thumbnail, ...photos] = lostItem?.photos || [];

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
        <div className='LostItem_Container'>
          {(isPublic('name')) && <>
            <h2>{lostItem?.name}</h2>
          </>}

          <div className='LostItem_BodyDiv'>
            <div className='LostItem_ImageDiv'>
              <div className='LostItem_UpperImageDiv'>
                <img src={Thumbnail?.photo} />
              </div>
              {photos.length > 0 &&
                <div className='LostItem_LowerImageDiv'>
                  {photos?.map((item) => {
                    return (
                      <img
                        onClick={() => setMainImage(item?.photo)}
                        src={item?.photo}
                      />
                    );
                  })}
                </div>
              }
            </div>
            <div className='LostItem_TextDiv'>
              <div className='LostItem_TitleDiv'>
                <h3>Lost Item</h3>
                {/* <p>Edit Details</p> */}
              </div>
              <div className='LostItem_DetailDiv'>
                {lostItem?.id &&
                  <p>
                    <b>Item ID:</b> {lostItem?.id}
                  </p>
                }
                {lostItem?.item_type && lostItem?.item_type?.name && <>
                  <p className='LostItem_Manufacturer'>
                    <b>Item Type: </b>
                    {lostItem?.item_type && lostItem?.item_type?.name ? lostItem?.item_type?.name : ""}
                  </p>
                </>}
                {lostItem?.serial_no && (isPublic('serial') || isPublic('serial_no')) && <>
                  <p className='LostItem_Manufacturer'>
                    <b>Serial Number: </b>
                    {lostItem?.serial_no}
                  </p>
                </>}
                {lostItem?.estimated_value && <>
                  <p className='LostItem_Manufacturer'>
                    <b>Estimated Value: </b>
                    {lostItem?.estimated_value}
                  </p>
                </>}
                {lostItem?.manufacturer && isPublic('manufacturer') && <>
                  <p className='LostItem_Manufacturer'>
                    <b>Manufacturer: </b>
                    {lostItem?.manufacturer}
                  </p>
                </>}
                {lostItem.description && isPublic('description') &&
                  <>
                    <p>
                      <b>Description:</b>
                    </p>
                    <p className='LostItem_Description'>{lostItem?.description}</p>
                  </>
                }
              </div>
              {user.id === lostItem.user_id && (
                <>
                  <div className='LostItem_Divider' />
                  <div className='LostItem_HistoryDiv'>
                    <p className='LostItem_History_H'>
                      <b>History</b>
                    </p>
                    {lostItem?.history?.slice()
                      .sort((a, b) => new Date(b?.date) - new Date(a?.date))
                      .map((item) => {
                        return (
                          <>
                            <div className='LostItem_History_P'>
                              <p>
                                <b>Item {item?.status}</b>
                              </p>
                              <p>
                                {new Date(item?.date).toLocaleTimeString()} |
                                {new Date(item?.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className='LostItem_History_P'>
                              <p>
                                <b className='locaion_p'>Scanned Location</b>
                              </p>
                              <div className='location_div'>
                                <p className='locaion_p'>{item?.location}</p>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    {/* <div className='LostItem_History_P'>
                  <p style={{ color: '#831212' }}>
                    <b>Item Lost</b>
                  </p>
                  <p>08:55 PM | 06/30/22</p>
                </div> */}
                  </div>
                </>
              )}
              <div className='LostItem_Divider' />
              <div className='LostItem_BtnDiv'>
                <p>
                  This item is currently <span>{lostItem?.status}</span>.
                </p>
                {loggedIn && user.id === lostItem.user_id && (
                  <div className='LostItem_FoundBtn'>
                    <BasicModal
                      btnText={lostItem?.status === "lost" ? 'Mark as found' : "Mark as lost"}
                      btnColor='#ffffff'
                      location
                      handleButton={handleFoundButton}
                    />
                  </div>
                )}
                {user.id !== lostItem.user_id && (
                  <div className='LostItem_ChatBtn'>
                    <BasicModal data={lostItem} btnText='Chat with owner' />
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

export default LostItem;
