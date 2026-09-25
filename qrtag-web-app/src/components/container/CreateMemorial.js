import React, { useEffect, useState } from 'react'
import Navbar from '../common/Navbar'
import {
    Container, Button, Grid, FormControl, Drawer, Typography, Box, Tabs, Tab, IconButton
} from '@mui/material'
import { toast } from 'react-toastify'
import { PulseLoader } from 'react-spinners'
import { AddMemorial, UpdateMemorial } from '../../services/user'
import { useForm, Controller } from 'react-hook-form'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate, useParams } from 'react-router-dom'
import Axios from '../../config/axios'
import AddPhotosModal from '../common/AddPhotosModal'
import DeletePhotosModal from '../common/DeletePhotosModal'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import '../css/App.css'
import { RemoveCircleOutline } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close';
import FileIcon from '../../images/file-attach.png'

const formstyle = {
    width: '100%',
    height: '50px',
    padding: '10px',
    backgroundColor: '#eff4fb',
    border: '1px solid #cbd5e1',
    borderRadius: '6px'
}

const defaultToolbar = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ font: [] }],
    [{ color: [] }, { background: [] }],
    [{ script: 'super' }, { script: 'sub' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }, { align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
]

const CreateMemorial = ({ open, onClose, memorialId, getList }) => {

    const navigate = useNavigate()
    const { id } = useParams()
    const [profileImage, setProfileImage] = useState(null)
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [memorialData, setMemorialData] = useState(null)
    const [editInfo, setEditInfo] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
    const [photoToDelete, setPhotoToDelete] = React.useState(null)

    const [value, setValueTab] = useState(0)

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue)
    }

    const fileInputRef = React.useRef(null)
    const coverInputRef = React.useRef(null)

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        getValues
    } = useForm({
        defaultValues: {
            name: '',
            dateOfBirth: null,
            dateOfDeath: null,
            description: '',
            profilePhoto: null,
            coverPhoto: null,
        },
    });

    const readFile = (file, setter) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => setter(reader.result)
    }

    const getMemorialData = () => {
        setIsFetching(true)
        Axios.get(`/common/digital-memorial/${memorialId}/`).then((res) => {
            setIsFetching(false)
            if (res && res?.data) {
                setMemorialData(res?.data)
                // console.log("memorial data:", res?.data)
            }
        }).catch((err) => {
            console.log(err)
            setIsFetching(false)
            setMemorialData(null)
        });
    }
    useEffect(() => {
        if (memorialId) {
            getMemorialData()
        }
    }, [id])

    useEffect(() => {
        if (memorialData) {
            setLoading(true);

            const data = memorialData;
            setValue('name', data.name || '');
            setValue('description', data.description || '');
            setValue('dateOfBirth', data.from_date ? new Date(data.from_date) : null);
            setValue('dateOfDeath', data.to_date ? new Date(data.to_date) : null);
            setProfileImage(data.profile_photo || '');
            setCoverImage(data.cover_photo || '');

            setEditInfo(data)
            // console.log("edit info :", data)
            setLoading(false);
        }
    }, [memorialData, setValue]);


    const handleDelete = async (photoId) => {
        setLoading(true)
        try {
            await Axios.delete(`/common/memorial-photo/${photoId}/`)
            setMemorialData(prevData => ({
                ...prevData,
                photos: prevData.photos.filter(photo => photo.id !== photoId),
            }))
            toast.success('Photo deleted successfully!')
            setDeleteModalOpen(false)
            setPhotoToDelete(null)
        } catch (err) {
            console.error(err)
            toast.error('Failed to delete photo')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (date) => {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const submitForm = async () => {

        const values = getValues()
        const formData = new FormData()

        formData.append('name', values.name)
        formData.append('description', values.description)
        formData.append('from_date', formatDate(values.dateOfBirth))
        formData.append('to_date', formatDate(values.dateOfDeath))

        if (values.profilePhoto) {
            formData.append('profile_photo', values.profilePhoto)
        } else if (profileImage) {

        } else {
            toast.error("Please upload profile photo!")
            return false
        }

        if (values.coverPhoto) {
            formData.append('cover_photo', values.coverPhoto)
        } else if (coverImage) {

        } else {
            toast.error("Please upload cover photo!")
            return false
        }

        if (loading) return
        setLoading(true)

        try {
            if (editInfo && editInfo.id) {
                UpdateMemorial(`/common/digital-memorial/${editInfo.id}/`, formData, (response) => {
                    setLoading(false)
                    if (response && response.success) {
                        toast.success('Digital Memorial updated successfully!')
                        onClose()
                        getList()
                    } else {
                        toast.error(response.error?.response?.data?.detail || 'Update failed!')
                    }
                })
            } else {
                AddMemorial(formData, (response) => {
                    setLoading(false)
                    if (response && response.success) {
                        toast.success('Digital Memorial added successfully!')
                        onClose()
                        getList()
                    } else {
                        toast.error(response.error?.response?.data?.detail || 'Add failed!')
                    }
                })
            }
        } catch (err) {
            setLoading(false)
            toast.error('An unexpected error occurred')
            console.error(err)
        }
    }

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={onClose}
                PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 3 } }}
            >
                <div>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-4" style={{ position: 'relative', paddingRight: 40 }}>
                        <h3 style={{ color: '#1e5af9', fontWeight: 600, margin: 0 }}>
                            {editInfo ? 'Edit Memorial' : 'Create Memorial'}
                        </h3>

                        <IconButton
                            onClick={onClose}
                            size="small"
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <Tabs value={value} onChange={handleChangeTab} aria-label="memorial tabs" sx={{ marginBottom: 4, marginTop: 2 }}>
                        {/* <Tab label="Biography" />
                    {(id) && <>
                        <Tab label="Photos" />
                    </>} */}
                        {[<Tab label="Biography" key="bio" />, memorialId && <Tab label="Photos" key="photos" />].filter(Boolean)}
                    </Tabs>

                    {value === 0 && (
                        <form onSubmit={handleSubmit(submitForm)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl fullWidth>
                                        <label htmlFor="Name" style={{ display: 'inline-flex' }}>
                                            Name
                                        </label>
                                        <Controller
                                            name="name"
                                            control={control}
                                            rules={{ required: 'Name is required' }}
                                            render={({ field }) => (
                                                <>
                                                    <input
                                                        {...field}
                                                        id="name"
                                                        placeholder="Name"
                                                        style={formstyle}
                                                    />
                                                    {errors.name && (
                                                        <Typography color="error" variant="caption">
                                                            {errors.name.message}
                                                        </Typography>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <label style={{ display: 'inline-flex' }}>
                                            Date of Birth
                                        </label>
                                        <Controller
                                            name="dateOfBirth"
                                            control={control}
                                            rules={{ required: 'Date of Birth is required' }}
                                            render={({ field }) => (
                                                <>
                                                    <Flatpickr
                                                        {...field}
                                                        value={field.value}
                                                        options={{
                                                            dateFormat: 'Y-m-d',
                                                            disableMobile: "true",
                                                            maxDate: watch('dateOfDeath') || null,
                                                        }}
                                                        onChange={(date) => field.onChange(date[0])}
                                                        render={({ defaultValue, ...props }, ref) => (
                                                            <input
                                                                {...props}
                                                                ref={ref}
                                                                style={{
                                                                    ...formstyle
                                                                }}
                                                                placeholder="YYYY-MM-DD"
                                                                onKeyDown={(e) => {
                                                                    const allowedKeys = [
                                                                        'Backspace',
                                                                        'Tab',
                                                                        'ArrowLeft',
                                                                        'ArrowRight',
                                                                        'Delete',
                                                                        'Home',
                                                                        'End',
                                                                        '-'
                                                                    ]
                                                                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                                        e.preventDefault()
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {errors.dateOfBirth && (
                                                        <Typography color="error" variant="caption">
                                                            {errors.dateOfBirth.message}
                                                        </Typography>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <label style={{ display: 'inline-flex' }}>
                                            Date of Death
                                        </label>
                                        <Controller
                                            name="dateOfDeath"
                                            control={control}
                                            rules={{
                                                required: 'Date of Death is required',
                                                validate: (value) =>
                                                    !watch('dateOfBirth') || value >= watch('dateOfBirth') || 'Death must be after birth'
                                            }}
                                            render={({ field }) => (
                                                <>
                                                    <Flatpickr
                                                        {...field}
                                                        value={field.value}
                                                        options={{
                                                            dateFormat: 'Y-m-d',
                                                            disableMobile: "true",
                                                            minDate: watch('dateOfBirth') || null,
                                                        }}
                                                        onChange={(date) => field.onChange(date[0])}
                                                        render={({ defaultValue, ...props }, ref) => (
                                                            <input
                                                                {...props}
                                                                ref={ref}
                                                                style={{
                                                                    ...formstyle
                                                                }}
                                                                placeholder="YYYY-MM-DD"
                                                                onKeyDown={(e) => {
                                                                    const allowedKeys = [
                                                                        'Backspace',
                                                                        'Tab',
                                                                        'ArrowLeft',
                                                                        'ArrowRight',
                                                                        'Delete',
                                                                        'Home',
                                                                        'End',
                                                                        '-'
                                                                    ]
                                                                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                                        e.preventDefault()
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {errors.dateOfDeath && (
                                                        <Typography color="error" variant="caption">
                                                            {errors.dateOfDeath.message}
                                                        </Typography>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                            Description
                                        </label>
                                        <Controller
                                            name="description"
                                            control={control}
                                            rules={{ required: 'Description is required' }}
                                            render={({ field }) => (
                                                <>
                                                    <Box sx={{ border: '1px solid #cbd5e1', borderRadius: 2, overflow: 'hidden', width: "100% !important", backgroundColor: '#eff4fb' }}>
                                                        <ReactQuill
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder='Enter Description'
                                                            theme="snow"
                                                            modules={{ toolbar: defaultToolbar }}
                                                            style={{ height: 250, marginBottom: 16 }}
                                                        />
                                                    </Box>
                                                    {errors.description && (
                                                        <Typography color="error" variant="caption">
                                                            {errors.description.message}
                                                        </Typography>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="profilePhoto"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Box
                                                        sx={{
                                                            border: '1px dashed #1e5af9',
                                                            borderRadius: '12px',
                                                            textAlign: 'center',
                                                            padding: '24px 12px',
                                                            bgcolor: '#fff'
                                                        }}
                                                    >
                                                        <img
                                                            src={FileIcon}
                                                            alt="attach"
                                                            style={{ width: 40, marginBottom: 8 }}
                                                        />
                                                        <Typography fontWeight={600} color="#0f172a" mb={0.5}>
                                                            Profile Photo
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="#64748b"
                                                            sx={{ fontSize: 12, mb: 1 }}
                                                        >
                                                            Drag and drop image here or,<br /> click on the attach button
                                                        </Typography>

                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => fileInputRef.current.click()}
                                                            sx={{
                                                                fontSize: 12,
                                                                borderColor: '#cbd5e1',
                                                                textTransform: 'none',
                                                                color: '#0f172a',
                                                                backgroundColor: '#f8fafc'
                                                            }}
                                                        >
                                                            Attach
                                                        </Button>

                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            ref={fileInputRef}
                                                            style={{ display: 'none' }}
                                                            onChange={e => {
                                                                const file = e.target.files[0];
                                                                field.onChange(file);
                                                                readFile(file, setProfileImage);
                                                            }}
                                                        />
                                                    </Box>

                                                    {profileImage && (
                                                        <Box
                                                            component="img"
                                                            src={profileImage}
                                                            alt="Profile Preview"
                                                            sx={{
                                                                mt: 2,
                                                                width: '100%',
                                                                maxWidth: 150,
                                                                height: 150,
                                                                objectFit: 'cover',
                                                                borderRadius: 2
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name="coverPhoto"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Box
                                                        sx={{
                                                            border: '1px dashed #1e5af9',
                                                            borderRadius: '12px',
                                                            textAlign: 'center',
                                                            padding: '24px 12px',
                                                            bgcolor: '#fff'
                                                        }}
                                                    >
                                                        <img
                                                            src={FileIcon}
                                                            alt="attach"
                                                            style={{ width: 40, marginBottom: 8 }}
                                                        />
                                                        <Typography fontWeight={600} color="#0f172a" mb={0.5}>
                                                            Cover Photo
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="#64748b"
                                                            sx={{ fontSize: 12, mb: 1 }}
                                                        >
                                                            Drag and drop image here or,<br /> click on the attach button
                                                        </Typography>

                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => coverInputRef.current.click()}
                                                            sx={{
                                                                fontSize: 12,
                                                                borderColor: '#cbd5e1',
                                                                textTransform: 'none',
                                                                color: '#0f172a',
                                                                backgroundColor: '#f8fafc'
                                                            }}
                                                        >
                                                            Attach
                                                        </Button>

                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            ref={coverInputRef}
                                                            style={{ display: 'none' }}
                                                            onChange={e => {
                                                                const file = e.target.files[0];
                                                                field.onChange(file);
                                                                readFile(file, setCoverImage);
                                                            }}
                                                        />
                                                    </Box>

                                                    {coverImage && (
                                                        <Box
                                                            component="img"
                                                            src={coverImage}
                                                            alt="Cover Preview"
                                                            sx={{
                                                                mt: 2,
                                                                width: '100%',
                                                                maxWidth: 150,
                                                                height: 150,
                                                                objectFit: 'cover',
                                                                borderRadius: 2
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        sx={{
                                            my: 5,
                                            display: 'block',
                                            width: '100%',
                                            height: '50px',
                                            mx: 'auto',
                                            borderColor: '#ea4736',
                                            borderRadius: '5px',
                                            backgroundColor: '#ea4736',
                                            color: '#fff',
                                            textTransform: "capitalize",
                                            '&:hover': {
                                                borderColor: '#ea4736',
                                                color: '#fff',
                                                backgroundColor: '#ea4736',
                                            },
                                        }}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? <PulseLoader color="#fff" size={10} />
                                            : "Save"
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}

                    {value === 1 && (
                        <>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="flex-end"
                                gap={2}
                                mt={2}
                                mb={2}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        height: '50px',
                                        width: "150px",
                                        borderColor: '#ea4736',
                                        borderRadius: '5px',
                                        backgroundColor: '#ea4736',
                                        color: '#fff',
                                        '&:hover': {
                                            borderColor: '#ea4736',
                                            color: '#fff',
                                            backgroundColor: '#ea4736',
                                        },
                                    }}
                                    onClick={() => setOpenModal(true)}
                                >
                                    + Add Photo
                                </Button>
                            </Box>

                            <AddPhotosModal
                                open={openModal}
                                setOpen={setOpenModal}
                                itemId={memorialId}
                                getList={getMemorialData}
                            />

                            <Grid
                                container
                                justifyContent={{ xs: 'center', sm: 'flex-start' }}
                                rowSpacing={3}
                                columnSpacing={{ xs: 3, sm: 2, md: 3 }}
                            >
                                {memorialData?.photos?.length > 0 ? (
                                    memorialData.photos.map((item, i) => (
                                        <Grid
                                            item
                                            xs={10}
                                            sm={6}
                                            key={i}
                                            sx={{
                                                mt: { xs: 2, sm: 0 },
                                                mx: { xs: 'auto', sm: 0 },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    backgroundColor: '#f0f0f0',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <img
                                                    src={item.photo}
                                                    alt={`Photo ${i + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '350px',
                                                        objectFit: 'cover',
                                                        display: 'block',
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '8px',
                                                        backgroundColor: '#f0f0f0',
                                                    }}
                                                >
                                                    <Typography variant="body2">{item?.title}</Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setPhotoToDelete(item.id)
                                                            setDeleteModalOpen(true)
                                                        }}
                                                        sx={{
                                                            color: 'red',
                                                        }}
                                                    >
                                                        <RemoveCircleOutline fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <Grid container justifyContent="center" alignItems="center" mt={6} mb={6}>
                                            <Typography variant="body2">No Photos Found!</Typography>
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>

                        </>
                    )}

                </div>

            </Drawer>

            {deleteModalOpen && (
                <DeletePhotosModal
                    open={deleteModalOpen}
                    setOpen={setDeleteModalOpen}
                    onConfirm={() => handleDelete(photoToDelete)}
                />
            )}
        </div>
    )
}

export default CreateMemorial
