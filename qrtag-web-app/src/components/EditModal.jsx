import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Switch, FormControlLabel } from '@mui/material';
import Modal from '@mui/material/Modal';
import './css/App.css';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Axios from '../config/axios';
import FilePicker from './FilePicker';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { useForm, Controller } from 'react-hook-form';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Store } from '../StoreContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -28%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: "10px",
    width: 520,
    padding: "20px",
    overflow: 'auto'
};


const EditModal = ({ handleClose, open, singleData, handleSingleData, itemTypes }) => {

    const { messages } = Store();

    const { handleSubmit, control, formState: { errors }, getValues, setValue } = useForm({
        defaultValues: {
            itemName: '',
            manufacturer: '',
            serialNo: '',
            estimated: '',
            type: '',
            description: '',
            photos: ['', '', ''],
        },
    })

    const [photosDeleted, setPhotosDeleted] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [visibilityMessage, setVisibilityMessage] = React.useState(null);

    const uploadInputRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);

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

    useEffect(() => {
        if (messages) {
            const res = messages.filter((item) => item.key === 'item_fields_visibility_message')
            if (res && res.length > 0) {
                setVisibilityMessage(res[0])
            }
        }
    }, [messages])

    useEffect(() => {
        if (singleData && open) {
            setValue('itemName', singleData?.name)
            setValue('manufacturer', singleData?.manufacturer)
            setValue('serialNo', singleData?.serial_no)
            setValue('estimated', singleData?.estimated_value)
            setValue('description', singleData?.description)
            setValue('type', (singleData?.item_type && singleData?.item_type?.id) ? singleData?.item_type?.id : null)
            setValue('photos', singleData?.photos?.map((item) => item.photo) || ['', '', ''])
            setValue('images', singleData?.photos || [])
            if (singleData?.visibility) {
                setVisibility(singleData?.visibility)
            }
        }
    }, [singleData, open, setValue])


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'estimated') {
            if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                setValue(name, value);
            }
        } else {
            setValue(name, value);
        }
    };


    const handleFile = (e) => {
        e.stopPropagation()
        const files = e.target?.files
        const images = []

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader()
            reader.readAsDataURL(files[i]) // Convert image to Base64
            reader.onloadend = () => {
                images.push(reader.result) // Push the Base64 string
                setValue('photos', [...getValues('photos'), ...images], { shouldValidate: true })
            }
        }
    }

    const handleClick = (index) => {
        uploadInputRefs.current[index].click();
    };

    const handleRemoveImage = (index) => {
        const removedImage = getValues('photos')[index]

        const imageToDelete = singleData?.photos[index]

        if (imageToDelete && imageToDelete.id) {
            setPhotosDeleted((prev) => [...prev, imageToDelete.id])
        }

        const updatedPhotos = getValues('photos').filter((_, i) => i !== index)
        setValue('photos', updatedPhotos, { shouldValidate: true })
    }


    const handleSaveEdit = () => {

        if (loading) {
            return;
        }

        const estimatedValue = parseFloat(getValues('estimated')).toFixed(2);

        const params = {
            name: getValues('itemName'),
            manufacturer: getValues('manufacturer'),
            serial_no: getValues('serialNo'),
            estimated_value: estimatedValue,
            item_type: getValues('type'),
            description: getValues('description'),
            photos: [{ photo: getValues('photos') }],
            deleted_photos: photosDeleted,
            visibility
        };

        const images = [];
        const photos = getValues('photos')
        if (photos && photos.length > 0) {
            for (let i = 0; i < photos.length; i++) {
                if (!photos[i].includes('/media/uploads/')) {
                    images.push({ photo: photos[i], is_cover: false })
                }
            }
        }

        params.photos = images;

        setLoading(true)

        Axios.patch(`/looser/items/${singleData?.id}/`, params)
            .then((res) => {
                setLoading(false)
                if (res) {
                    toast.success('Item details updated successfully!');
                    handleClose();
                    handleSingleData()
                }
            })
            .catch((err) => {
                toast.error('Update Failed!');
                setLoading(false)
            });

    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEscapeKeyDown
            style={{ overflowY: 'auto' }}
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
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </div>

                </div>
                <Typography id="modal-modal-title" className='text-center' variant="h6" component="h2">
                    Update Item
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center', marginBlock: '20px' }}>
                    <p style={{ fontSize: '14px', margin: 0, textAlign: "center" }}>
                        <InfoOutlinedIcon style={{ fontSize: '20px', color: '#0a3f74', marginRight: '7px', marginBottom: '5px' }} />
                        {(visibilityMessage && visibilityMessage?.value) ? visibilityMessage?.value : "You can set the field's visibility as either Public or Private, depending on whether you want it to be displayed to the finder."}
                    </p>
                </div>

                <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                    <form onSubmit={handleSubmit(handleSaveEdit)} style={{ width: "100%" }}>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginRight: isMobile ? "15%" : "12%", marginBottom: "-20px", fontSize: isMobile ? 12 : 14 }}>
                            <p className='mb-0 text-secondary'>Visibility</p>
                        </div>

                        <div className='all_fields'>
                            {/* <p>Name</p> */}
                            <label for="name" style={{ display: "inline-flex", fontWeight: "bold" }}>
                                Item Name <span className='text-danger'>*</span>
                            </label>

                            <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px", paddingRight: "10px" }}>
                                <Controller
                                    name="itemName"
                                    control={control}
                                    rules={{ required: 'Name is required' }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className='LogIn_InputEmail'
                                            type="text"
                                            placeholder="Name"
                                            style={{ flexGrow: 1, paddingBlock: "3px", border: "none", outline: "none" }}
                                        />
                                    )}
                                />

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10%", padding: "0 10px", width: "120px", fontSize: isMobile ? "12px" : "14px", }}>
                                    {<span style={{
                                        flex: 1, textAlign: "left", position: "absolute", right: isMobile ? "111px" : "135px", backgroundColor: "#fff", paddingLeft: "10px"
                                    }}> Public</span>}

                                    <FormControlLabel
                                        control={<Switch checked={visibility.name === 'private'} onChange={() => handleToggle('name')}
                                            size={isMobile ? "small" : "medium"} />}
                                        style={{ backgroundColor: "#fff", position: "absolute", right: isMobile ? "55px" : "60px" }}
                                    />
                                    {<span style={{ flex: 1, textAlign: "right", position: "absolute", right: "30px" }}>Private</span>}
                                </div>
                            </div>

                            {errors.itemName && <p className="error-validation mt-2">{errors.itemName.message}</p>}

                            {/* <p>Manufacturer</p> */}
                            <label for="manufacturer" className='mt-2' style={{ display: "inline-flex", fontWeight: "bold" }}>
                                Item Manufacturer &nbsp; <span className='text-secondary' style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "400" }}>(Optional)</span>
                            </label>
                            <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px", paddingRight: "10px" }}>
                                <Controller
                                    name="manufacturer"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className='LogIn_InputEmail'
                                            type="text"
                                            placeholder="Manufacturer "
                                            style={{ flexGrow: 1, paddingBlock: "3px", border: "none", outline: "none" }}
                                        />
                                    )}
                                />

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10%", padding: "0 10px", width: "120px", fontSize: isMobile ? "12px" : "14px", }}>
                                    {<span style={{
                                        flex: 1, textAlign: "left", position: "absolute", right: isMobile ? "111px" : "135px", backgroundColor: "#fff", paddingLeft: "10px"
                                    }}> Public</span>}

                                    <FormControlLabel
                                        control={<Switch checked={visibility.manufacturer === 'private'} onChange={() => handleToggle('manufacturer')}
                                            size={isMobile ? "small" : "medium"} />}
                                        style={{ backgroundColor: "#fff", position: "absolute", right: isMobile ? "55px" : "60px" }}
                                    />
                                    {<span style={{ flex: 1, textAlign: "right", position: "absolute", right: "30px" }}>Private</span>}
                                </div>
                            </div>

                            {/* <p>Serial No</p> */}
                            <label for="serial" className='mt-2' style={{ display: "inline-flex", fontWeight: "bold" }}>
                                Item Serial Number  &nbsp; <span className='text-secondary' style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "400" }}>(Optional)</span>
                            </label>
                            <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px", paddingRight: "10px" }}>
                                <Controller
                                    name="serialNo"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className='LogIn_InputEmail'
                                            type="text"
                                            placeholder="Serial Number "
                                            style={{ flexGrow: 1, paddingBlock: "3px", border: "none", outline: "none" }}
                                        />
                                    )}
                                />

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: "10%", padding: "0 10px", width: "120px", fontSize: isMobile ? "12px" : "14px", }}>
                                    {<span style={{
                                        flex: 1, textAlign: "left", position: "absolute", right: isMobile ? "111px" : "135px", backgroundColor: "#fff", paddingLeft: "10px"
                                    }}> Public</span>}

                                    <FormControlLabel
                                        control={<Switch checked={visibility.serial === 'private'} onChange={() => handleToggle('serial')}
                                            size={isMobile ? "small" : "medium"} />}
                                        style={{ backgroundColor: "#fff", position: "absolute", right: isMobile ? "55px" : "60px" }}
                                    />
                                    {<span style={{ flex: 1, textAlign: "right", position: "absolute", right: "30px" }}>Private</span>}
                                </div>
                            </div>

                            <label for="estimated" className='mt-2' style={{ display: "inline-flex", fontWeight: "bold" }}>
                                Estimated Value<span className='text-danger'>*</span>
                            </label>

                            <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px", paddingRight: "10px" }}>
                                <Controller
                                    name="estimated"
                                    control={control}
                                    rules={{
                                        required: 'Estimated Value is required ',

                                    }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className='LogIn_InputEmail'
                                            type="text"
                                            placeholder="Estimated Value"
                                            style={{ flexGrow: 1, paddingBlock: "3px", border: "none", outline: "none" }}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, '')
                                                    .replace(/(\..*?)\..*/g, '$1')
                                                    .replace(/^(\d+)(\.\d{0,2})?.*/, '$1$2');
                                            }}
                                        />
                                    )}
                                />

                            </div>
                            {errors.estimated && <p className="error-validation mt-2">{errors.estimated.message}</p>}

                            <label for="type" className='mt-2' style={{ display: "inline-flex", fontWeight: "bold" }}>
                                Item Type<span className='text-danger'>*</span>
                            </label>

                            <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px", paddingRight: "10px" }}>
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
                            {errors.type && <p className="error-validation mt-2">{errors.type.message}</p>}

                            {/* <p>Description</p> */}
                            <label for="description" className='mt-2' style={{ display: "inline-flex", fontWeight: "bold" }}>
                                Description &nbsp; <span className='text-secondary' style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: "400" }}>(Optional)</span>
                            </label>

                            <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px", paddingRight: "10px", position: "relative" }}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className='LogIn_InputEmail'
                                            cols="30"
                                            rows="5"
                                            placeholder="Description &nbsp;(Optional)"
                                            style={{ flexGrow: 1, paddingBlock: "3px", border: "none", resize: "none", outline: "none", width: "100%" }}
                                        />
                                    )}
                                />

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: isMobile ? "-20%" : "10%", marginBottom: isMobile ? "34%" : "20%", padding: "0 10px", width: "120px", fontSize: isMobile ? "12px" : "14px" }}>
                                    {<span style={{ flex: 1, textAlign: "left", position: "absolute", right: isMobile ? "91px" : "115px", backgroundColor: "#fff", paddingLeft: "10px" }}> Public</span>}

                                    <FormControlLabel
                                        control={<Switch checked={visibility.description === 'private'} onChange={() => handleToggle('description')} size={isMobile ? "small" : "medium"} />}
                                        style={{ backgroundColor: "#fff", position: "absolute", right: isMobile ? "35px" : "40px" }}
                                    />
                                    {<span style={{ flex: 1, textAlign: "right", position: "absolute", right: "10px" }}>Private</span>}
                                </div>
                            </div>

                            {/* <input
                            ref={uploadInputRef} accept="image/*" type="file" id='photo_file' style={{ display: 'none' }} />
                        <label htmlFor="photo_file" className='photo_upload'>
                            <AddOutlinedIcon sx={{ color: "rgb(10, 63, 116)" }} />
                        </label> */}
                            {/* <FilePicker onChange={handleFile} fileName={data.photos} /> */}


                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>

                                <Controller
                                    name="photos"
                                    control={control}
                                    rules={{
                                        validate: {
                                            maxFiles: (value) => value?.length >= 1 || 'You need to upload at least 1 image.'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <>
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
                                                        marginTop: '15px',
                                                        border: '1px solid rgb(223, 223, 223)',
                                                    }}
                                                >
                                                    <img
                                                        src={photo}
                                                        alt={`Selected ${index}`}
                                                        style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                                                    />
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
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        <CloseIcon style={{ width: '13px', height: '13px', color: 'white' }} />
                                                    </div>
                                                </div>
                                            ))}

                                            {Array.from({ length: 3 - field.value.length }).map((_, index) => (
                                                <div
                                                    key={`upload-${index}`}
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
                                                        marginTop: '15px',
                                                        border: '1px solid rgb(223, 223, 223)',
                                                    }}
                                                    onClick={() => handleClick(index)}
                                                >
                                                    <AddOutlinedIcon style={{ width: '50%', height: '50%' }} />

                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        ref={(el) => (uploadInputRefs.current[index] = el)}
                                                        onChange={(e) => handleFile(e, field.value.length + index)}
                                                    />
                                                </div>
                                            ))}
                                        </>
                                    )}
                                />

                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={`optional-text-${index}`}
                                        style={{
                                            width: 70,
                                            marginRight: '10px',
                                            textAlign: 'center',
                                            marginTop: index === 0 ? '0' : '5px',
                                        }}
                                    >
                                        {index > 0 && <small className="text-secondary">Optional</small>}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3">
                                {errors.photos && (
                                    <p className="error-validation" style={{ textAlign: 'left' }}>
                                        {errors.photos.message}
                                    </p>
                                )}
                            </div>

                            <button
                                style={{
                                    backgroundColor: "#0a3f74"
                                }}
                                className='found_btn'>
                                {!loading ? (
                                    <div>Save</div>
                                ) : (
                                    <PulseLoader size={15} color='#ffffff' />
                                )}
                            </button>

                        </div>
                    </form>
                </Typography>
            </Box>
        </Modal>
    )
}

export default EditModal