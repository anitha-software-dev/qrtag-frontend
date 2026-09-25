import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Modal, Button, FormControl, Typography, Switch, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { AddMyItem } from '../../services/user';
import { Add } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form';
import { Store } from '../../StoreContext';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -28%)',
    width: 520,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: "20px",
    borderRadius: '10px',
    overflow: 'auto',

};

export default function BasicModal({ open, setOpen, itemId, getList, itemTypes, checkIsEligible, handleUser }) {

    const { messages } = Store();
    const [loading, setLoading] = React.useState(false);
    const fileInputRefs = [React.useRef(null), React.useRef(null), React.useRef(null)];
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [visibilityMessage, setVisibilityMessage] = React.useState(null);

    const [visibility, setVisibility] = useState({
        name: 'public',
        manufacturer: 'public',
        serial: 'public',
        description: 'public'
    })

    const handleToggle = (field) => {
        setVisibility((prev) => ({
            ...prev,
            [field]: prev[field] === 'public' ? 'private' : 'public'
        }))
    }

    const { handleSubmit, control, formState: { errors }, getValues, setValue } = useForm({
        defaultValues: {
            name: '',
            manufacturer: '',
            serial: '',
            estimated: '',
            type: '',
            description: '',
            photos: ['', '', ''],
        },
    })

    useEffect(() => {
        if (messages) {
            const res = messages.filter((item) => item.key === 'item_fields_visibility_message')
            if (res && res.length > 0) {
                setVisibilityMessage(res[0])
            }
        }
    }, [messages])


    const handleImageChange = (e, index) => {
        e.stopPropagation()
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                const currentPhotos = getValues('photos')
                const updatedPhotos = [...currentPhotos]
                updatedPhotos[index] = reader.result
                setValue('photos', updatedPhotos, { shouldValidate: true })
            }
        }
    }

    const handleClick = (index) => {
        if (fileInputRefs[index].current) {
            fileInputRefs[index].current.click();
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        setOpen(false);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleRemoveImage = (index) => {
        const currentPhotos = getValues('photos')
        const updatedPhotos = [...currentPhotos]
        updatedPhotos[index] = ''
        setValue('photos', updatedPhotos, { shouldValidate: true })
    }

    async function submitItem() {

        if (loading) {
            return;
        }
        const estimatedValue = parseFloat(getValues('estimated'),).toFixed(2);

        const params = {
            name: getValues('name'),
            manufacturer: getValues('manufacturer'),
            serial_no: getValues('serial'),
            item_type: getValues('type'),
            estimated_value: estimatedValue,
            description: getValues('description'),
            visibility
        }

        if (itemId) {
            params.item_id = itemId
        }

        const photos = getValues('photos')
        const images = []
        if (photos && photos.length > 0) {
            for (let i = 0; i < photos.length; i++) {
                if (photos[i] && photos[i] !== "") {
                    images.push({ photo: photos[i], is_cover: (i === 0) ? true : false })
                }
            }
        }

        params.photos = images

        setLoading(true);
        try {
            AddMyItem(params, (response) => {
                setLoading(false);
                if (response && response.success) {
                    checkIsEligible()
                    handleUser()
                    setOpen(false)
                    toast.success('Item added successfully!');
                    getList()
                } else {
                    if (response && response.error && response.error.data && response.error.data.detail) {
                        toast.error(`${response && response.error && response.error.data.detail}`)
                    } else {
                        toast.error(`Failed to add item!`)
                    }
                }
            });
        } catch (error) {
            setLoading(false);
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
                <Box sx={style}>
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
                            Add Item
                        </Typography>

                        <div style={{ display: 'flex', alignItems: 'center', marginBlock: '20px' }}>
                            <p style={{ fontSize: '14px', margin: 0, textAlign: "center" }}>
                                <InfoOutlinedIcon style={{ fontSize: '20px', color: '#0a3f74', marginRight: '7px', marginBottom: '5px' }} />
                                {(visibilityMessage && visibilityMessage?.value) ? visibilityMessage?.value : "You can set the field's visibility as either Public or Private, depending on whether you want it to be displayed to the finder."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(submitItem)} style={{ width: "100%" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginRight: isMobile ? "15%" : "12%", marginBottom: "-20px", fontSize: isMobile ? 12 : 14 }}>
                                <p className='mb-0 text-secondary'>Visibility</p>
                            </div>

                            <FormControl fullWidth>
                                <label htmlFor="name" style={{ display: "inline-flex" }}>
                                    Item Name <span className='text-danger '>*</span>
                                </label>

                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px" }}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: 'Item Name is required' }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                className='LogIn_InputEmail'
                                                type="text"
                                                id="name"
                                                placeholder="Name"
                                                style={{ flexGrow: 1, border: "none", paddingBlock: "3px", outline: "none" }}
                                            />
                                        )}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10%", padding: "0 10px", width: "120px", fontSize: isMobile ? "12px" : "14px", }}>
                                        {<span style={{
                                            flex: 1, textAlign: "left", position: "absolute", right: isMobile ? "90px" : "115px", backgroundColor: "#fff", paddingLeft: "10px"
                                        }}> Public</span>}

                                        <FormControlLabel
                                            control={<Switch checked={visibility.name === 'private'} onChange={() => handleToggle('name')}
                                                size={isMobile ? "small" : "medium"} />}
                                            style={{ backgroundColor: "#fff", position: "absolute", right: isMobile ? "30px" : "40px" }}
                                        />
                                        {<span style={{ flex: 1, textAlign: "right", position: "absolute", right: isMobile ? "5px" : "10px" }}>Private</span>}
                                    </div>
                                </div>
                                {errors.name && <p className='error-validation mt-2' style={{ textAlign: 'left' }}>{errors.name.message}</p>}
                            </FormControl>

                            <FormControl fullWidth className='mt-2'>
                                <label htmlFor="manufacturer" style={{ display: "inline-flex", }}>
                                    Item Manufacturer &nbsp; <span className='text-secondary' style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "400" }}>(Optional)</span>
                                </label>

                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px" }}>
                                    <Controller
                                        name="manufacturer"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                className='LogIn_InputEmail'
                                                type="text"
                                                id="manufacturer"
                                                placeholder="Manufacturer"
                                                style={{ flexGrow: 1, border: "none", paddingBlock: "3px", outline: "none" }}
                                            />
                                        )}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10%", padding: "0 10px", width: "120px", fontSize: isMobile ? "12px" : "14px", }}>
                                        {<span style={{
                                            flex: 1, textAlign: "left", position: "absolute", right: isMobile ? "90px" : "115px", backgroundColor: "#fff", paddingLeft: "10px"
                                        }}> Public</span>}

                                        <FormControlLabel
                                            control={<Switch checked={visibility.manufacturer === 'private'} onChange={() => handleToggle('manufacturer')} size={isMobile ? "small" : "medium"} />}
                                            style={{ backgroundColor: "#fff", position: "absolute", right: isMobile ? "30px" : "40px" }}
                                        />
                                        {<span style={{ flex: 1, textAlign: "right", position: "absolute", right: isMobile ? "5px" : "10px" }}>Private</span>}
                                    </div>
                                </div>
                            </FormControl>

                            <FormControl fullWidth className='mt-2'>
                                <label htmlFor="serial" style={{ display: "inline-flex" }}>
                                    Item Serial Number  &nbsp; <span className='text-secondary' style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "400" }}>(Optional)</span>
                                </label>

                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px" }}>
                                    <Controller
                                        name="serial"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                className='LogIn_InputEmail'
                                                type="text"
                                                id="serial"
                                                placeholder="Serial Number "
                                                style={{ flexGrow: 1, border: "none", paddingBlock: "3px", outline: "none" }}
                                            />
                                        )}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10%", padding: "0 10px", width: "120px", fontSize: isMobile ? "12px" : "14px", }}>
                                        {<span style={{
                                            flex: 1, textAlign: "left", position: "absolute", right: isMobile ? "90px" : "115px", backgroundColor: "#fff", paddingLeft: "10px"
                                        }}> Public</span>}

                                        <FormControlLabel
                                            control={<Switch checked={visibility.serial === 'private'} onChange={() => handleToggle('serial')} size={isMobile ? "small" : "medium"} />}
                                            style={{ backgroundColor: "#fff", position: "absolute", right: isMobile ? "30px" : "40px" }}
                                        />
                                        {<span style={{ flex: 1, textAlign: "right", position: "absolute", right: isMobile ? "5px" : "10px" }}>Private</span>}
                                    </div>
                                </div>
                            </FormControl>

                            <FormControl fullWidth className='mt-2'>
                                <label htmlFor="estimated" style={{ display: "inline-flex" }}>
                                    Estimated Value <span className='text-danger'>*</span>
                                </label>

                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px" }}>
                                    <Controller
                                        name="estimated"
                                        control={control}
                                        rules={{ required: 'Estimated Value is required' }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                className='LogIn_InputEmail'
                                                type="text"
                                                id="estimated"
                                                placeholder="Estimated Value"
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9.]/g, '')
                                                        .replace(/(\..*?)\..*/g, '$1')
                                                        .replace(/^(\d+)(\.\d{0,2})?.*/, '$1$2')
                                                }}
                                                style={{ flexGrow: 1, border: "none", paddingBlock: "3px", outline: "none" }}
                                            />
                                        )}
                                    />
                                </div>

                                {errors.estimated && (
                                    <p className='error-validation mt-2' style={{ textAlign: 'left' }}>
                                        {errors.estimated.message}
                                    </p>
                                )}
                            </FormControl>

                            <div className='select-card'>
                                <FormControl fullWidth className='mt-2'>
                                    <label htmlFor="type" style={{ display: "inline-flex" }}>
                                        Item Type<span className='text-danger'>*</span>
                                    </label>

                                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px" }}>
                                        <Controller
                                            name="type"
                                            control={control}
                                            rules={{
                                                required: 'Item Type is required '
                                            }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className='LogIn_InputEmail'
                                                    style={{ flexGrow: 1, border: "none", paddingBlock: "3px", outline: "none", appearance: "none" }}
                                                >
                                                    <option value="">Select Type</option>
                                                    {itemTypes?.map((tp) => (
                                                        <option key={tp.id} value={tp.id}>{tp.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                    </div>
                                    {errors.type && (
                                        <p className='error-validation mt-2' style={{ textAlign: 'left' }}>
                                            {errors.type.message}
                                        </p>
                                    )}
                                </FormControl>

                                <FormControl fullWidth className='mt-2'>
                                    <label htmlFor="description" style={{ display: "inline-flex" }}>
                                        Description &nbsp; <span className='text-secondary' style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "400" }}>(Optional)</span>
                                    </label>

                                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px" }}>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <textarea
                                                    {...field}
                                                    className='LogIn_InputEmail'
                                                    id="description"
                                                    rows="3"
                                                    cols="29"
                                                    placeholder="Description "
                                                    style={{ flexGrow: 1, border: "none", paddingBlock: "3px", outline: "none", resize: "none", width: "100%" }}
                                                />
                                            )}
                                        />

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: isMobile ? "-15%" : "10%", marginBottom: isMobile ? "15%" : "10%", padding: "0 10px", width: "120px", fontSize: isMobile ? "12px" : "14px" }}>
                                            {<span style={{ flex: 1, textAlign: "left", position: "absolute", right: isMobile ? "90px" : "115px", backgroundColor: "#fff", paddingLeft: "10px" }}> Public</span>}

                                            <FormControlLabel
                                                control={<Switch checked={visibility.description === 'private'} onChange={() => handleToggle('description')} size={isMobile ? "small" : "medium"} />}
                                                style={{ backgroundColor: "#fff", position: "absolute", right: isMobile ? "30px" : "40px" }}
                                            />
                                            {<span style={{ flex: 1, textAlign: "right", position: "absolute", right: isMobile ? "5px" : "10px" }}>Private</span>}
                                        </div>
                                    </div>
                                </FormControl>

                            </div>

                            <FormControl fullWidth className='mt-2'>
                                <label htmlFor="image-upload" className='mb-2' style={{ display: "inline-flex" }}>
                                    Upload Item Images <span className='text-danger'>*</span>
                                </label>
                                <Controller
                                    name="photos"
                                    control={control}
                                    rules={{
                                        validate: (photos) => photos.filter(photo => photo !== '').length >= 1 || 'You need to upload at least 1 image.'
                                    }}
                                    render={({ field }) => (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                {field.value.map((photo, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            width: 70,
                                                            height: 70,
                                                            borderRadius: '10%',
                                                            backgroundColor: '#f5f5f5',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            cursor: 'pointer',
                                                            position: 'relative',
                                                            marginRight: '10px',
                                                            marginTop: '10px',
                                                            border: '1px solid rgb(223, 223, 223)'
                                                        }}
                                                        onClick={() => handleClick(index)}
                                                    >
                                                        {photo ? (
                                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                                <img src={photo} alt={`Selected ${index}`} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                                                                <div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '-8px',
                                                                        right: '-8px',
                                                                        border: '2px solid #ff0000',
                                                                        borderRadius: '50%',
                                                                        padding: '3px',
                                                                        backgroundColor: '#ff0000',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleRemoveImage(index)
                                                                    }}
                                                                >
                                                                    <CloseIcon style={{ width: '13px', height: '13px', color: 'white' }} />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <Add style={{ width: '50%', height: '50%' }} />
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageChange(e, index)}
                                                            style={{ display: 'none' }}
                                                            ref={fileInputRefs[index]}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', marginTop: '5px', gap: '30px' }}>
                                                {field.value.map((_, index) => (
                                                    <p
                                                        key={index}
                                                        style={{
                                                            fontSize: '14px',
                                                            textAlign: 'right',
                                                            marginTop: '5px',
                                                            color: index === 0 ? 'transparent' : '#888',
                                                        }}
                                                    >
                                                        {index === 0 ? 'Required' : 'Optional'}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                />
                                {errors.photos && <p className='error-validation mt-2' style={{ textAlign: 'left' }}>{errors.photos.message}</p>}
                            </FormControl>

                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{
                                    mt: 3,
                                    display: 'block',
                                    width: '100%',
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