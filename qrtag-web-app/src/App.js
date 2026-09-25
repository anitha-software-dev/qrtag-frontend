import './components/css/App.css';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import Admin from './components/container/Admin';
import Home from './components/container/Home';
import FindWidget from './components/container/FindWidget';
import MyStuff from './components/container/MyStuff';
// import NotFound from './components/NotFound';
import About from './components/container/About';
import Login from './components/container/Login';
import SignUp from './components/container/SignUp';
import AcceptTerms from './components/container/AcceptTerms';
import ForgetPassword from './components/container/ForgetPassword';
import ConfirmPassword from './components/container/ConfirmPassword';
import VerificationCode from './components/container/VerificationCode';
import ReactivationCode from './components/container/ReactivationCode';
import VerificationResetCode from './components/container/VerificationResetCode';
import DeleteAccount from './components/container/DeleteAccount';
import DeleteAccountCode from './components/container/DeleteAccountCode';
import Store from './components/container/Store';
import StoreCart from './components/container/StoreCart';
import StoreItem from './components/container/StoreItem';
import Chat from './components/container/Chat';
import Notifications from '../src/components/container/Notifications';
import SubscriptionResponse from '../src/components/container/SubscriptionResponse';
import Subscription from '../src/components/container/Subscription';
import OrderLists from '../src/components/container/OrderLists';
import OrderDetail from '../src/components/container/OrderDetail';
import MyQRTags from './components/container/MyQRTags';
import EditProfile from './components/container/EditProfile'
import SurveyForm from './components/container/SurveyForm';
import MemorialDetails from './components/container/MemorialDetails'
import MemorialList from './components/container/MemorialList'
import Finder from './components/container/Finder'
import ItemDetail from './components/container/ItemDetail'

import { React, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { Store as ContextStore, UpdateStore } from './StoreContext';
import { RecieveChannelList } from './services/chat';
import { toast } from 'react-toastify';
import Axios from './config/axios';


const pubnub = new PubNub({
  publishKey: 'pub-c-e402503d-be87-49c1-8de2-c163e902d202',
  subscribeKey: 'sub-c-e45da188-49e0-48e6-9aec-f29c548ec6ed',
  uuid: 'sec-c-N2RhMzE3YTctNTJkMy00Zjk2LWE2NzItYjVjYzhmZGZhZWE4',
});

function App() {
  mixpanel.init('29bc6dc47ac430eeec08c916b09b61e4');
  const { loggedIn, user, channels, messages, firebaseToken } = ContextStore();

  const updateStore = UpdateStore();
  useEffect(() => {
    if (user.id !== undefined) {
      pubnub.setUUID(user.id + 'User');
      RecieveChannelList(user.id);
      let listener = {
        message: (event) => {
          let name = event?.message?.user?.name;
          let email = event?.message?.user?.email;
          let id = event?.message?.user?.id;
          if (window.location.pathname === '/chat' || user?.id === id) {
            return;
          } else {
            toast.success('You have got a new message from ' + (name || email || 'User'));
            updateStore({ notification: true });
          }
        },
      };
      pubnub.addListener(listener);
      // pubnub.subscribe({ channels: channelList.map((c) => c.id) });

      pubnub.subscribe({ channels: channels.map((c) => c.id) });
      return () => {
        pubnub.removeListener(listener);
        pubnub.unsubscribe({ channels: channels.map((c) => c.id) });
      };
    }
  }, [channels.length, user.id]);

  useEffect(() => {
    Axios.get('/common/configuration/').then((resp) => {
      updateStore({ messages: resp.data });
    }).catch(() => { });

    if (loggedIn) {
      Axios.get(`/users/detail/`).then((response) => {
        if (response && response?.data) {
          localStorage.setItem('user', JSON.stringify(response?.data));
          updateStore({ user: response?.data });
          localStorage.setItem('userData', JSON.stringify(response?.data));
        }
      })
    }
  }, [loggedIn])

  return (
    <PubNubProvider client={pubnub}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Navigate to={'/about'} />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/forgetpassword' element={<ForgetPassword />} />
          <Route path='/confirmpassword' element={<ConfirmPassword />} />
          <Route path='/verificationcode' element={<VerificationCode />} />
          <Route path='/verifyresetcode' element={<VerificationResetCode />} />
          <Route path='/reactivationcode' element={<ReactivationCode />} />
          <Route path='/account/delete' element={<DeleteAccount />} />
          <Route path='/account/delete/code' element={<DeleteAccountCode />} />
          <Route path='/acceptterms' element={<AcceptTerms />} />

          <Route path='/uuid/:uid' element={<Finder />} />
          <Route path='/widget/:wid' element={<FindWidget />} />
          <Route path='/chat' element={<Chat />} />

          {!loggedIn ? (
            <>
              <Route path='/' element={<Login />} />
              <Route path='/store/cart' element={<StoreCart />} />
              <Route path='/store' element={<Store />} />
              <Route path='/viewitems' element={<Home />} />
            </>
          ) : (
            <>
              <Route path='admin' element={<Admin />} />
              <Route path='/viewitems' element={<Home />} />
              <Route path='/store/item/:id' element={<StoreItem />} />
              <Route path='/store/cart' element={<StoreCart />} />
              <Route path='/store' element={<Store />} />
              <Route path='/' element={<MyStuff />} />
              <Route path='/mystuff/item/:id' element={<ItemDetail />} />
              <Route path='/myqrtags' element={<MyQRTags />} />

              <Route path='/subscription/payment/:response' element={<SubscriptionResponse />} />
              <Route path='/subscription' element={<Subscription />} />
              <Route path='/orders' element={<OrderLists />} />
              <Route path='/order/view/:type/:id' element={<OrderDetail />} />

              <Route path='/notifications' element={<Notifications />} />

              <Route path='/editprofile' element={<EditProfile />} />
              <Route path='/submit-survey' element={<SurveyForm />} />

            </>
          )}
          <Route path='/about' element={<About />} />
          <Route path='/memorial' element={<MemorialList />} />
          <Route path='/memorial/:id' element={<MemorialDetails />} />

        </Routes>
        <ToastContainer position='bottom-right' />
      </BrowserRouter>
    </PubNubProvider>
  );
}

export default App;
