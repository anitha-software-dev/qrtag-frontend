import React, { } from 'react'
import Box from '@mui/material/Box';
import { Modal, Button, FormControl, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
// import { AddMyTribute } from '../../services/user';
import { useForm, Controller } from 'react-hook-form';
import Axios from '../../config/axios'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -70%)',
    width: 520,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: "20px",
    borderRadius: '10px',
    overflow: 'auto',
};

export default function BasicModal({ open, setOpen, itemId, getList, memorial }) {

    const [loading, setLoading] = React.useState(false);

    const { handleSubmit, control, formState: { errors }, getValues, reset } = useForm({
        defaultValues: {
            message: ''
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

    React.useEffect(() => {
        if (itemId && memorial?.tributes?.length) {
            const tributeData = memorial.tributes.find(t => t.id === itemId)
            if (tributeData) {
                reset({ message: tributeData.message || '' })
            }
        }
    }, [itemId, memorial, reset])

    const submitItem = async () => {
        if (loading) return

        const params = {
            message: getValues('message')
        }

        setLoading(true)

        try {
            const response = await Axios.patch(`/common/tributes/${itemId}/`, params)

            if (response && response.status === 200) {
                toast.success('Tribute updated successfully!')
                setOpen(false)
                getList()
            } else {
                toast.error('Failed to update tribute!')
            }
        } catch (error) {
            toast.error(error?.response?.data?.detail || 'Something went wrong while updating!')
        } finally {
            setLoading(false)
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
                            Edit Tribute
                        </Typography>

                        <form onSubmit={handleSubmit(submitItem)} style={{ width: "100%" }}>

                            <FormControl fullWidth className='mt-2'>
                                {/* <label htmlFor="description" style={{ display: "inline-flex" }}>
                                    Message
                                </label> */}

                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px" }}>
                                    <Controller
                                        name="message"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className='LogIn_InputEmail'
                                                id="message"
                                                rows="3"
                                                cols="29"
                                                placeholder="Write Your Message"
                                                style={{ flexGrow: 1, border: "none", paddingBlock: "3px", outline: "none", resize: "none", width: "100%" }}
                                            />
                                        )}
                                    />
                                </div>
                                {errors.message && <p className='error-validation mt-2' style={{ textAlign: 'left' }}>{errors.message.message}</p>}
                            </FormControl>

                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    display: 'block',
                                    width: '60%',
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
                                    <div>Save</div>
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