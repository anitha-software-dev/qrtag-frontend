import React, { } from 'react'
import Box from '@mui/material/Box';
import { Modal, Button, FormControl, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { AddMyTribute } from '../../services/user';
import { useForm, Controller } from 'react-hook-form';

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

export default function BasicModal({ open, setOpen, itemId, getList }) {

    const [loading, setLoading] = React.useState(false);

    const { handleSubmit, control, formState: { errors }, getValues, setValue } = useForm({
        defaultValues: {
            name: '',
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

    async function submitItem() {

        if (loading) {
            return;
        }
        const params = {
            name: getValues('name'),
            message: getValues('message'),
        }

        if (itemId) {
            params.memorial = itemId
        }

        setLoading(true);
        try {
            AddMyTribute(params, (response) => {
                setLoading(false);
                if (response && response.success) {
                    setOpen(false)
                    toast.success('Tribute added successfully!');
                    getList()
                } else {
                    if (response && response.error && response.error.data && response.error.data.detail) {
                        toast.error(`${response && response.error && response.error.data.detail}`)
                    } else {
                        toast.error(`Failed to add tribute!`)
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
                            Add Tribute
                        </Typography>

                        <form onSubmit={handleSubmit(submitItem)} style={{ width: "100%" }}>

                            <FormControl fullWidth>
                                <label htmlFor="name" style={{ display: "inline-flex" }}>
                                    Name <span className='text-danger '>*</span>
                                </label>

                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #818181", borderRadius: "5px" }}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: 'Name is required' }}
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
                                </div>
                                {errors.name && <p className='error-validation mt-2' style={{ textAlign: 'left' }}>{errors.name.message}</p>}
                            </FormControl>

                            <FormControl fullWidth className='mt-2'>
                                <label htmlFor="description" style={{ display: "inline-flex" }}>
                                    Message
                                </label>

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