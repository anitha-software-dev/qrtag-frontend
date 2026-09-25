/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from 'react';
import LogoText from '../../images/logotext.svg';
import SignInArrow from '../../images/signin-arrow.png'
import Logo from '../../images/logo-new.png'
import NavLogo from '../../images/nav-logo.png'
import MyStuffIcon from '../../images/mystuff-icon.png';
import MyStuffActive from '../../images/mystuff-active-icon.png';
import ChatIcon from '../../images/chat-icon.png'
import ChatActive from '../../images/chat-active-icon.png'
import NotifyIcon from '../../images/notify-icon.png'
import NotifyActive from '../../images/notify-active-icon.png'
import SettingsIcon from '../../images/settings-icon.png'
import SettingsActive from '../../images/settings-active-icon.png'
import Avatar from '../../images/avatar.png';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Badge, Box, Collapse, List, ListItemButton, ListItemText, Tab, Tabs } from '@mui/material';
import { PulseLoader } from 'react-spinners';
import { Store, UpdateStore } from '../../StoreContext';
import ConfirmationModel from '../common/ConfirmationModel';
import ConfirmationDeleteModel from '../common/ConfirmationDeleteModel';
import FeedbackModal from '../common/FeedbackModal';
import ApplyCouponModal from '../common/ApplyCouponModal'
import { determineDeviceType } from '../../utils/functions';
import mixpanel from 'mixpanel-browser';
import { AutoStoriesOutlined, BarChartOutlined, ChatRounded, CircleOutlined, HighlightOffOutlined, PersonOffOutlined, ShoppingBagOutlined, StoreOutlined } from '@mui/icons-material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import PlanCancellationModal from './PlanCancellationModal';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppGuide from './AppGuide';
import SurveyModal from './SurveyModal';
import moment from 'moment-timezone'

