
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApplyCouponModal from '../common/ApplyCouponModal'
import UnlockFeatureModal from '../common/UnlockFeatureModal'
import QRScanModal from '../common/QRScanModal'
import { Store, UpdateStore } from '../../StoreContext'
import Joyride, { ACTIONS, EVENTS, ORIGIN } from 'react-joyride'
import FeedbackModal from '../common/FeedbackModal';
import Axios from '../../config/axios'
import { determineDeviceType } from '../../utils/functions'

const AppGuide = ({ setStartGuide, setOpen, setOpenMenu, toggleSubMenu, overlayRef, floaterRef }) => {

  const { user, loggedIn, messages } = Store();
  const nav = useNavigate()
  const updateStore = UpdateStore();
  const device_type = determineDeviceType()

  const [applycoupon, setApplyCoupon] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [featureModal, setFeatureModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [steps, setSteps] = React.useState([]);

  const [tourStarted, setTourStarted] = useState(false);
  const [tourActive, setTourActive] = useState(true);
  const [stepIndex, setStepIndex] = useState(0)

  const [feedback, setFeedback] = React.useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  const updateScreenSize = () => {
    setIsMobile(window.innerWidth <= 767);
  };

  useEffect(() => {
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  useEffect(() => {
    if (messages) {
      const tutorial = messages.filter((item) => item.key === 'tutorial_content')
      if (tutorial && tutorial.length > 0) {
        const data = JSON.parse(tutorial[0].value)

        const formattedData = data.map(item => {
          let target;
          let placement;
          let disableBeacon = false
          switch (item.title) {
            case "Add Item":
              target = '.add-item-button';
              placement = 'top';
              disableBeacon = true
              break;
            case "Scanner Feature":
              target = null;
              placement = 'auto';
              break;
            case "Feedback":
              target = '.feedback';
              placement = 'auto';
              break;
            case "Chat Feature":
              target = isMobile ? '.mobi-chats' : '.chats';
              placement = 'auto';
              break;
            case "Edit Profile":
              target = '.editprofile';
              placement = 'auto';
              break;
            case "Notifications":
              target = isMobile ? '.mobi-notifications' : '.notifications';
              placement = 'auto';
              break;
            case "My QR Tags":
              target = '.myqrtags';
              placement = 'auto';
              break;
            case "My Stuff":
              target = isMobile ? '.mobi-mystuff' : '.mystuff';
              placement = 'auto';
              disableBeacon = false
              break;
            case "Store":
              target = null;
              placement = 'top';
              break;
            default:
              target = null;
          }

          return {
            target,
            title: (
              <div style={{ marginLeft: "8px", fontSize: '20px', fontWeight: 'bold', textAlign: 'left' }}>
                {item.title}
              </div>
            ),
            content: (
              <div style={{ textAlign: 'justify' }}>
                {item.content}
              </div>
            ),
            placement,
            disableBeacon
          };
        });

        setSteps(formattedData.filter((item) => item.target))
      }
    }
  }, [messages])

  useEffect(() => {
    setTourStarted(true)
  }, [steps])

  const handleComplete = () => {
    if (setStartGuide) {
      setStartGuide(false)
    }

    if (user && user.is_tutorial_complete === false) {

      Axios.patch('/users/detail/', { is_tutorial_complete: true })
        .then((response) => {
          if (response?.data) {
            localStorage.setItem('user', JSON.stringify(response?.data));
            updateStore({ user: response?.data });
            localStorage.setItem('userData', JSON.stringify(response?.data));
          }
        })
        .catch((error) => {
          console.log(error)
        });

    }
  }

  return (
    <>

      {(tourStarted) && <>
        <Joyride
          steps={steps}
          stepIndex={stepIndex}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          run={tourActive}
          disableCloseOnEsc={true}
          hideCloseButton={true}
          disableOverlayClose={true}
          scrollToFirstStep={true}
          locale={{
            skip: 'Got it',
            last: 'Done'
          }}
          styles={{
            options: {
              arrowColor: '#fff',
              backgroundColor: '#fff',
              overlayColor: 'rgba(0, 0, 0, 0.5)',
              primaryColor: '#1e5af9',
              textColor: '#333',
              zIndex: 1300,
            },
            buttonNext: {
              backgroundColor: '#1e5af9',
              color: '#fff',
              borderRadius: '20px',
              padding: '5px 20px',
              height: '40px',
              fontSize: '14px'
            },
            buttonSkip: {
              backgroundColor: '#1e5af9',
              color: '#fff',
              borderRadius: '20px',
              padding: '5px 20px',
              height: '40px',
              fontSize: '14px'
            },
            beacon: {
              display: 'none'
            },

          }}

          callback={(data) => {
            const { status, type, action, origin, index, lifecycle, size } = data;

            if (status === 'finished' || status === 'skipped' || (action === 'next' && index === size - 1 && lifecycle === 'complete')) {
              setTourActive(false);
              setTourStarted(false)
              setOpenModal(false)
              setFeedback(false)
              handleComplete()

              return
            }

            if (type === 'step:after' || type === 'step:before') {
              const overlayElement = document.querySelector('.react-joyride__overlay');
              if (overlayElement) {
                overlayRef.current = overlayElement;
              }
              const floaterElement = document.querySelector('.__floater');
              if (floaterElement) {
                floaterRef.current = floaterElement;
              }
            }

            if (type === 'step:after') {
              let newStepIndex = index;

              if (action === 'next') {
                if (index === 0) {
                  // setOpenModal(true);
                  setOpenModal(false);
                  setTimeout(() => {
                    setOpenMenu(true)
                    setOpen(true)
                    toggleSubMenu('security')
                  }, 1);
                  newStepIndex = 1;
                } else if (index === 1) {
                  if (isMobile) {
                    setTimeout(() => {
                      setOpenMenu(true)
                      setOpen(true)
                    }, 1);
                  } else {
                    setOpenMenu(false)
                    setOpen(false)
                  }
                  newStepIndex = 2;
                } else if (index === 2) {
                  setTimeout(() => {
                    setOpenMenu(true)
                    setOpen(true)
                    toggleSubMenu('myaccount')
                  }, 1);
                  newStepIndex = 3;
                } else if (index === 3) {
                  if (isMobile) {
                    setTimeout(() => {
                      setOpenMenu(true)
                      setOpen(true)
                    }, 1);
                  } else {
                    setOpenMenu(false)
                    setOpen(false)
                  }
                  newStepIndex = 4;
                } else if (index === 4) {
                    setTimeout(() => {
                      setOpenMenu(true)
                      setOpen(true)
                      toggleSubMenu('subscription')
                    }, 1);
                  newStepIndex = 5;
                }
              } else if (action === 'prev') {

                if (index === 5) {
                  setTimeout(() => {
                    setOpenMenu(true)
                    setOpen(true)
                    toggleSubMenu('subscription')
                  }, 1);
                  newStepIndex = 4;
                } else if (index === 4) {
                  setTimeout(() => {
                    setOpenMenu(true)
                    setOpen(true)
                    toggleSubMenu('myaccount')
                  }, 1);
                  newStepIndex = 3;
                } else if (index === 3) {
                  if (isMobile) {
                    setTimeout(() => {
                      setOpenMenu(true)
                      setOpen(true)
                    }, 1);
                  } else {
                    setOpenMenu(false)
                    setOpen(false)
                  }
                  newStepIndex = 2;
                } else if (index === 2) {
                  setOpenModal(false);
                  setTimeout(() => {
                    setOpenMenu(true)
                    setOpen(true)
                    toggleSubMenu('security')
                  }, 1);
                  newStepIndex = 1;
                } else if (index === 1) {
                  // setOpenModal(true);
                  setOpenMenu(false)
                  setOpen(false)
                  newStepIndex = 0;
                }
              }
              setTimeout(() => {
                setStepIndex(newStepIndex);
              }, 100);
            }

          }}

        />
      </>}


      {/* {applycoupon && (
        <ApplyCouponModal
          open={applycoupon}
          setOpen={setApplyCoupon}
        />
      )} */}

      {featureModal && (
        <UnlockFeatureModal
          open={featureModal}
          setOpen={setFeatureModal}
        />
      )}

      {openModal && (
        <QRScanModal className="scanner"
          setItemId={setItemId}
          open={openModal}
          setOpen={setOpenModal}
        />
      )}

      {feedback && (
        <FeedbackModal className="feedback"
          open={feedback}
          setOpen={setFeedback}
        />
      )}


    </>
  )
}

export default AppGuide