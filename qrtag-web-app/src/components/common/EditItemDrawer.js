import React, { useState } from 'react';
import {
    Drawer, Typography, IconButton, Box,
    TextField, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function AddItemDrawer({ open, onClose }) {
    const [privacyToggles, setPrivacyToggles] = useState({
        itemName: true,
        manufacturer: true,
        serialNumber: false,
        description: false
    });

    const [images, setImages] = useState([]);

    const handleToggle = (field) => {
        setPrivacyToggles(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const imagePreviews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...imagePreviews]);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[indexToRemove].preview);
            updated.splice(indexToRemove, 1);
            return updated;
        });
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 3 } }}
        >
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                <CloseIcon />
            </IconButton>

            <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: '#1e5af9' }}>
                Update item
            </Typography>
            <Typography fontSize={13} color="#64748B" mb={3}>
                Set field visibility to public or private based on display preference for the finder
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography fontSize={14}>Item Name</Typography>
                        <Typography fontSize={13} sx={{ color: '#334155', mr: { xs: '20%', md: '16%' } }}>
                            {privacyToggles.itemName ? 'Private' : 'Public'}
                        </Typography>
                    </Box>

                    <Box display="flex" gap={2} mt={1}>
                        <TextField
                            placeholder="Enter name"
                            fullWidth
                            sx={{ backgroundColor: '#F8FAFC' }}
                            InputProps={{ sx: { height: '50px' } }}
                        />
                        <Box
                            onClick={() => handleToggle('itemName')}
                            sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: privacyToggles.itemName ? '#d0d8ef' : '#ffffff',
                                borderRadius: '5px', padding: '4px', position: 'relative', width: '150px', height: '50px',
                                cursor: 'pointer', boxShadow: 'inset 0 0 0 1px #cbd5e1'
                            }}
                        >
                            <Box sx={{
                                position: 'absolute', top: 4, left: privacyToggles.itemName ? 4 : 'calc(100% - 55px)', width: '50px', height: '42px',
                                backgroundColor: privacyToggles.itemName ? '#ffffff' : '#8acd42', borderRadius: '5px',
                                transition: 'left 0.3s ease, background-color 0.3s ease', zIndex: 1
                            }} />
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography fontSize={14}>Item Manufacturer</Typography>
                        <Typography fontSize={13} sx={{ color: '#334155', mr: { xs: '20%', md: '16%' } }}>
                            {privacyToggles.manufacturer ? 'Private' : 'Public'}
                        </Typography>
                    </Box>

                    <Box display="flex" gap={2} mt={1}>
                        <TextField
                            placeholder="Enter manufacturer"
                            fullWidth
                            sx={{ backgroundColor: '#F8FAFC' }}
                            InputProps={{ sx: { height: '50px' } }}
                        />
                        <Box
                            onClick={() => handleToggle('manufacturer')}
                            sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: privacyToggles.manufacturer ? '#d0d8ef' : '#ffffff',
                                borderRadius: '5px', padding: '4px', position: 'relative', width: '150px', height: '50px',
                                cursor: 'pointer', boxShadow: 'inset 0 0 0 1px #cbd5e1'
                            }}
                        >
                            <Box sx={{
                                position: 'absolute', top: 4, left: privacyToggles.manufacturer ? 4 : 'calc(100% - 55px)', width: '50px', height: '42px',
                                backgroundColor: privacyToggles.manufacturer ? '#ffffff' : '#8acd42', borderRadius: '5px',
                                transition: 'left 0.3s ease, background-color 0.3s ease', zIndex: 1
                            }} />
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography fontSize={14}>Item Serial Number</Typography>
                        <Typography fontSize={13} sx={{ color: '#334155', mr: { xs: '20%', md: '16%' } }}>
                            {privacyToggles.serialNumber ? 'Private' : 'Public'}
                        </Typography>
                    </Box>

                    <Box display="flex" gap={2} mt={1}>
                        <TextField
                            placeholder="Enter serial number"
                            fullWidth
                            sx={{ backgroundColor: '#F8FAFC' }}
                            InputProps={{ sx: { height: '50px' } }}
                        />
                        <Box
                            onClick={() => handleToggle('serialNumber')}
                            sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: privacyToggles.serialNumber ? '#d0d8ef' : '#ffffff',
                                borderRadius: '5px', padding: '4px', position: 'relative', width: '150px', height: '50px',
                                cursor: 'pointer', boxShadow: 'inset 0 0 0 1px #cbd5e1'
                            }}
                        >
                            <Box sx={{
                                position: 'absolute', top: 4, left: privacyToggles.serialNumber ? 4 : 'calc(100% - 55px)', width: '50px', height: '42px',
                                backgroundColor: privacyToggles.serialNumber ? '#ffffff' : '#8acd42', borderRadius: '5px',
                                transition: 'left 0.3s ease, background-color 0.3s ease', zIndex: 1
                            }} />
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Typography fontSize={14}>Estimated Value</Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter estimated value"
                        InputProps={{ sx: { backgroundColor: '#F8FAFC', height: '50px' } }}
                    />
                </Box>

                <Box>
                    <Typography fontSize={14}>Item Type</Typography>
                    <TextField
                        select
                        fullWidth
                        defaultValue=""
                        SelectProps={{ native: true }}
                        InputProps={{ sx: { backgroundColor: '#F8FAFC', height: '50px' } }}
                    >
                        <option value="">Select Type</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                    </TextField>
                </Box>

                <Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography fontSize={14}>Description</Typography>
                        <Typography fontSize={13} sx={{ color: '#334155', mr: { xs: '20%', md: '16%' } }}>
                            {privacyToggles.description ? 'Private' : 'Public'}
                        </Typography>
                    </Box>

                    <Box display="flex" gap={2} mt={1}>
                        <TextField
                            placeholder="Enter item description"
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ backgroundColor: '#F8FAFC' }}
                        />
                        <Box
                            onClick={() => handleToggle('description')}
                            sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: privacyToggles.description ? '#d0d8ef' : '#ffffff',
                                borderRadius: '5px', padding: '4px', position: 'relative', width: '150px', height: '50px',
                                cursor: 'pointer', boxShadow: 'inset 0 0 0 1px #cbd5e1'
                            }}
                        >
                            <Box sx={{
                                position: 'absolute', top: 4, left: privacyToggles.description ? 4 : 'calc(100% - 55px)', width: '50px', height: '42px',
                                backgroundColor: privacyToggles.description ? '#ffffff' : '#8acd42', borderRadius: '5px',
                                transition: 'left 0.3s ease, background-color 0.3s ease', zIndex: 1
                            }} />
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
                        Upload Images
                        <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
                    </Button>

                    <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                        {images.map((img, index) => (
                            <Box key={index} position="relative">
                                <img src={img.preview} alt={`preview-${index}`} style={{ width: 60, height: 60, borderRadius: 4 }} />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveImage(index)}
                                    sx={{
                                        position: 'absolute', top: -8, right: -8, backgroundColor: '#dc2626', color: 'white', width: 20, height: 20
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Button variant="contained" fullWidth sx={{
                    mt: 1, height: 45, backgroundColor: '#ef4444', textTransform: 'none',
                    fontWeight: 500, '&:hover': { backgroundColor: '#dc2626' }
                }}>
                    Save
                </Button>
            </Box>
        </Drawer>
    );
}