function Navbar() {

  const { user, loggedIn, messages, notification, cartItems } = Store();
  const nav = useNavigate();
  const updateStore = UpdateStore();
  const location = useLocation();
  const { state } = useLocation();
  const [open, setOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [loggedOutMenu, setLoggedOutMenu] = React.useState(false);
  const [cancel, setCancel] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [isCancel, setIsCancel] = useState(false);

  const [loading, setLoading] = React.useState(false);
  const [deleteAccount, setDeleteAccount] = React.useState(false);
  const [feedback, setFeedback] = React.useState(false);
  const [applycoupon, setApplyCoupon] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [startGuide, setStartGuide] = React.useState(state?.appGuide || false);
  const [questionModal, setQuestionModal] = useState(false)
  const [value, setValue] = useState(location.pathname)

  const [subMenuStates, setSubMenuStates] = useState({
    subscription: false,
    security: false,
    manageaccount: false,
    aboutus: false
  })

  useEffect(() => {
    setValue(location.pathname)
  }, [location.pathname])

  const toggleSubMenu = (menu) => {
    setSubMenuStates(prev => {
      const isCurrentlyOpen = prev[menu]

      const newStates = {
        subscription: false,
        security: false,
        manageaccount: false,
        aboutus: false
      }

      return {
        ...newStates,
        [menu]: !isCurrentlyOpen
      }
    })
  }

  const getCookie = (name) => {
    let cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      let [key, value] = cookie.trim().split('=');
      if (key === name) return value;
    }
    return null;
  }

  useEffect(() => {
    if (getCookie('modalShown')) {
      setIsHidden(true)
    } else {
      setIsHidden(false)
    }
  }, [])

  const handleClick = () => {
    setOpen(!open);
  };
  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
  };
  const handleLoggedOutMenuClick = () => {
    setLoggedOutMenu(!loggedOutMenu);
  };

  const device_type = determineDeviceType()
  const menuRef = useRef(null);
  const burgerMenu = useRef(null);
  const profileInfo = useRef(null);
  const loggedOut = useRef(null);
  const overlayRef = useRef(null);
  const floaterRef = useRef(null);
  const listRefs = useRef([]);

  const listRef = (el) => {
    if (el && !listRefs.current.includes(el)) {
      listRefs.current.push(el);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && overlayRef.current.contains(event.target)) {
        return false
      }
      if (floaterRef.current && floaterRef.current.contains(event.target)) {
        return false
      }
      if (profileInfo.current && profileInfo.current.contains(event.target)) {
        return false
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (burgerMenu.current && !burgerMenu.current.contains(event.target)) {
        setOpenMenu(false);
      }
      if (loggedOut.current && !loggedOut.current.contains(event.target)) {
        setLoggedOutMenu(false);
      }
      if (listRefs.current.some(ref => ref && ref.contains(event.target))) {
        setOpen(true);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [loggedOut]);

  const isExpiringTrail = (info) => {
    const expires_at = info?.free_trial_expires_at;
    let days = 7
    if (messages) {
      const config = messages.find((item) => item.key === "survey_form_count")
      days = (config && config.value) ? Number(config.value) : 7
    }

    const expirationDate = moment(expires_at);

    const alertDate = expirationDate.subtract(days, 'days');

    if (moment().isSame(alertDate, 'day')) {
      return true
    }
    return false
  }

  useEffect(() => {
    if (user) {
      setProfile(user)

      if (!user?.is_survey_submitted) {
        if (location?.pathname !== "/submit-survey" && user?.is_trial === true && isExpiringTrail(user) === true) {
          setQuestionModal(true);
        }
      }

      if (user.is_flyer_activated === false) {
        setShow(true)
      }
      if (user.is_tutorial_complete === false) {
        setStartGuide(true)
      }
    }
  }, [user])

  const handleAppGuide = () => {
    if (location) {
      if (["/", "/mystuff"].includes(location.pathname) === false) {
        nav('/', { state: { appGuide: true } })
        return false
      }
    }
    setStartGuide(true);
  }

  return (
    <>

      <div className='Navbar_Container' >
        <div className='container' style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div className='d-block d-md-none'>
            <div className='Navbar_LogoDiv mb-0' style={{ cursor: 'pointer' }} onClick={() => nav('/')}>
              <img className='Navbar_Logo' src={NavLogo} style={{ width: '100px', height: '100%' }} />
            </div>
          </div>

          <div className='d-md-block d-none'>
            <div
              className='Navbar_LogoDiv'
              style={{
                position: 'absolute',
                top: 15,
                left: 0,
                maxWidth: '200px',
                zIndex: 1000,
                cursor: 'pointer',
              }}
              onClick={() => nav('/mystuff')}
            >
              <img
                className='Navbar_Logo'
                src={NavLogo}
                // style={{ width: '100px', height: '100%' }}
                alt='Logo'
              />
            </div>
          </div>

          <div className='Navbar_MenuContainer'>
            {loggedIn && (
              <div className='Navbar_MenuDiv'>
                <NavLink
                  to='/'
                  className={({ isActive }) =>
                    isActive ? 'Navbar_MenuLinks active' : 'Navbar_MenuLinks'
                  }
                >
                  {({ isActive }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img src={isActive ? MyStuffActive : MyStuffIcon} alt='' />
                      <p style={{ marginBlock: 5, textAlign: 'center' }}>My Stuff</p>
                    </div>
                  )}
                </NavLink>

                <NavLink
                  to='/chat'
                  className={({ isActive }) =>
                    isActive ? 'Navbar_MenuLinks active chats' : 'Navbar_MenuLinks chats'
                  }
                >
                  {({ isActive }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img src={isActive ? ChatActive : ChatIcon} alt='' />
                      <p style={{ marginBlock: 5, textAlign: 'center' }}>Chats</p>
                    </div>
                  )}
                </NavLink>

                <NavLink
                  to='/notifications'
                  className={({ isActive }) =>
                    isActive ? 'Navbar_MenuLinks active notifications' : 'Navbar_MenuLinks notifications'
                  }
                >
                  {({ isActive }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={() => updateStore({ notification: false })}>
                      <div style={{ position: 'relative' }}>
                        <img src={isActive ? NotifyActive : NotifyIcon} alt='' />
                        {(notification) && <span className='notification-circle'></span>}
                      </div>
                      <p style={{ marginBlock: 5, textAlign: 'center' }}>Notifications</p>
                    </div>
                  )}
                </NavLink>

                <NavLink
                  to='/editprofile'
                  className={({ isActive }) =>
                    isActive ? 'Navbar_MenuLinks active' : 'Navbar_MenuLinks'
                  }
                >
                  {({ isActive }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img src={isActive ? SettingsActive : SettingsIcon} alt='' />
                      <p style={{ marginBlock: 5, textAlign: 'center' }}>Settings</p>
                    </div>
                  )}
                </NavLink>
              </div>
            )}

            {!loggedIn ? (
              <div
                ref={loggedOut}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                }}
              >
                <div className='LogIn_BtnDiv'>
                  <button
                    className='LogIn_BtnWeb px-3 py-2'
                    onClick={() => (window.location = '/')}
                  >
                    <div className='d-flex align-items-center'>
                      <span>Sign in</span>
                      <img className='Navbar_Logo ms-2' src={SignInArrow} alt='Sign In' />
                    </div>
                  </button>
                </div>

                <div className='expandIconsMob' style={{ cursor: 'pointer' }} onClick={handleLoggedOutMenuClick}>
                  {/* {loggedOutMenu ? (
                    <CloseIcon sx={{ color: '#ffffff' }} />
                  ) : ( */}
                  <MenuIcon
                    sx={{
                      color: '#000',
                      fontSize: '28px',
                      transform: 'scaleX(1.5)',
                    }}
                  />
                </div>

              </div>
            ) : (
              <>
                <div ref={menuRef} className='profile_div nav-menus'>
                  <Box className='px-0' sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }} >
                    <Badge className="cart-block" color="primary" onClick={() => nav(`/store/cart`)} badgeContent={cartItems.reduce((sum, i) => sum + i.quantity, 0)} invisible={false}>
                      <ShoppingBagOutlined />
                    </Badge>
                    <div className='profilePic_div'
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        width: '100%',
                      }}
                    >
                      <div>
                        <img
                          className='profile_img'
                          src={profile?.looser?.profile_picture
                            ? profile?.looser?.profile_picture
                            : Avatar} />
                      </div>
                      <p
                        style={{
                          color: '#000',
                          margin: '0 5%',
                          whiteSpace: 'nowrap',
                          textTransform: 'capitalize'
                        }}
                      >
                        {profile?.name || 'User'}
                      </p>
                      <div onMouseDown={handleClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        {open || openMenu || loggedOutMenu ? (
                          <ExpandLess sx={{ color: '#000' }} />
                        ) : (
                          <ExpandMore sx={{ color: '#000' }} />
                        )}
                      </div>
                    </div>
                  </Box>
                </div>
                <div ref={burgerMenu} className='menu_Icon mobi-nav-menus'>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Badge className="cart-block" color="primary" onClick={() => nav(`/store/cart`)} badgeContent={cartItems.reduce((sum, i) => sum + i.quantity, 0)} invisible={false}>
                      <ShoppingBagOutlined />
                    </Badge>
                    <ListItemButton sx={{ width: '100%' }} onClick={handleMenuClick}>
                      <MenuIcon
                        sx={{
                          color: '#000',
                          fontSize: '28px',
                          transform: 'scaleX(1.5)',
                        }}
                      />
                    </ListItemButton>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Collapse
        className='Navbar_CollapseDiv navbar-collapse'
        in={open || openMenu || loggedOutMenu}
        timeout='auto'
        unmountOnExit
      >
        <List disablePadding>
          {loggedIn && (
            <>
              <ListItemText ref={profileInfo}>
                <div className='login_name'>
                  <div className='Navbar_CollapseText' style={{ textTransform: 'capitalize' }}>
                    {profile?.name || 'Username'}
                  </div>
                  <div className='Navbar_CollapseText' style={{ color: '#707070' }}>
                    {profile?.email || 'user@qrtagit.com'}
                  </div>
                </div>
              </ListItemText>

              <div className='Navbar_CollapseDivider' />

              <div>
                <ListItemButton className='edit-profile editprofile' ref={listRef} onClick={() => nav('/editprofile')} style={{ borderBottom: "1px solid lightgray", borderTop: "1px solid lightgray" }}>
                  <ListItemText className='m-0' >
                    <div className='Navbar_CollapseText' >
                      My Account
                    </div>
                  </ListItemText>
                  {<ChevronRightIcon />}
                </ListItemButton>
              </div>

              <div className='d-block d-md-none'>
                <ListItemButton className='mobi-chats' ref={listRef} onClick={() => nav('/chat')} style={{ borderBottom: "1px solid lightgray", borderTop: "1px solid lightgray" }}>
                  <ListItemText className='m-0' >
                    <div className='Navbar_CollapseText' >
                      Chats
                    </div>
                  </ListItemText>
                  {<ChevronRightIcon />}
                </ListItemButton>
              </div>

              <div className='d-block d-md-none'>
                <ListItemButton className='mobi-notifications' ref={listRef} onClick={() => nav('/notifications')} style={{ borderBottom: "1px solid lightgray", borderTop: "1px solid lightgray" }}>
                  <ListItemText className='m-0' >
                    <div className='Navbar_CollapseText' >
                      Notifications
                    </div>
                  </ListItemText>
                  {<ChevronRightIcon />}
                </ListItemButton>
              </div>

              <div>
                <ListItemButton ref={listRef} onClick={() => toggleSubMenu('subscription')} style={{ borderBottom: "1px solid lightgray" }}>
                  <ListItemText className='m-0' >
                    <div className='Navbar_CollapseText' >
                      Subscription
                    </div>
                  </ListItemText>
                  {subMenuStates.subscription ? <ExpandMore ref={listRef} /> : <ChevronRightIcon ref={listRef} />}
                </ListItemButton>

                <Collapse in={subMenuStates.subscription} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => nav('/subscription')}>
                      <CardMembershipOutlinedIcon style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="Manage Subscription" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>
                    <div className='Navbar_CollapseDivider' />
                    <ListItemButton className='myqrtags' sx={{ pl: 4 }} onClick={() => nav('/myqrtags')}>
                      <QrCodeScannerOutlinedIcon style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="My QR Tags" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>
                    <div className='Navbar_CollapseDivider' />
                    <ListItemButton className='myqrtags' sx={{ pl: 4 }} onClick={() => nav('/store')}>
                      <StoreOutlined style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="Buy QR Tags" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>
                    <div className='Navbar_CollapseDivider' />
                    <ListItemButton className='myqrtags' sx={{ pl: 4 }} onClick={() => nav('/orders')}>
                      <BarChartOutlined style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="Manage Orders" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>
                  </List>
                </Collapse>
              </div>

              <div>
                <ListItemButton ref={listRef} onClick={() => toggleSubMenu('security')} style={{ borderBottom: "1px solid lightgray", borderTop: "1px solid lightgray" }}>
                  <ListItemText className='m-0' >
                    <div className='Navbar_CollapseText' >
                      Security
                    </div>
                  </ListItemText>
                  {subMenuStates.security ? <ExpandMore ref={listRef} /> : <ChevronRightIcon ref={listRef} />}
                </ListItemButton>

                <Collapse in={subMenuStates.security} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => window.location.href = 'https://qrtag.it/terms-and-conditions/'}>
                      <DescriptionOutlinedIcon className='mx-1' style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="Terms and Conditions" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>
                    <div className='Navbar_CollapseDivider' />
                    <ListItemButton sx={{ pl: 4 }} onClick={() => window.location.href = 'https://qrtag.it/privacy-policy/'}>
                      <DescriptionOutlinedIcon className='mx-1' style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="Privacy Policy" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>
                    <div className='Navbar_CollapseDivider' />
                    <ListItemButton className='feedback' sx={{ pl: 4 }} onClick={() => setFeedback(true)}>
                      <HelpOutlineOutlinedIcon className='mx-1' style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="Feedback" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>
                  </List>
                </Collapse>
              </div>

              <ListItemButton onClick={() => nav('/memorial')} style={{ borderBottom: "1px solid lightgray", borderTop: "1px solid lightgray" }}>
                <ListItemText className='m-0' >
                  <div className='Navbar_CollapseText' >
                    Memorial
                  </div>
                </ListItemText>
                {<ChevronRightIcon />}
              </ListItemButton>

              <div>
                <ListItemButton ref={listRef} onClick={() => toggleSubMenu('aboutus')} style={{ borderBottom: "1px solid lightgray", borderTop: "1px solid lightgray" }}>
                  <ListItemText className='m-0' >
                    <div className='Navbar_CollapseText' >
                      About Us
                    </div>
                  </ListItemText>
                  {subMenuStates.aboutus ? <ExpandMore ref={listRef} /> : <ChevronRightIcon ref={listRef} />}
                </ListItemButton>

                <Collapse in={subMenuStates.aboutus} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton className='myqrtags' sx={{ pl: 4 }} onClick={() => nav('/about')}>
                      <AutoStoriesOutlined style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="Our Story" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>
                    <div className='Navbar_CollapseDivider' />
                    <ListItemButton className='edit-profile' sx={{ pl: 4 }} onClick={() => { handleAppGuide() }}>
                      <DescriptionOutlinedIcon className='mx-1' style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="App Guide" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>
                  </List>
                </Collapse>
              </div>

              <div>
                <ListItemButton ref={listRef} onClick={() => toggleSubMenu('manageaccount')} style={{ borderBottom: "1px solid lightgray", borderTop: "1px solid lightgray" }}>
                  <ListItemText className='m-0' >
                    <div className='Navbar_CollapseText' >
                      Manage Account
                    </div>
                  </ListItemText>
                  {subMenuStates.manageaccount ? <ExpandMore ref={listRef} /> : <ChevronRightIcon ref={listRef} />}
                </ListItemButton>

                <Collapse in={subMenuStates.manageaccount} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton onClick={() => setDeleteAccount(true)} style={{ color: '#FF0000' }}>
                      <PersonOffOutlined className='mx-1' style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                      <ListItemText primary="Delete Account" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                    </ListItemButton>

                    {(user && user.subscription_plan && !user.cancellation_requested) && <>
                      <div className='Navbar_CollapseDivider' />
                      <ListItemButton onClick={() => setIsCancel(!isCancel)} style={{ color: '#FF0000' }}>
                        <HighlightOffOutlined className='mx-1' style={{ height: '18px', width: '18px', marginRight: '8px' }} />
                        <ListItemText primary="Cancel Subscription" primaryTypographyProps={{ style: { fontSize: '13px' } }} />
                      </ListItemButton>
                    </>}
                  </List>
                </Collapse>
              </div>

              <ListItemButton
                sx={{
                  mx: 2,
                  mb: 2,
                  mt: 2,
                  borderRadius: '5px',
                  backgroundColor: '#2159D6',
                  '&:hover': {
                    backgroundColor: '#1b4aba'
                  },
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  justifyContent: 'space-between'
                }}
                onClick={() => setCancel(true)}
              >
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    style: { fontSize: '13px', color: '#FFFFFF' }
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {loading && <PulseLoader size={10} color='#FFFFFF' />}
                  <PowerSettingsNewIcon style={{ height: '18px', width: '18px', color: '#FFFFFF', marginLeft: '8px' }} />
                </div>
              </ListItemButton>

            </>
          )}

          <div className='Navbar_CollapseDiv_Mob'>
            {!loggedIn && (
              <ListItemButton onClick={() => (window.location = '/')}>
                <ListItemText>
                  <div className='Navbar_SignOutDiv'>
                    <div className='Navbar_CollapseText'> SignIn</div>
                    {/* <img className='Navbar_Logo' src={SignInArrow} /> */}
                    <div>
                      {loading && <PulseLoader size={10} color='#0A3F74' />}
                    </div>
                  </div>
                </ListItemText>
              </ListItemButton>
            )}
          </div>
        </List>
      </Collapse>

      <ConfirmationModel
        open={cancel}
        setOpen={setCancel}
        onConfirm={() => {
          if (loading) {
            return;
          }
          setLoading((s) => !s);
          localStorage.setItem('isLoggedIn', 'false');
          localStorage.clear();
          sessionStorage.clear();
          setCancel(false);
          nav('/login');
          setTimeout(() => {
            window.location.reload();
          }, 300)
        }}
      ></ConfirmationModel>

      {deleteAccount && (
        <ConfirmationDeleteModel
          open={deleteAccount}
          setOpen={setDeleteAccount}
        />
      )}
      
      {feedback && (
        <FeedbackModal
          open={feedback}
          setOpen={setFeedback}
        />
      )}

      {/* {applycoupon && (
        <ApplyCouponModal
          open={applycoupon}
          setOpen={setApplyCoupon}
          navigation={true}
        />
      )} */}

      {cancel && (
        <div className='fullScreenLoader'>
          <PulseLoader color={'#0057ff'} loading={loading} size={10} />
        </div>
      )}
      {(startGuide) && <>
        <AppGuide
          setStartGuide={setStartGuide}
          setOpen={setOpen}
          setOpenMenu={setOpenMenu}
          toggleSubMenu={toggleSubMenu}
          overlayRef={overlayRef}
          floaterRef={floaterRef}
        />
      </>}

      {(questionModal) && <>
        <SurveyModal
          open={questionModal}
          setOpen={setQuestionModal}
        />
      </>}

      {isCancel && (
        <PlanCancellationModal
          open={isCancel}
          setOpen={setIsCancel}
        />
      )}
    </>
  );
}

export default Navbar;
