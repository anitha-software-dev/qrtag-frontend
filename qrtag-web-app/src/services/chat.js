import Axios from '../config/axios';
import { UpdateStoreRef } from '../StoreContext';

export const RecieveChannelList = (
  id,
  callback = ({ success, data }) => {}
) => {
  Axios.get(`/message/channel-list/?user_id=${id}`)
    .then((response) => {
      UpdateStoreRef.current.updateStore({
        channels: response.data.sort(
          (a, b) =>
            new Date(b?.last_message?.created_at).valueOf() -
            new Date(a?.last_message?.created_at).valueOf()
        ),
      });
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const RecieveArchivedChannelList = (
  id,
  callback = ({ success, data }) => {}
) => {
  Axios.get(`/message/archived-channels/?user_id=${id}`)
    .then((response) => {
      const res = response?.data.sort(
        (a, b) =>
          new Date(b?.last_message?.created_at).valueOf() -
          new Date(a?.last_message?.created_at).valueOf()
      )
      callback({ success: true, data: res });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const HandleMessageHistory = (
  item,
  callback = ({ success, data }) => {}
) => {
  Axios.get(`/message/?channel=${item.id}`)
    .then((response) => {
      // setMessageList(response?.data);
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      console.log(' recieveMessageList error', error);
      callback({ success: false });
    });
};

export const HandleCurrentMessageHistory = (
  item,
  callback = ({ success, data }) => {}
) => {
  Axios.get(`/message/?channel=${item}`)
    .then((response) => {
      // setMessageList(response?.data);
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      console.log(' recieveMessageList error', error);
      callback({ success: false });
    });
};

export const HandleMessageHistoryByID = (
  id,
  callback = ({ success, data }) => {}
) => {
  Axios.get(`/message/?user_id=${id}`)
    .then((response) => {
      // setMessageList(response?.data);
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      console.log(' recieveMessageList error', error);
      callback({ success: false });
    });
};

export const GetChannelID = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/message/get-channel`, postData)
    .then((response) => {
      // setMessageList(response?.data);
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      console.log(' GetChannelID error', error);
      callback({ success: false });
    });
};

export const GetWidgetChannelID = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/widget/get-channel/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      console.log(' GetChannelID error', error);
      callback({ success: false });
    });
};

export const ChatService = (
  url,
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(url, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error.response });
    });
};
