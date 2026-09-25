import Axios from '../config/axios';

export const AuthLogin = (
  postData,
  callback = ({ success, data, response }) => {}
) => {
  Axios.post(`/users/login/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error.response });
    });
};

export const AuthSignup = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/signup/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false, error: error.response });
    });
};

export const AuthConfirmSignup = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/signup/verify-code/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const AuthResendSignup = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/signup/resend-code/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const AuthForgotPassword = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/password-reset/send-token/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const AuthResendForgot = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/password-reset/resend-code/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const AuthResetPassword = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/password-reset/set-password/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const AuthService = (
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

export const AuthConfirmActivation = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/reactivation/verify-code/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const AuthSendActivation = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/reactivation/send-code/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const AuthResendActivation = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/reactivation/resend-code/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};

export const AuthAcceptTerms = (
  postData,
  callback = ({ success, data }) => {}
) => {
  Axios.post(`/users/agree-terms/`, postData)
    .then((response) => {
      callback({ success: true, data: response?.data });
    })
    .catch((error) => {
      callback({ success: false });
    });
};