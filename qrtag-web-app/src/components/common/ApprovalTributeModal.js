import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { PulseLoader } from 'react-spinners'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import Axios from '../../config/axios'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '15px'
}

export default function BasicModal({ open, setOpen, itemId, actionType, onConfirm, isApproving }) {
   
    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') return
        setOpen(false)
    }

    const closeModal = () => setOpen(false)

    const capitalized = actionType?.charAt(0).toUpperCase() + actionType?.slice(1)

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            disableEscapeKeyDown
        >
            <Box sx={style} className="modal-body" display="flex" flexDirection="column" alignItems="center">
                <Box position="relative" width="100%">
                    <Box
                        onClick={closeModal}
                        sx={{
                            position: 'absolute',
                            right: '-7%',
                            marginTop: '-7%',
                            border: '2px solid #000',
                            borderRadius: '50%',
                            p: '3px',
                            bgcolor: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CloseIcon />
                    </Box>
                </Box>

                <Typography sx={{ mt: '5%' }} id='modal-modal-title' variant='h6'>
                    Confirm {capitalized} Tribute
                </Typography>
                <Typography id='modal-modal-description' className='text-center' sx={{ mt: 2, mb: 3 }}>
                    Are you sure you want to {actionType} this tribute?
                </Typography>

                <Box mt={1} width="50%">
                    <Button
                        type='submit'
                        variant='outlined'
                        onClick={() => { onConfirm?.(itemId, actionType) }}
                        sx={{
                            mt: 3,
                            mb: 2,
                            width: '100%',
                            height: '50px',
                            borderRadius: '5px',
                            backgroundColor: '#1e5af9',
                            color: '#fff',
                            borderColor: '#1e5af9',
                            '&:hover': {
                                backgroundColor: '#1e5af9',
                                borderColor: '#1e5af9',
                            },
                        }}
                    >
                        {!isApproving ? capitalized : <PulseLoader size={15} color='#ffffff' />}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}
