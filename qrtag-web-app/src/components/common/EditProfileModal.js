import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
    // overflowY: 'auto',
    // overflowX: 'hidden',
};

export default function BasicModal() {
    const [open, setOpen] = React.useState(true);
    const [selectedImage, setSelectedImage] = React.useState(null);
    const fileInputRef = React.useRef(null);
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleClose = () => {
        navigate('/about', { state: null });
        setOpen(false);
    };

    const closeModal = () => {
        navigate('/about', { state: null });
        setOpen(false);
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box sx={style}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <div
                            style={{
                                position: 'absolute',
                                right: '-32px',
                                top: '-32px',
                                border: '1px solid #000',
                                cursor: 'pointer',
                                background: '#fff'
                            }}
                            onClick={closeModal}
                        >
                            <CloseIcon />
                        </div>

                    </div>
                    <div
                        className='text-center'
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>


                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                            />
                            <div
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                }}
                                onClick={handleClick}
                            >
                                {selectedImage ? (
                                    <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Selected Image"
                                        style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                    />
                                ) : (
                                    <div

                                    >
                                        <AccountCircleOutlinedIcon
                                            style={{
                                                width: '60%', height: '60%', color: '#0a3f74'
                                            }}
                                        />
                                    </div>
                                )}
                                <span style={{
                                    fontSize: '24px',
                                    color: '#fff',
                                    backgroundColor: '#0a3f74',
                                    borderRadius: '50%',
                                    padding: '10px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '30px',
                                    height: '30px',
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '0px',
                                }}>
                                    +
                                </span>
                            </div>

                        </div>
                        <div className='mt-2'>
                            <p>Add a profile image</p>
                        </div>


                        <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                            <input
                                className='LogIn_InputEmail mb-2'
                                type="text"
                                id="name"
                                name="name"
                                placeholder='Name'
                                rows="4"
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '10px',
                                }}
                            />

                            <input
                                className='LogIn_InputEmail mb-2'
                                type="email"
                                id="email"
                                name="email"
                                placeholder='Email'
                                rows="4"
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '10px',
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                            <input
                                className='LogIn_InputEmail mb-2'
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder='Phone'
                                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '10px',
                                }}
                            />

                            <input
                                className='LogIn_InputEmail mb-2'
                                type="text"
                                id="city"
                                name="city"
                                placeholder='City'
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '10px',
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                            <select
                                className='LogIn_InputEmail mb-2 '
                                id="State"
                                name="State"
                                placeholder='State'
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '10px',

                                }}
                            >
                                <option value="" disabled selected >State</option>
                                <option value="California">...</option>

                            </select>

                            <input
                                className='LogIn_InputEmail '
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                placeholder='Postal Code'
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '10px',
                                }}
                            />

                        </div>

                        <div sx={{}}>
                            <textarea className='LogIn_InputEmail' id="address" name="address" rows="4" cols="35" placeholder='Street Address' style={{ width: '100%', padding: '3% 3%' }} />
                        </div>

                        <Button
                            variant="outlined"
                            sx={{
                                mt: 3,
                                display: 'block',
                                width: '60%',
                                height: '50px',
                                mx: 'auto',
                                borderColor: '#0a3f74',
                                borderRadius: '30px',
                                backgroundColor: '#0a3f74',
                                color: '#fff',
                                '&:hover': {
                                    borderColor: '#0a3f74',
                                    color: '#fff',
                                    backgroundColor: '#0a3f74',
                                },
                            }}
                        >
                            Finish
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
