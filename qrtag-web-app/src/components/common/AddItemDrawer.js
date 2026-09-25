import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Typography, FormControl, IconButton, Box, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { AddMyItem, UpdateMyItem } from '../../services/user';
import { Add } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form';
import { Store } from '../../StoreContext';

export default function AddItemDrawer({ open, setOpen, itemId, getList, itemTypes, checkIsEligible, fetchUser, itemData, isEdit }) {

    const { messages } = Store();
    const [loading, setLoading] = useState(false);
    const fileInputRefs = [useRef(null), useRef(null), useRef(null)];
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [visibilityMessage, setVisibilityMessage] = useState(null);
    const [photosDeleted, setPhotosDeleted] = useState([]);

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

    useEffect(() => {
        if (itemData && open) {
            setValue('name', itemData?.name)
            setValue('manufacturer', itemData?.manufacturer)
            setValue('serial', itemData?.serial_no)
            setValue('estimated', itemData?.estimated_value)
            setValue('description', itemData?.description)
            setValue('type', (itemData?.item_type && itemData?.item_type?.id) ? itemData?.item_type?.id : null)
            setValue('photos', itemData?.photos)
            setValue('images', itemData?.photos || [])
            if (itemData?.visibility) {
                setVisibility(itemData?.visibility)
            }
        }
    }, [itemData, open, setValue])

    const handleClick = (index) => {
        if (fileInputRefs[index].current) {
            fileInputRefs[index].current.click();
        }
    };

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

    const handleRemoveImage = (index) => {
        const currentPhotos = getValues('photos');

        const imageToDelete = itemData?.photos?.[index];

        if (imageToDelete?.id) {
            setPhotosDeleted(prev => [...prev, imageToDelete.id]);
        }

        const updatedPhotos = [...currentPhotos];
        updatedPhotos[index] = '';

        setValue('photos', updatedPhotos, { shouldValidate: true });

        // toast.info(`Image ${index + 1} was removed`);
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

    const submitItem = () => {

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
                const photo = photos[i];

                // Skip if it's an object and has an 'id' (existing image)
                if (photo && typeof photo === 'object' && photo.id) {
                    continue;
                }

                if (photo && (typeof photo === 'string' || (typeof photo === 'object' && !photo.id))) {
                    images.push({ photo, is_cover: (i === 0) });
                }
            }
        }

        params.photos = images
       
        setLoading(true);
        try {
            // UPDATE ITEM DETAIL
            if (isEdit && itemData) {

                params.deleted_photos = photosDeleted

                UpdateMyItem(itemData?.id, params, (response) => {
                    setLoading(false);
                    if (response && response.success) {
                        toast.success('Item updated successfully!');
                        closeModal()
                        getList()
                    } else {
                        if (response && response.error && response.error.data && response.error.data.detail) {
                            toast.error(`${response && response.error && response.error.data.detail}`)
                        } else {
                            toast.error(`Failed to update item!`)
                        }
                    }
                });
            } else {
                // ADD ITEM DETAIL
                AddMyItem(params, (response) => {
                    setLoading(false);
                    if (response && response.success) {
                        checkIsEligible()
                        fetchUser()
                        toast.success('Item added successfully!');
                        getList()
                        closeModal()
                    } else {
                        if (response && response.error && response.error.data && response.error.data.detail) {
                            toast.error(`${response && response.error && response.error.data.detail}`)
                        } else {
                            toast.error(`Failed to add item!`)
                        }
                    }
                });
            }
        } catch (error) {
            setLoading(false);
        }

    }

    return (
        <Drawer anchor="right" open={open} onClose={handleClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 3 } }}
        >
            <IconButton onClick={closeModal} sx={{ position: 'absolute', top: 10, right: 10 }}>
                <CloseIcon />
            </IconButton>

            <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: '#1e5af9' }}>
                {(isEdit) ? 'Edit' : 'Add'} item
            </Typography>
            <Typography fontSize={13} color="#64748B" mb={3}>
                {(visibilityMessage && visibilityMessage?.value) ? visibilityMessage?.value : "You can set the field's visibility as either Public or Private, depending on whether you want it to be displayed to the finder."}
            </Typography>

            <form onSubmit={handleSubmit(submitItem)}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography fontSize={14}>Item Name <span className='text-danger '>*</span></Typography>
                            <Typography fontSize={13} sx={{ color: '#334155', mr: { xs: '20%', md: '16%' } }}>
                                {(visibility.name === 'private') ? 'Private' : 'Public'}
                            </Typography>
                        </Box>

                        <Box display="flex" gap={2} mt={1}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Item Name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="name"
                                        placeholder="Enter Name"
                                        fullWidth
                                        sx={{ backgroundColor: '#F8FAFC' }}
                                        InputProps={{ sx: { height: '50px' } }}
                                    />
                                )}
                            />
                            <Box
                                onClick={() => handleToggle('name')}
                                sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: (visibility.name === 'private') ? '#d0d8ef' : '#ffffff',
                                    borderRadius: '5px', padding: '4px', position: 'relative', width: '150px', height: '50px',
                                    cursor: 'pointer', boxShadow: 'inset 0 0 0 1px #cbd5e1'
                                }}
                            >
                                <Box sx={{
                                    position: 'absolute', top: 4, left: (visibility.name === 'private') ? 4 : 'calc(100% - 55px)', width: '50px', height: '42px',
                                    backgroundColor: (visibility.name === 'private') ? '#ffffff' : '#8acd42', borderRadius: '5px',
                                    transition: 'left 0.3s ease, background-color 0.3s ease', zIndex: 1
                                }} />
                            </Box>
                        </Box>
                        {errors.name && <p className='error-validation mt-2' style={{ textAlign: 'left' }}>{errors.name.message}</p>}
                    </Box>

                    <Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography fontSize={14}>Item Manufacturer</Typography>
                            <Typography fontSize={13} sx={{ color: '#334155', mr: { xs: '20%', md: '16%' } }}>
                                {(visibility.manufacturer === 'private') ? 'Private' : 'Public'}
                            </Typography>
                        </Box>

                        <Box display="flex" gap={2} mt={1}>
                            <Controller
                                name="manufacturer"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Enter manufacturer"
                                        id="manufacturer"
                                        fullWidth
                                        sx={{ backgroundColor: '#F8FAFC' }}
                                        InputProps={{ sx: { height: '50px' } }}
                                    />
                                )}
                            />
                            <Box
                                onClick={() => handleToggle('manufacturer')}
                                sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: (visibility.manufacturer === 'private') ? '#d0d8ef' : '#ffffff',
                                    borderRadius: '5px', padding: '4px', position: 'relative', width: '150px', height: '50px',
                                    cursor: 'pointer', boxShadow: 'inset 0 0 0 1px #cbd5e1'
                                }}
                            >
                                <Box sx={{
                                    position: 'absolute', top: 4, left: (visibility.manufacturer === 'private') ? 4 : 'calc(100% - 55px)', width: '50px', height: '42px',
                                    backgroundColor: (visibility.manufacturer === 'private') ? '#ffffff' : '#8acd42', borderRadius: '5px',
                                    transition: 'left 0.3s ease, background-color 0.3s ease', zIndex: 1
                                }} />
                            </Box>
                        </Box>
                    </Box>

                    <Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography fontSize={14}>Item Serial Number</Typography>
                            <Typography fontSize={13} sx={{ color: '#334155', mr: { xs: '20%', md: '16%' } }}>
                                {(visibility.serial === 'private') ? 'Private' : 'Public'}
                            </Typography>
                        </Box>

                        <Box display="flex" gap={2} mt={1}>
                            <Controller
                                name="serial"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="serial"
                                        placeholder="Enter serial number"
                                        fullWidth
                                        sx={{ backgroundColor: '#F8FAFC' }}
                                        InputProps={{ sx: { height: '50px' } }}
                                    />
                                )}
                            />
                            <Box
                                onClick={() => handleToggle('serial')}
                                sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: (visibility.serial === 'private') ? '#d0d8ef' : '#ffffff',
                                    borderRadius: '5px', padding: '4px', position: 'relative', width: '150px', height: '50px',
                                    cursor: 'pointer', boxShadow: 'inset 0 0 0 1px #cbd5e1'
                                }}
                            >
                                <Box sx={{
                                    position: 'absolute', top: 4, left: (visibility.serial === 'private') ? 4 : 'calc(100% - 55px)', width: '50px', height: '42px',
                                    backgroundColor: (visibility.serial === 'private') ? '#ffffff' : '#8acd42', borderRadius: '5px',
                                    transition: 'left 0.3s ease, background-color 0.3s ease', zIndex: 1
                                }} />
                            </Box>
                        </Box>
                    </Box>

                    <Box>
                        <Typography fontSize={14}>Estimated Value <span className='text-danger'>*</span></Typography>
                        <Controller
                            name="estimated"
                            control={control}
                            rules={{ required: 'Estimated Value is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    id="estimated"
                                    fullWidth
                                    placeholder="Enter estimated value"
                                    InputProps={{ sx: { backgroundColor: '#F8FAFC', height: '50px' } }}
                                />
                            )}
                        />
                        {errors.estimated && (
                            <p className='error-validation mt-2' style={{ textAlign: 'left' }}>
                                {errors.estimated.message}
                            </p>
                        )}
                    </Box>

                    <Box>
                        <Typography fontSize={14}>Item Type <span className='text-danger'>*</span></Typography>
                        <Controller
                            name="type"
                            control={control}
                            rules={{
                                required: 'Item Type is required '
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    defaultValue=""
                                    id="type"
                                    SelectProps={{ native: true }}
                                    InputProps={{ sx: { backgroundColor: '#F8FAFC', height: '50px' } }}
                                >
                                    <option value="">Select Type</option>
                                    {itemTypes?.map((tp) => (
                                        <option key={tp.id} value={tp.id}>{tp.name}</option>
                                    ))}
                                </TextField>
                            )}
                        />
                        {errors.type && (
                            <p className='error-validation mt-2' style={{ textAlign: 'left' }}>
                                {errors.type.message}
                            </p>
                        )}
                    </Box>

                    <Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography fontSize={14}>Description</Typography>
                            <Typography fontSize={13} sx={{ color: '#334155', mr: { xs: '20%', md: '16%' } }}>
                                {(visibility.description === 'private') ? 'Private' : 'Public'}
                            </Typography>
                        </Box>

                        <Box display="flex" gap={2} mt={1}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Enter item description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        sx={{ backgroundColor: '#F8FAFC' }}
                                    />
                                )}
                            />
                            <Box
                                onClick={() => handleToggle('description')}
                                sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: (visibility.description === 'private') ? '#d0d8ef' : '#ffffff',
                                    borderRadius: '5px', padding: '4px', position: 'relative', width: '150px', height: '50px',
                                    cursor: 'pointer', boxShadow: 'inset 0 0 0 1px #cbd5e1'
                                }}
                            >
                                <Box sx={{
                                    position: 'absolute', top: 4, left: (visibility.description === 'private') ? 4 : 'calc(100% - 55px)', width: '50px', height: '42px',
                                    backgroundColor: (visibility.description === 'private') ? '#ffffff' : '#8acd42', borderRadius: '5px',
                                    transition: 'left 0.3s ease, background-color 0.3s ease', zIndex: 1
                                }} />
                            </Box>
                        </Box>
                    </Box>

                    <Box>
                        <FormControl fullWidth className="mt-2">
                            <label htmlFor="image-upload" className="mb-2" style={{ display: "inline-flex" }}>
                                Upload Item Images <span className="text-danger">*</span>
                            </label>

                            <Controller
                                name="photos"
                                control={control}
                                rules={{
                                    validate: (photos) =>
                                        photos.filter(photo => photo !== '').length >= 1 || 'You need to upload at least 1 image.',
                                }}
                                render={({ field }) => {

                                    const imagesToRender = [...field.value];

                                    while (imagesToRender.length < 3) {
                                        imagesToRender.push('');
                                    }

                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                            
                                                {imagesToRender.map((photo, index) => (
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
                                                                <img
                                                                    src={photo?.photo || photo}
                                                                    alt={`Selected ${index}`}
                                                                    style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
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
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveImage(index);
                                                                    }}
                                                                >
                                                                    <CloseIcon style={{ width: '13px', height: '13px', color: 'white' }} />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <Add style={{ width: '50%', height: '50%', fill: '#b2b2b2' }} />
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
                                        </div>
                                    )}}
                            />

                            {errors.photos && (
                                <p className="error-validation mt-2" style={{ textAlign: 'left' }}>
                                    {errors.photos.message}
                                </p>
                            )}
                        </FormControl>
                    </Box>

                    <Button type='submit' variant="contained" fullWidth sx={{
                        mt: 1, height: 45, backgroundColor: '#ef4444', textTransform: 'none',
                        fontWeight: 500, '&:hover': { backgroundColor: '#dc2626' }
                    }}>
                        {!loading ? (
                            <div>Save</div>
                        ) : (
                            <PulseLoader size={15} color='#ffffff' />
                        )}
                    </Button>
                </Box>
            </form>
        </Drawer>
    );
}