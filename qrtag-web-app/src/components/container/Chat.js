import '../css/App.css';
import { useEffect, useRef, useState, useMemo } from 'react';
import Navbar from '../common/Navbar.js';
import Search from '../../images/search-icon.svg';
import Avatar from '../../images/avatar.png';
import MapIcon from '../../images/map-marker.svg';
import SendIcon from '../../images/send_icon.svg';

import { Button, Popover, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import TopNavbar from '../common/TopNavContent';
import Footer from '../common/Footer.js'
import Breadcrumbs from '../common/Breadcrumbs'
import { useLocation, useParams } from 'react-router-dom';
import { usePubNub } from 'pubnub-react';
import mixpanel from 'mixpanel-browser';
import Axios from '../../config/axios';
import { Store, UpdateStore } from '../../StoreContext';
import StaticMap from '../common/StaticMap';
import { toast } from 'react-toastify';
import moment from 'moment-timezone'
import UnlockFeatureModal from '../common/UnlockFeatureModal'
import { RecieveChannelList, HandleMessageHistory, HandleMessageHistoryByID, RecieveArchivedChannelList } from '../../services/chat';
import { LocalActivityOutlined, Map, MapSharp, Pin, PlaceOutlined } from '@mui/icons-material';
import CustomCookies from '../common/Cookies'
import { useCookies } from "react-cookie";
import BlockUserModal from '../common/BlockUserModal'
import UnBlockUserModal from '../common/UnBlockUserModal'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArchiveIcon from '@mui/icons-material/Archive';

function Chat() {

    const { loggedIn, user, channels: channelList } = Store();

    const { state } = useLocation();

    const pubnub = usePubNub();
    const updateStore = UpdateStore();

    const [selectedChat, setSelectedChat] = useState(null)
    const [chatOpen, setChatOpen] = useState(false)
    const [activeChatId, setActiveChatId] = useState(null)
    const [activeChannel, setActiveChannel] = useState({});
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [sender, setSender] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [featureModal, setFeatureModal] = useState(false);
    const [blockModal, setBlockModal] = useState(false);
    const [unBlockModal, setUnBlockModal] = useState(false);
    const [isUserBlocked, setIsUserBlocked] = useState(false);
    const [isUserBeenBlocked, setIsUserBeenBlocked] = useState(false);
    const [openCookie, setOpenCookie] = useState(false);
    const [cookies, setCookie] = useCookies(['uid'])
    const [archiveAnchorEl, setArchiveAnchorEl] = useState({})
    const [archiveAnchorE2, setArchiveAnchorE2] = useState({})
    const [archivedChats, setArchivedChats] = useState(false)
    const [archivedLists, setArchivedLists] = useState([])

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        if (cookies?.uid) {
            setOpenCookie(false)
        } else if (state && state.currentChannelId) {
            setOpenCookie(true)
        }
    }, []);

    const handleMessage = (event) => {
        setMessageList((m) =>
            [
                {
                    text: event.message.text,
                    extra_message: {
                        type: event.message?.type || 'text',
                        location: event.message?.location,
                    },

                    send_by: +event.publisher.split('User')[0],
                    send_by_temp: event.publisher.split('User')[0],
                    channel: event.channel,
                },
            ].concat(m)
        );
    };

    // SEND MESSAGE
    const sendMessage = (message) => {
        const trimmedMessage = message?.trim();
        if (!trimmedMessage) {
            return;
        }

        if (user && user.user_type === 'looser' && user.subscription_plan === null && user.is_trial === false && user.is_honorary === false) {
            setFeatureModal(true);
            return false;
        }

        if (isUserBlocked) {
            console.log('You have blocked this user');
            return false
        }
        if (isUserBeenBlocked) {
            console.log('You have been blocked by the owner');
            return false
        }
        if (message) {
            pubnub
                .publish({
                    channel: [activeChannel.id],
                    message: { text: message, user },
                })
                .then((res) => {
                    mixpanel.track('Message Sent', {
                        status: "Sent"
                    });
                    setMessage('');
                    // recieveChannelList();
                })
                .catch((err) => console.log('send messaeg Error ===> ', err));
        }
        const sendto = activeChannel?.users?.find((item) => user?.id !== item?.id);
        const obj = {
            send_by: user.id,
            send_to: sendto?.id,
            channel: activeChannel.id,
            text: message,
        };

        if (sessionStorage.getItem('widgetcode')) {
            obj.token = sessionStorage.getItem('widgetcode')
        }

        Axios.post(`/message/add-message`, JSON.stringify(obj))
            .then((res) => {
                // handleMessageHistory(activeChannel);
                console.log('addmessages api res =>', res);
            })
            .catch((error) => {
                console.log('addmessages api error', error);
            });
    };

    useEffect(() => {
        pubnub.setUUID(user.id + 'User');
        let listener = { message: handleMessage };
        pubnub.addListener(listener);
        return () => {
            pubnub.removeListener(listener);
        };
    }, [pubnub]);

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        RecieveChannelList(user.id);
        RecieveArchivedChannelList(user.id, ({ success, data }) => {
            setArchivedLists(data)
        });
        mixpanel.track('Chat Page', {
            pageName: "Chat"
        });
    }, []);

    const isIOS = () => {
        return (
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.userAgent.includes("Macintosh") && 'ontouchend' in document)
        );
    };

    const currentLists = archivedChats ? archivedLists : channelList

    const FilteredChat = useMemo(() => {
        return currentLists.filter((c) => {
            const itemMatches = c.item?.name?.toLowerCase().includes(searchQuery.toLowerCase());

            const messageMatches = c.last_message?.text?.toLowerCase().includes(searchQuery.toLowerCase());

            if (c.users?.length > 0) {
                const userMatches = c.users.some(user =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return userMatches || itemMatches || messageMatches;
            }
            return itemMatches || messageMatches;
        });
    }, [currentLists, searchQuery]);

    useEffect(() => {
        const uid = localStorage.getItem('uuid');

        if (state && state.currentChannelId) {
            const channel = FilteredChat.find((data) => data && data.id === state.currentChannelId);
            if (channel && channel.id) {
                setChatOpen(true);
                setSender(true);
                setActiveChannel(channel);
                loggedIn
                    ? HandleMessageHistory(channel, ({ success, data }) => {
                        success && setMessageList(data);
                    })
                    : HandleMessageHistoryByID(user.id, ({ success, data }) => {
                        success && setMessageList(data);
                    });

                localStorage.removeItem('uid');
            }
        } else if (uid || cookies?.uid) {
            const channel = FilteredChat.find((data) => data && data.item.item_id === uid);
            if (channel) {
                setChatOpen(true);
                setActiveChannel(channel);
                loggedIn
                    ? HandleMessageHistory(channel, ({ success, data }) => {
                        success && setMessageList(data);
                    })
                    : HandleMessageHistoryByID(user.id, ({ success, data }) => {
                        success && setMessageList(data);
                    });

                localStorage.removeItem('uid');
            }
        }
    }, [channelList]);

    const sendLocation = () => {
        if (navigator.geolocation) {

            if (user && user.user_type === 'looser' && user.subscription_plan === null && user.is_trial === false && user.is_honorary === false) {
                setFeatureModal(true);
                return false;
            }

            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                pubnub
                    .publish({
                        channel: [activeChannel.id],
                        message: {
                            user,
                            type: 'location',
                            location: { latitude, longitude },
                        },
                    })
                    .then((res) => {
                        // recieveChannelList();
                    })
                    .catch((err) => console.log('send messaeg Error ===> ', err));

                const sendto = activeChannel?.users?.find(
                    (item) => user?.id !== item?.id
                );
                const obj = {
                    send_by: user.id,
                    send_to: sendto?.id,
                    channel: activeChannel.id,
                    extra_message: {
                        type: 'location',
                        location: { latitude, longitude },
                    },
                };

                if (sessionStorage.getItem('widgetcode')) {
                    obj.token = sessionStorage.getItem('widgetcode')
                }

                Axios.post(`/message/add-message`, JSON.stringify(obj))
                    .then((res) => {
                        // handleMessageHistory(activeChannel);
                        console.log('addmessages api res =>', res);
                    })
                    .catch((error) => {
                        console.log('addmessages api error', error);
                    });
            });
        } else {
            console.log('error');
        }
    };

    const viewMessage = (item) => {
        if (user && user.user_type === 'looser' && user.subscription_plan === null && user.is_trial === false && user.is_honorary === false) {
            setFeatureModal(true);
        } else {
            setActiveChannel(item);
            setSender(true);
            !loggedIn
                ? HandleMessageHistoryByID(user.id, ({ success, data }) => {
                    success && setMessageList(data);
                })
                : HandleMessageHistory(item, ({ success, data }) => {
                    success && setMessageList(data);
                });
        }
    }

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        if (user && activeChannel && activeChannel?.blocked_by_user && activeChannel?.blocked_by_user?.id === user?.id) {
            setIsUserBlocked(true);
        }
        if (user && activeChannel && activeChannel?.blocked_by_user && activeChannel?.blocked_by_user?.id !== user?.id) {
            setIsUserBeenBlocked(true);
        }
    }, [activeChannel])

    const handleClosed = () => {
        const uid = sessionStorage.getItem('uuidcode')
        if (uid) {
            setCookie('uid', uid, { path: '/' })
            updateStore({ cookies })
            setOpenCookie(false);
        }
    };
    const handleDeclineClosed = () => {
        setOpenCookie(false);
    };

    const handleArchiveClick = (event, index) => {
        if (user && user.user_type === 'looser' && user.subscription_plan === null && user.is_trial === false && user.is_honorary === false) {
            setFeatureModal(true);
            return false;
        }
        setArchiveAnchorEl((prev) => ({
            ...prev,
            [index]: event.currentTarget,
        }));
    }

    const handleMobileArchiveClick = (event, index) => {
        if (user && user.user_type === 'looser' && user.subscription_plan === null && user.is_trial === false && user.is_honorary === false) {
            setFeatureModal(true);
            return false;
        }
        setArchiveAnchorE2((prev) => ({
            ...prev,
            [index]: event.currentTarget,
        }));
    }

    const handleCloseArchiveDropdownList = () => {
        setArchiveAnchorEl({})
        setArchiveAnchorE2({})
    }

    const handleCloseArchiveDropdown = (ch) => {
        setArchiveAnchorEl({})
        setArchiveAnchorE2({})
        Axios.post(`/message/channel/${ch}/archive/`, {}).then((response) => {
            if (response && response.status === 200) {
                toast.success('Channel archived successfully!');
                RecieveChannelList(user?.id);
                RecieveArchivedChannelList(user.id, ({ success, data }) => {
                    setArchivedLists(data)
                });
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleCloseUnarchiveDropdown = (ch) => {
        setArchiveAnchorEl({})
        setArchiveAnchorE2({})
        Axios.post(`/message/channel/${ch}/unarchive/`, {}).then((response) => {
            if (response && response.status === 200) {
                toast.success('Channel restored successfully!');
                RecieveChannelList(user?.id);
                RecieveArchivedChannelList(user.id, ({ success, data }) => {
                    setArchivedLists(data)
                });
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    const toggleArchivedChats = () => {
        setArchivedChats((prev) => !prev)
    }

    const localTimeZone = (dateTime, isTime) => {
        const utcDate = moment.utc(dateTime)
        const localTimezone = moment.tz.guess()
        const localDate = utcDate.tz(localTimezone)

        if (isTime) {
            return localDate.format('hh:mm A') 
        }
        return localDate.format('YYYY-MM-DD hh:mm A')
    }


    return (
        <div style={{ overflow: 'hidden' }}>
            <Navbar />
            {(openCookie) ? <>
                <CustomCookies handleClose={handleClosed} handleDeclineClose={handleDeclineClosed} />
            </> : (loggedIn) ? <>
                <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbActive='Messages' />
            </> : <><div className='py-3'></div></>}
            <TopNavbar />

            <div className='section-background' style={{ minHeight: '100vh' }}>
                <div className='py-2'>
                    <div className='chat_box'>

                        <div className='p-md-3 p-2 d-none d-md-block'>
                            <h3 style={{ fontWeight: 600, color: '#1e5af9', marginBottom: '0px' }}>Messages</h3>
                        </div>

                        {(chatOpen) && <>
                            <div className='d-flex mt-3 mb-md-3 mb-0 d-block d-md-none' style={{ cursor: "pointer", fontWeight: 600 }} onClick={() => {
                                setChatOpen(false);
                                setActiveChannel(null);
                            }}>
                                <ArrowBackIcon style={{ color: '#1e5af9' }} />
                                <p className='mb-0 mb-md-2' style={{ marginLeft: "5px", color: '#1e5af9' }}>Back</p>
                            </div>
                        </>}

                        <div className='Chat_MainContainer' style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '8px' }}>
                            <div className='Chat_LeftContainer'>
                                <div className='Chat_LeftContainer_SearchDiv' style={{ backgroundColor: '#eff4fb' }}>
                                    <input type='text' onChange={handleChange} value={searchQuery} placeholder='Search...' />
                                    <img src={Search} alt="Search Icon" />
                                </div>

                                {(archivedChats) ? <>
                                    <div className='d-flex' onClick={toggleArchivedChats} style={{ cursor: "pointer", color: '#1e5af9' }}>
                                        <ArrowBackIcon style={{ marginLeft: "5%", color: '#1e5af9' }} />
                                        <p style={{ marginLeft: "5px", marginBottom: '0px' }}>Back</p>
                                    </div>
                                    <hr style={{ background: '#8E8E8E' }} />
                                </> : <>
                                    {(archivedLists.length > 0) && <>
                                        <div style={{ display: 'flex', alignItems: 'center', cursor: "pointer" }} onClick={toggleArchivedChats}>
                                            <IconButton style={{ marginLeft: '12px', color: '#2159D6' }}>
                                                <ArchiveIcon />
                                            </IconButton>

                                            <Typography variant="body1" style={{ fontWeight: 500 }}>
                                                Archived
                                            </Typography>
                                        </div>

                                        <hr style={{ background: '#8E8E8E' }} />
                                    </>}
                                </>
                                }

                                <div className='Chat_MessagesList all-chat-list mt-3'>
                                    {(FilteredChat && FilteredChat.length > 0) ? <>
                                        {FilteredChat.map((item, index) => {

                                            const receivedUser = user?.email === item?.users[0]?.email ? item?.users[1] : item?.users[0];
                                            const locationData = item?.last_message?.extra_message;
                                            const lastMessage = item?.last_message?.text;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className='Chat_MessageBox'
                                                    style={{
                                                        backgroundColor: item.id === activeChannel?.id ? '#eff4fb' : '#fff',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => viewMessage(item)}
                                                >
                                                    <div className='Chat_MessageBox_Avatar'>
                                                        <img src={receivedUser?.looser?.profile_picture ? receivedUser?.looser?.profile_picture : Avatar} />
                                                    </div>
                                                    <div className='Chat_MessageBox_Text'>
                                                        <p className='Chat_MessageBox_Text_P'>
                                                            {item?.item && item?.item?.name ? (item?.item.user_id !== user?.id ? 'Owner of ' : 'Finder of ') + '' + item?.item?.name : (item?.users && item?.users[0] && item?.users[0].id !== user?.id) ? 'Owner' : 'Finder'}
                                                        </p>
                                                        <p style={{ display: 'flex', alignItems: 'center', color: '#637381' }}>
                                                            {(locationData && locationData.type && locationData.type === 'location') ?
                                                                <> <img src={MapIcon} width={15} /> Location </>
                                                                :
                                                                (lastMessage?.length > 16) ? lastMessage.slice(0, 16) + '...' : lastMessage
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className='Chat_MessageBox_DateDiv'>
                                                        <p className='mb-0' style={{ marginRight: '6%' }} title={localTimeZone(item.last_message?.created_at)}>
                                                            {localTimeZone(item.last_message?.created_at, true)}
                                                        </p>

                                                        <div>
                                                            <IconButton onClick={(e) => { e.stopPropagation(); handleArchiveClick(e, index) }} >
                                                                <MoreHorizIcon />
                                                            </IconButton>
                                                            <Menu
                                                                anchorEl={archiveAnchorEl[index]}
                                                                open={Boolean(archiveAnchorEl[index])}
                                                                onClose={handleCloseArchiveDropdownList}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'right',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'left',
                                                                }}
                                                            >
                                                                <MenuItem onClick={(e) => { e.stopPropagation(); archivedChats ? handleCloseUnarchiveDropdown(item?.id) : handleCloseArchiveDropdown(item?.id) }}>
                                                                    <Typography style={{ fontSize: "14px" }}>{archivedChats ? 'Restore' : 'Archive Chat'}</Typography>
                                                                </MenuItem>
                                                            </Menu>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </> : <>
                                        <div style={{ width: '100%' }}>
                                            <p className='text-center mt-4' style={{ color: 'rgb(221, 221, 221)' }}>No Conversation Yet</p>
                                        </div>
                                    </>}
                                </div>
                            </div>

                            <div className='Chat_RightContainer'>
                                {(sender) ? (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div className='Chat_RightContainer_TitleDiv'>
                                                <div className='Chat_RightContainer_ImageDiv'>
                                                    <img src={(user?.email === activeChannel?.users[0]?.email) ? (activeChannel?.users[1]?.looser?.profile_picture || Avatar) : (activeChannel?.users[0]?.looser?.profile_picture || Avatar)} />
                                                </div>
                                                <div className='Chat_SenderNameDiv'>
                                                    <p className='Chat_MessageBox_Text_P mb-2'>
                                                        {/* {sender?.looser?.name}
                                                </p>
                                                <p style={{ color: '#64748B', fontSize: '13px' }}> */}
                                                        {(activeChannel?.item && activeChannel?.item?.name) ?
                                                            ((activeChannel?.item.user_id !== user?.id)
                                                                ? 'Owner of '
                                                                : 'Finder of ') + activeChannel?.item?.name
                                                            : (activeChannel?.users && activeChannel?.users[0] && activeChannel?.users[0].id !== user?.id) ? 'Owner' : 'Finder'}
                                                    </p>
                                                </div>
                                            </div>
                                            <IconButton onClick={handleMenuClick}>
                                                <MoreHorizIcon />
                                            </IconButton>

                                            <Menu
                                                id="chat-options-menu"
                                                anchorEl={anchorEl}
                                                open={isMenuOpen}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                            >
                                                {(isUserBlocked) ?
                                                    <MenuItem
                                                        onClick={() => setUnBlockModal(true)}
                                                        sx={{ fontSize: '14px', py: 0.5, minHeight: '30px' }}
                                                    >
                                                        Unblock
                                                    </MenuItem>
                                                    :
                                                    <MenuItem
                                                        onClick={() => setBlockModal(true)}
                                                        sx={{ fontSize: '14px', py: 0.5, minHeight: '30px' }}
                                                    >
                                                        Block
                                                    </MenuItem>
                                                }
                                            </Menu>


                                        </div>

                                        <div className='Chat_ChatDivider' />
                                        <p style={{ margin: '1rem', color: '#D10000', textAlign: 'center', fontSize: '14px', backgroundColor: '#fbf0f1', padding: '6px', borderRadius: '5px' }}>
                                            Remember, QRTag.it advises against sharing personal information.
                                        </p>

                                        <div className='Chat_ChatDiv'>
                                            {(messageList.length > 0) ? <>
                                                {messageList.map((item, index) => {

                                                    const isSender = loggedIn ? item.send_by === user.id : item.send_by_temp === user.id;

                                                    return (
                                                        <>
                                                            {(isSender) ? (
                                                                <div className='Chat_SenderChatDiv' key={`message-${index}`}>
                                                                    <div className='Chat_SenderChatSubDiv' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: "end", }}>
                                                                        <div
                                                                            className={
                                                                                item.extra_message?.type === 'location'
                                                                                    ? 'Chat_SenderChatSubDiv_map'
                                                                                    : 'Chat_SenderChatSubDiv_P'
                                                                            }
                                                                        >
                                                                            {item.extra_message?.type === 'location' ? (
                                                                                <StaticMap {...item.extra_message.location} />
                                                                            ) : (
                                                                                item.text
                                                                            )}
                                                                        </div>
                                                                        <small className='Chat_MessageTime' title={localTimeZone(item.created_at)}>{localTimeZone(item.created_at, true)}</small>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className='Chat_RevievedChatDiv' style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start" }}>
                                                                    {/* <small className='Chat_MessageTime'>Andri Thomas</small> */}
                                                                    <div className='Chat_RevievedChatSubDiv_P'>
                                                                        {
                                                                            <div
                                                                                key={`message-${index}`}
                                                                            >
                                                                                {item.extra_message?.type === 'location' ? (
                                                                                    <StaticMap {...item.extra_message.location} />
                                                                                ) : (
                                                                                    item.text
                                                                                )}

                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    <small className='Chat_MessageTime' title={localTimeZone(item.created_at)}>{localTimeZone(item.created_at, true)}</small>
                                                                </div>
                                                            )}
                                                        </>
                                                    )
                                                })}
                                            </> : <>

                                            </>}
                                        </div>

                                        <div>
                                            <div className='Chat_TypingDivider' />
                                            {(isUserBlocked) ? <>
                                                <div className='Chat_TypingDiv' style={{ display: 'flex', alignItems: 'center' }}>
                                                    <p className='mb-0 px-4' style={{ color: '#818181', width: '90%' }}>You have blocked this user</p>
                                                </div>
                                            </> : (isUserBeenBlocked) ? <>
                                                <div className='Chat_TypingDiv' style={{ display: 'flex', alignItems: 'center' }}>
                                                    <p className='mb-0 px-4' style={{ color: '#818181', width: '90%' }}>You have been blocked by this owner</p>
                                                </div>
                                            </> : <>
                                                <div className='Chat_TypingDiv' style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className='Chat_TypingSubDiv' style={{ backgroundColor: '#eff4fb' }}>
                                                        {!isIOS() && <IconButton onClick={sendLocation} size='small'><PlaceOutlined sx={{ fill: "#ef4444" }} /></IconButton>}
                                                        <input
                                                            type='text'
                                                            placeholder='Type something here...'
                                                            value={message}
                                                            onKeyPress={(e) => {
                                                                const trimmedMessage = message?.trim();
                                                                if (!trimmedMessage) {
                                                                    return;
                                                                } else if (e.key !== 'Enter') return;
                                                                sendMessage(message);
                                                            }}
                                                            onChange={(e) => setMessage(e.target.value)}
                                                        />

                                                        {/* <IconButton onClick={sendLocation} size='small'><AttachFileIcon /></IconButton> */}
                                                        {/* <IconButton size='small'><EmojiEmotionsIcon /></IconButton> */}
                                                    </div>
                                                    <div className='Chat_SendBtn'
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const trimmedMessage = message?.trim();
                                                            if (!trimmedMessage) {
                                                                return;
                                                            } else {
                                                                sendMessage(message);
                                                            }
                                                        }}
                                                    >
                                                        <img src={SendIcon} />
                                                    </div>
                                                </div>
                                            </>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            style={{ fontSize: '2rem', fontWeight: '600', margin: '0 2%' }}
                                        >
                                            Start Chat
                                        </div>
                                        <div className='Chat_ChatDivider' />

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                fontWeight: '500',
                                                width: '100%',
                                                height: '90vh',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Select a conversation to start chatting
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/********** MOBILE VIEW ***********/}
                    <div className='Chat_MainContainer_Mob'>
                        {!chatOpen ? (

                            <div className='Chat_LeftContainer'>
                                <div className='Chat_LeftContainer_SearchDiv' style={{ backgroundColor: '#eff4fb' }}>
                                    <input type='text' placeholder='Search...' onChange={handleChange} value={searchQuery} />
                                    <img src={Search} alt="Search Icon" />
                                </div>

                                {(archivedChats) ? <>
                                    <div className='d-flex' onClick={toggleArchivedChats} style={{ cursor: "pointer", color: '#1e5af9' }}>
                                        <ArrowBackIcon style={{ marginLeft: "5%", color: '#1e5af9' }} />
                                        <p style={{ marginLeft: "5px", marginBottom: '0px' }}>Back</p>
                                    </div>
                                    <hr style={{ background: '#8E8E8E' }} />
                                </> : <>
                                    {(archivedLists.length > 0) && <>
                                        <div style={{ display: 'flex', alignItems: 'center', cursor: "pointer" }} onClick={toggleArchivedChats}>
                                            <IconButton style={{ marginLeft: '12px', color: '#2159D6' }}>
                                                <ArchiveIcon />
                                            </IconButton>
                                            <Typography variant="body1" style={{ marginLeft: "3%", fontWeight: 500 }}>
                                                Archived
                                            </Typography>
                                        </div>

                                        <hr style={{ background: '#8E8E8E' }} />
                                    </>}
                                </>
                                }

                                <div className='Chat_MessagesList '>
                                    {(FilteredChat && FilteredChat.length > 0) ? <>
                                        {FilteredChat.map((item, index) => {

                                            const receivedUser = user?.email === item?.users[0]?.email ? item?.users[1] : item?.users[0];
                                            const lastMessage = item?.last_message?.text;
                                            const locationData = item?.last_message?.extra_message;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className='Chat_MessageBox'
                                                    style={{
                                                        backgroundColor: (activeChannel && activeChannel?.id === item?.id) ? '#eff4fb' : '#fff',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => {
                                                        if (user && user.user_type === 'looser' && user.subscription_plan === null && user.is_trial === false && user.is_honorary === false) {
                                                            setFeatureModal(true);
                                                        } else {
                                                            setChatOpen(true);
                                                            setActiveChannel(item);
                                                            !loggedIn ? HandleMessageHistoryByID(
                                                                user.id,
                                                                ({ success, data }) => {
                                                                    success && setMessageList(data);
                                                                }
                                                            )
                                                                : HandleMessageHistory(
                                                                    item,
                                                                    ({ success, data }) => {
                                                                        success && setMessageList(data);
                                                                    }
                                                                );
                                                        }
                                                    }}
                                                >
                                                    <div className='Chat_MessageBox_Avatar'>
                                                        <img
                                                            src={receivedUser?.looser?.profile_picture ? receivedUser?.looser?.profile_picture : Avatar}
                                                        />
                                                    </div>
                                                    <div className='Chat_MessageBox_Text'>
                                                        <p className='Chat_MessageBox_Text_P'>
                                                            {item?.item && item?.item?.name ? (item?.item.user_id !== user?.id ? 'Owner of ' : 'Finder of ') + item?.item?.name : (item?.users && item?.users[0] && item?.users[0].id !== user?.id) ? 'Owner' : 'Finder'}
                                                        </p>
                                                        <p className="chat-message">
                                                            {(locationData && locationData.type && locationData.type === 'location') ? <>
                                                                <img src={MapIcon} width={15} /> Location
                                                            </> : (lastMessage?.length > 16) ? lastMessage.slice(0, 16) + '...' : lastMessage}
                                                        </p>
                                                    </div>
                                                    <div className='Chat_MessageBox_DateDiv mb-0'>
                                                        <p style={{ marginRight: '6%' }}>
                                                            {localTimeZone(item.last_message?.created_at)}
                                                        </p>
                                                        <div>
                                                            <IconButton onClick={(event) => {
                                                                event.stopPropagation();
                                                                handleMobileArchiveClick(event, index);
                                                            }} >
                                                                <MoreHorizIcon />
                                                            </IconButton>
                                                            <Menu
                                                                anchorEl={archiveAnchorE2[index]}
                                                                open={Boolean(archiveAnchorE2[index])}
                                                                onClose={handleCloseArchiveDropdownList}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'right',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'left',
                                                                }}
                                                            >
                                                                <MenuItem onClick={() => archivedChats ? handleCloseUnarchiveDropdown(item?.id) : handleCloseArchiveDropdown(item?.id)}>
                                                                    <Typography style={{ fontSize: "14px" }}>{archivedChats ? 'Restore' : 'Archive Chat'}</Typography>
                                                                </MenuItem>
                                                            </Menu>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </> : <>
                                        <div style={{ width: '100%' }}>
                                            <p className='text-center mt-4' style={{ color: 'rgb(221, 221, 221)' }}>No Conversation Yet</p>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        ) : (
                            <div className='Chat_RightContainer'>
                                <div>
                                    <div style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div className='Chat_RightContainer_TitleDiv'>
                                            <div className='Chat_RightContainer_ImageDiv'>
                                                <img
                                                    src={(user?.email === activeChannel?.users[0]?.email) ? (activeChannel?.users[1]?.looser?.profile_picture || Avatar) : (activeChannel?.users[0]?.looser?.profile_picture || Avatar)}
                                                />
                                            </div>
                                            <div className='Chat_SenderNameDiv'>
                                                <p className='Chat_MessageBox_Text_P mb-2'>
                                                    {' '}
                                                    {activeChannel?.item && activeChannel?.item?.name ?
                                                        (activeChannel?.item.user_id !== user?.id
                                                            ? 'Owner of '
                                                            : 'Finder of ') + activeChannel?.item?.name
                                                        : (activeChannel?.users && activeChannel?.users[0] && activeChannel?.users[0].id !== user?.id) ? 'Owner' : 'Finder'}
                                                </p>
                                                {/* <p style={{ color: '#64748B', fontSize: '13px' }}>{selectedChat.description}</p> */}
                                            </div>
                                        </div>
                                        <IconButton onClick={handleMenuClick}>
                                            <MoreHorizIcon />
                                        </IconButton>

                                        <Menu
                                            id="chat-options-menu"
                                            anchorEl={anchorEl}
                                            open={isMenuOpen}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                        >
                                            {(isUserBlocked) ?
                                                <MenuItem
                                                    onClick={() => setUnBlockModal(true)}
                                                    sx={{ fontSize: '14px', py: 0.5, minHeight: '30px' }}
                                                >
                                                    Unblock
                                                </MenuItem>
                                                :
                                                <MenuItem
                                                    onClick={() => setBlockModal(true)}
                                                    sx={{ fontSize: '14px', py: 0.5, minHeight: '30px' }}
                                                >
                                                    Block
                                                </MenuItem>
                                            }
                                        </Menu>

                                    </div>
                                    <div className='Chat_ChatDivider' />
                                    <p style={{ margin: '1rem', color: '#D10000', textAlign: 'center', fontSize: '14px', backgroundColor: '#fbf0f1', padding: '6px', borderRadius: '5px' }}>
                                        Remember, QRTag.it advises against sharing personal information.
                                    </p>
                                </div>

                                <div className='Chat_ChatDiv'>
                                    {(messageList.length > 0) ? <>

                                        {messageList.map((item, index) => {

                                            const isSender = loggedIn ? item.send_by === user.id : item.send_by_temp === user.id;

                                            return (
                                                <>
                                                    {(isSender) ? (
                                                        <div className='Chat_SenderChatDiv'>
                                                            <div className='Chat_SenderChatSubDiv' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: "end", }}>
                                                                <div
                                                                    className={item.extra_message?.type === 'location' ? 'Chat_SenderChatSubDiv_map' : 'Chat_SenderChatSubDiv_P'}
                                                                >
                                                                    {item.extra_message?.type === 'location' ? (
                                                                        <StaticMap {...item.extra_message.location} />
                                                                    ) : (
                                                                        item.text
                                                                    )}
                                                                </div>
                                                                <small className='Chat_MessageTime'>{moment(item.created_at).tz(moment.tz.guess()).format('hh:mm A')}</small>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='Chat_RevievedChatDiv' style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start" }}>
                                                            {/* <small className='Chat_MessageTime'>Andri Thomas</small> */}
                                                            <div className='Chat_RevievedChatSubDiv_P'>
                                                                <div key={`message-${index}`}>
                                                                    {item.extra_message?.type === 'location' ? (
                                                                        <StaticMap {...item.extra_message.location} />
                                                                    ) : (
                                                                        item.text
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <small className='Chat_MessageTime'>{moment(item.created_at).tz(moment.tz.guess()).format('hh:mm A')}</small>
                                                        </div>

                                                    )}
                                                </>
                                            )
                                        })}

                                    </> : <>
                                        <h1>Start Chat</h1></>
                                    }
                                </div>

                                <div>
                                    <div className='Chat_TypingDivider' />
                                    {(isUserBlocked) ? <>
                                        <div className='Chat_TypingDiv'
                                            style={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            <p style={{ color: '#818181', width: '100%', textAlign: 'center', margin: '2%' }}>You have blocked this user</p>
                                        </div>
                                    </> : (isUserBeenBlocked) ? <>

                                        <div className='Chat_TypingDiv'
                                            style={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            <p style={{ color: '#818181', width: '100%', textAlign: 'center', margin: '2%' }}>You have been blocked by this user</p>
                                        </div>
                                    </> : <>
                                        <div className='Chat_TypingDiv' style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className='Chat_TypingSubDiv' style={{ backgroundColor: '#eff4fb' }}>
                                                {!isIOS() && <IconButton onClick={sendLocation} size='small'><PlaceOutlined sx={{ fill: "#ef4444" }} /></IconButton>}
                                                <input
                                                    type='text'
                                                    placeholder='Type something here...'
                                                    value={message}
                                                    onKeyPress={(e) => {
                                                        const trimmedMessage = message?.trim();
                                                        if (!trimmedMessage) {
                                                            return;
                                                        } else if (e.key !== 'Enter') return;
                                                        sendMessage(message);
                                                    }}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </div>
                                            <div
                                                className='Chat_SendBtn'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const trimmedMessage = message?.trim();
                                                    if (!trimmedMessage) {
                                                        return;
                                                    } else {
                                                        sendMessage(message);
                                                    }
                                                }}
                                            >
                                                <img src={SendIcon} />
                                            </div>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <div className='d-none d-md-block'>
                <Footer />
            </div>

            {
                featureModal && (
                    <UnlockFeatureModal
                        open={featureModal}
                        setOpen={setFeatureModal}
                    />
                )
            }

            {
                blockModal && (
                    <BlockUserModal
                        open={blockModal}
                        setOpen={setBlockModal}
                        currentChannel={activeChannel}
                        setIsUserBlocked={setIsUserBlocked}
                    />
                )
            }

            {
                unBlockModal && (
                    <UnBlockUserModal
                        open={unBlockModal}
                        setOpen={setUnBlockModal}
                        currentChannel={activeChannel}
                        setIsUserBlocked={setIsUserBlocked}
                    />
                )
            }
        </div >
    )

}

export default Chat;