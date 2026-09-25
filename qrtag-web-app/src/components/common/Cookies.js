import '../css/App.css';
import { useEffect, useState } from 'react';

const Cookies = ({ handleClose, handleDeclineClose }) => {
    return (
        <div className='pt-3 pt-md-0' style={{ backgroundColor: '#f9fafb', textAlign: 'center' }}>
            <div className='container'>

                <div className='row justify-content-center justify-content-lg-between align-items-center'>
                    <div className='col-12 col-lg-9'>
                        <p className='mb-0 text-center text-lg-end' style={{ fontSize: '14px', fontWeight: 400 }}>
                            We use our own and third-party cookies to personalize content and to analyse web traffic.
                        </p>
                    </div>

                    <div className='col-12 col-lg-3 d-none d-lg-flex justify-content-lg-end gap-2 pb-3'>
                        <button
                            style={{
                                backgroundColor: '#1e5af9',
                                borderRadius: '10px',
                                padding: '8px 17px',
                                fontWeight: 400,
                                color: '#fff',
                                maxWidth: '120px'
                            }}
                            className='decline_btn'
                            onClick={handleClose}
                        >
                            Agree
                        </button>
                        <button
                            style={{
                                backgroundColor: 'transparent',
                                borderRadius: '10px',
                                padding: '8px 17px',
                                fontWeight: 400,
                                maxWidth: '120px'
                            }}
                            className='decline_btn'
                            onClick={handleDeclineClose}
                        >
                            Decline
                        </button>
                    </div>
                </div>

                <div className='d-flex d-lg-none justify-content-center gap-2 pb-4'>
                    <button
                        style={{
                            backgroundColor: '#1e5af9',
                            borderRadius: '10px',
                            padding: '8px 17px',
                            fontWeight: 400,
                            color: '#fff',
                            maxWidth: '120px'
                        }}
                        className='decline_btn'
                        onClick={handleClose}
                    >
                        Agree
                    </button>
                    <button
                        style={{
                            backgroundColor: 'transparent',
                            borderRadius: '10px',
                            padding: '8px 17px',
                            fontWeight: 400,
                            maxWidth: '120px'
                        }}
                        className='decline_btn'
                        onClick={handleDeclineClose}
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cookies;
