import * as React from 'react';
import FB_Logo from '../../images/fb-new.png';
import Apple_Logo from '../../images/apple-new.png';
import Google_Logo from '../../images/google-new.png';
import { UpdateStore } from '../../StoreContext';
import { AuthService, AuthResendSignup, AuthResendActivation } from '../../services/auth';
import { LoginSocialApple, LoginSocialFacebook, LoginSocialGoogle } from 'reactjs-social-login'
import { toast } from 'react-toastify';
import { Button, Box, Modal, Typography, TextField } from '@mui/material'
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';

export default function SocialLogin() {

    const nav = useNavigate();
    const updateStore = UpdateStore();
    const [fbData, setFbData] = React.useState(null)
    const [addModal, setAddModal] = React.useState(false)
    const [email, setEmail] = React.useState('')

    async function resendConfirmationCode(useremail) {
        try {
            AuthResendSignup({ email: useremail }, (response) => {
                if (response && response.success) {
                    // toast.success('Code resent successfully');
                } else {
                    // toast.error("Resend failed. Please try again later!")
                }
            });
        } catch (err) {
            console.log('error resending code: ', err);
        }
    }

    async function resendActivationCode(useremail) {
        try {
            AuthResendActivation({ email: useremail }, (response) => {
                if (response && response.success) {
                    // toast.success('Code resent successfully');
                } else {
                    // toast.error("Resend failed. Please try again later!")
                }
            });
        } catch (err) {
            console.log('error resending code: ', err);
        }
    }

    // HANDLE LOGIN API
    const handleLogin = (params) => {
        try {
            AuthService('/users/social-login/', params, (response) => {
                if (response?.data && !response.data.user?.has_accepted_terms) {
                    toast.error(`Please agree to the Terms & Conditions!`)
                    nav('/acceptterms', { state: { username: response.data.user?.email } });
                } else if (response.data && !response.data.user?.email_verified) {
                    toast.error(`Please verify your email account!`)
                    resendConfirmationCode(response.data.user?.email)
                    setEmail(response.data.user?.email)
                    nav('/verificationcode', { state: { username: response.data.user?.email } });
                } else if (response.data && !response.data.user?.is_active) {
                    toast.error(`Your account has been deactivated. Please verify your email account to continue!`)
                    resendActivationCode(response.data.user?.email)
                    setEmail(response.data.user?.email)
                    nav('/reactivationcode', { state: { username: response.data.user?.email } });
                } else if (response.data) {
                    localStorage.setItem('user', JSON.stringify(response?.data.user));
                    updateStore({ user: response?.data.user, loggedIn: true, accessToken: response?.data.access });
                    localStorage.setItem('userData', JSON.stringify(response?.data.user));
                    localStorage.setItem('accessToken', response?.data.access);

                    if (sessionStorage.getItem('uuidcode')) {
                        nav(`/uuid/${sessionStorage.getItem('uuidcode')}`)
                    } else {
                        nav('/')
                    }

                } else {
                    if (response && response.error && response.error.data && response.error.data.detail) {
                        toast.error(`${response && response.error && response.error.data.detail}`)
                    } else {
                        toast.error(`Login Failed!`)
                    }
                }
            });
        } catch (error) {
            console.log('error signing in', error.message);
        }
    }

    // GOOGLE LOGIN
    const handleGoogle = (data) => {
        try {
            const params = {
                access_token: data?.access_token,
                scopes: [
                    "openid",
                    "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/userinfo.profile"
                ],
                user: {
                    "email": data?.email,
                    "familyName": data?.family_name,
                    "givenName": data?.given_name,
                    "id": data?.sub,
                    "name": data?.name,
                    "photo": data?.picture || null
                },
                provider: "google"
            }

            handleLogin(params)
            if (data?.email) {
                setEmail(data?.email)
            }
        } catch (error) {
            console.log('error signing in', error.message);
        }
    }

    // Facebook Login
    const handleFacebook = (data) => {
        try {
            const params = {
                email: data?.email,
                firstName: data?.first_name,
                imageURL: '',
                lastName: data?.last_name,
                linkURL: null,
                middleName: null,
                name: data?.name,
                userId: data?.userId,
                provider: 'facebook'
            }

            handleLogin(params)
            if (data?.email) {
                setEmail(data?.email)
            }
        } catch (error) {
            console.log('error signing in', error.message)
        }
    }

    const handleApple = (data) => {
        try {
            if (data) {
                const decoded = jwtDecode(data?.authorization?.id_token)
                if (decoded) {
                    const params = {
                        "authorizationCode": data?.authorization?.code,
                        "authorizedScopes": [],
                        "email": decoded?.email,
                        "fullName": {
                            "familyName": null,
                            "givenName": decoded?.name,
                            "middleName": null,
                            "namePrefix": null,
                            "nameSuffix": null,
                            "nickname": null
                        },
                        "identityToken": data?.authorization?.id_token,
                        "nonce": null,
                        "provider": "apple",
                        "platform": "web",
                        "realUserStatus": 1,
                        "state": data?.authorization?.state,
                        "user": decoded?.sub
                    }

                    handleLogin(params)
                    if (decoded?.email) {
                        setEmail(decoded?.email)
                    }
                }
            }
        } catch (error) {
            console.log('error signing in', error.message)
        }
    }

    const onSubmit = () => {
        try {
            if (email !== '') {
                const params = {
                    email: email,
                    firstName: fbData?.first_name,
                    imageURL: '',
                    lastName: fbData?.last_name,
                    linkURL: null,
                    middleName: null,
                    name: fbData?.name,
                    userId: fbData?.userId,
                    provider: 'facebook'
                }

                handleLogin(params)
            }
        } catch (error) {
            console.log('error signing in', error.message)
        }
    }

    return (
        <>
            <div className='LogIn_SocialContainer'>
                <div className='LogIn_SocialDiv' style={{ width: "auto" }}>
                    <div className='mx-1'>
                        <LoginSocialFacebook
                            appId='812715010773283'
                            onResolve={({ data }) => {
                                if (data?.email) {
                                    handleFacebook(data)
                                } else {
                                    setFbData(data)
                                    setAddModal(!addModal)
                                }
                            }}
                            onReject={(error) => {
                                console.log('error', error)
                            }}
                        >
                            <img style={{ width: '45px', cursor: 'pointer' }} src={FB_Logo} />
                        </LoginSocialFacebook>

                    </div>
                    <div className='mx-1'>
                        <LoginSocialApple
                            client_id='it.qrtag.qrtagit-web'
                            redirect_uri='https://app.qrtag.it/'
                            scope="name email"
                            onResolve={({ data }) => {
                                handleApple(data);
                            }}
                            onReject={err => {
                                console.log(err);
                            }}
                        >
                            <img style={{ width: '45px', cursor: 'pointer' }} src={Apple_Logo} />
                        </LoginSocialApple>
                    </div>
                    <div className='mx-1'
                        style={{
                            // borderRadius: '50%',
                            cursor: 'pointer',
                            // border: '1px solid #A8A8A8',
                            // padding: '7px'
                        }}
                    >
                        <LoginSocialGoogle
                            client_id="910563663170-g97645e3vuqoh46neo6pspr47b48utip.apps.googleusercontent.com"
                            scope="openid profile email"
                            onResolve={({ data }) => {
                                handleGoogle(data)
                            }}
                            onReject={err => {
                                console.log(err);
                            }}
                        >
                            <img style={{ width: '45px' }} src={Google_Logo} />
                        </LoginSocialGoogle>
                    </div>
                </div>
            </div>


            {/* Email modal */}
            <Modal open={addModal} onClose={() => setAddModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h4">
                        Please provide your email below to complete your login
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button variant="contained" className='Close_BtnDiv' onClick={() => setAddModal(false)}>
                            Close
                        </Button>
                        <Button variant="contained" className='Submit_BtnDiv' onClick={onSubmit}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
