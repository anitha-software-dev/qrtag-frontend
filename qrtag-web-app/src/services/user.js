import Axios from '../config/axios';
import { UpdateStoreRef } from '../StoreContext';

export const HandleTempUser = (
  postData,
  callback = ({ success, data }) => { }
) => {
  Axios.post(`/users/create-temp-user/`, postData)
    .then((response) => {
      // console.log('HandleTempUser res', response);

      callback({ success: true, data: response?.data });
      UpdateStoreRef.current.updateStore({
        user: { id: response.data.user_id },
      });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const UpdateProfile = (
  url,
  postData,
  callback = ({ success, data }) => { }
) => {
  Axios.patch(url, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error });
    });
};

export const GetStates = (
  callback = ({ success, data }) => { }
) => {
  Axios.get(`/common/states/`)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const GetMyQRTags = (
  callback = ({ success, data }) => { }
) => {
  Axios.get(`/qrcode/qr-codes/`)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const SendQRCode = (
  postData,
  callback = ({ success, data }) => { }
) => {
  Axios.post('/qrcode/mail/', postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error });
    });
};

export const ApplyCouponCode = (
  postData,
  callback = ({ success, data }) => { }
) => {
  Axios.post('/users/apply-coupon/', postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error.response });
    });
};

export const GetUserProfile = (
  callback = ({ success, data }) => { }
) => {
  Axios.get('/users/detail/')
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error });
    });
};

export const GetUserDetails = () => {
  return new Promise((resolve, reject) => {
    Axios.get('/users/detail/')
      .then((response) => {
        resolve({ success: true, data: response?.data })
      })
      .catch((error) => {
        reject({ success: false, error })
      })
  })
}

export const AddMyItem = (
  postData,
  callback = ({ success, data }) => { }
) => {
  Axios.post('/looser/items/', postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error.response });
    });
};

export const UpdateMyItem = (
  id,
  postData,
  callback = ({ success, data }) => { }
) => {
  Axios.patch(`/looser/items/${id}/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error.response });
    });
};

export const AddMyTribute = (
  postData,
  callback = ({ success, data }) => { }
) => {
  Axios.post('/digital-memorial/tribute/', postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error.response });
    });
};

export const RequestHonoraryAccess = (
  postData,
  callback = ({ success, data }) => { }
) => {
  Axios.post('/looser/access-request/', postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error.response });
    });
};

export const SubmitSurvey = (
  postData,
  callback = ({ success, data }) => { }
) => {
  Axios.post("/users/survey-response/", postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error.response });
    });
};


export const AddMemorial = (formData, callback = ({ success, data }) => { }) => {
  Axios.post('/common/digital-memorial/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then((response) => {
      callback({ success: true, data: response?.data })
    })
    .catch((error) => {
      callback({ success: false, error: error })
    })
}

export const UpdateMemorial = (url, formData, callback = ({ success, data }) => { }) => {
  Axios.patch(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then((response) => {
      callback({ success: true, data: response?.data })
    })
    .catch((error) => {
      callback({ success: false, error: error })
    })
}


export const AddMemorialPhotos = (postData, callback = ({ success, data }) => { }) => {
  Axios.post('/common/memorial-photo/', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
    .then((response) => {
      callback({ success: true, data: response?.data })
    })
    .catch((error) => {
      callback({ success: false, error: error.response })
    })
}