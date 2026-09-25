import React, { useRef, useState } from 'react'
import Box from '@mui/material/Box';
import { Modal, Button, FormControl, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { AddMemorialPhotos } from '../../services/user';
import { useForm, Controller } from 'react-hook-form';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 520,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: "20px",
    borderRadius: '10px',
    overflow: 'auto',
};

export default function BasicModal({ open, setOpen, itemId, getList }) {

    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null)
    const fileInputRef = useRef(null)

    const { handleSubmit, control, formState: { errors }, getValues, setValue, reset } = useForm({
        defaultValues: {
            title: '',
            photo: null,
        },
    })

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        setOpen(false);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const readFile = (file, setter) => {
        const reader = new FileReader()
        reader.onload = (e) => setter(e.target.result)
        reader.readAsDataURL(file)
    }

    const submitItem = async () => {
        if (loading) return

        const { title, photo } = getValues()

        const params = new FormData()
        params.append('title', title)
        params.append('image', photo)
        if (itemId) params.append('memorial_id', itemId)

        setLoading(true)
        try {
            AddMemorialPhotos(params, (response) => {
                setLoading(false)
                if (response?.success) {
                    toast.success('Photo added successfully!')
                    reset()
                    setPhotoPreview(null)
                    setOpen(false)
                    getList()
                } else {
                    const detail = response?.error?.data?.detail
                    toast.error(detail || 'Failed to add photo!')
                }
            })
        } catch (err) {
            setLoading(false)
            toast.error('Something went wrong!')
        }
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                disableEscapeKeyDown
                style={{ overflow: 'auto' }}
            >
                <Box sx={style} className="modal-body">
                    <div style={{ position: 'relative', width: '100%' }}>
                        <div
                            style={{
                                position: 'absolute',
                                right: '0%',
                                marginTop: '0%',
                                border: '2px solid #000',
                                borderRadius: '50%',
                                padding: '3px',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
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

                        <Typography sx={{ marginTop: '5%' }} className='text-center' id='modal-modal-title' style={{ fontWeight: 'bold' }} component='h6' variant='h6'>
                            Add Photo
                        </Typography>

                        <form onSubmit={handleSubmit(submitItem)} style={{ width: "100%" }}>

                            <FormControl fullWidth>
                                <label htmlFor="title" style={{ display: 'inline-flex' }}>
                                    Title <span className="text-danger">*</span>
                                </label>

                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px" }}>
                                    <Controller
                                        name="title"
                                        control={control}
                                        rules={{ required: 'Title is required' }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                className='LogIn_InputEmail'
                                                type="text"
                                                id="title"
                                                placeholder="Enter Title"
                                                style={{ flexGrow: 1, border: "none", paddingBlock: "3px", outline: "none" }}
                                            />
                                        )}
                                    />
                                </div>
                                {errors.title && <p className='error-validation mt-2' style={{ textAlign: 'left' }}>{errors.title.message}</p>}
                            </FormControl>

                            <FormControl fullWidth className='mt-2'>
                                <label htmlFor="photo" style={{ display: "inline-flex" }}>
                                    Photo <span className="text-danger">*</span>
                                </label>

                                <div style={{ alignItems: "center" }}>
                                    <Controller
                                        name="photo"
                                        control={control}
                                        rules={{ required: 'Photo is required' }}
                                        render={({ field }) => (
                                            <>
                                                <Box
                                                    onClick={() => fileInputRef.current.click()}
                                                    sx={{
                                                        width: '100%',
                                                        border: '2px dashed #ccc',
                                                        borderRadius: 1,
                                                        p: 2,
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        bgcolor: '#f9f9f9',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    Click to upload photo
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        style={{ display: 'none' }}
                                                        onChange={e => {
                                                            const file = e.target.files[0];
                                                            field.onChange(file);
                                                            readFile(file, setPhotoPreview);
                                                        }}
                                                    />
                                                </Box>

                                                {photoPreview && (
                                                    <Box
                                                        component="img"
                                                        src={photoPreview}
                                                        alt="Preview"
                                                        sx={{
                                                            mt: 1,
                                                            width: 150,
                                                            height: 150,
                                                            objectFit: 'cover',
                                                            borderRadius: 1
                                                        }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                                {errors.photo && <p className='error-validation mt-2' style={{ textAlign: 'left' }}>{errors.photo.message}</p>}
                            </FormControl>

                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{
                                    mt: 5,
                                    mb: 2,
                                    display: 'block',
                                    width: '100%',
                                    height: '50px',
                                    mx: 'auto',
                                    borderColor: '#1e5af9',
                                    borderRadius: '5px',
                                    backgroundColor: '#1e5af9',
                                    color: '#fff',
                                    '&:hover': {
                                        borderColor: '#1e5af9',
                                        color: '#fff',
                                        backgroundColor: '#1e5af9',
                                    },
                                }}
                            >
                                {!loading ? (
                                    <div>Submit</div>
                                ) : (
                                    <PulseLoader size={15} color='#ffffff' />
                                )}
                            </Button>
                        </form>
                    </div>
                </Box>
            </Modal>
        </div >
    );
}