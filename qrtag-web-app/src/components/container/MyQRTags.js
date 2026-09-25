import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar'
import TopNavbar from '../common/TopNavContent';
import Footer from '../common/Footer'
import Breadcrumbs from '../common/Breadcrumbs'
import { Link, Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material'

import QRImage from '../../images/myqrtag.png'
import { GetMyQRTags, SendQRCode } from '../../services/user';
import { toast } from 'react-toastify';
import CustomCookies from '../common/Cookies'
import ViewQRModal from '../common/ViewQRModal';
import { useNavigate } from 'react-router-dom';

const MyQRTagsNew = () => {

    const nav = useNavigate();
    const [qrtags, setQRTags] = useState([])
    const [isUsed, setIsUsed] = useState(true);
    const [allData, setAllData] = useState([]);
    const [totalUsed, setTotalUsed] = useState(0);
    const [totalUnused, setTotalUnused] = useState(0);
    const [loading, setLoading] = useState();
    const [openData, setOpenData] = useState({});
    const [open, setOpen] = useState(false);

    const getQRTagList = () => {
        try {
            setLoading(true)
            GetMyQRTags((response) => {
                setLoading(false)
                if (response && response.success) {
                    const usedQRTags = response.data.filter(item => item.is_used === true);
                    const unusedQRTags = response.data.filter(item => item.is_used === false);
                    setQRTags(usedQRTags)
                    setAllData(response.data)

                    setTotalUsed(usedQRTags.length)
                    setTotalUnused(unusedQRTags.length)
                } else {
                    setAllData([])
                    setQRTags([])
                }
            });
        } catch (error) {
            console.log(false);
        }
    }

    useEffect(() => {
        const res = allData.filter(item => item.is_used === isUsed);
        setQRTags(res)
    }, [isUsed])

    useEffect(() => {
        getQRTagList()
    }, [])

    function handleDownload(imageUrl, imageName) {
        if (imageUrl) {
            const cacheBustedUrl = `${imageUrl}?_=${new Date().getTime()}`;

            fetch(cacheBustedUrl, { cache: 'reload' })
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = imageName; // Set the name for the downloaded image
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch((e) => console.log(e));
        }
    }

    function handleEmail(item) {
        try {
            SendQRCode({ id: item?.id }, (response) => {
                if (response && response.success) {
                    toast.success('QR sent to your registered email!');
                } else {
                    toast.error(`Failed to send email!`)
                }
            });
        } catch (error) {
            toast.error(`Failed to send email!`)
        }
    }

    const handleView = (item) => {
        setOpenData(item)
        setOpen(true)
    }

    return (
        <>
            <Navbar />

            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbChild='MyQRTags' breadCrumbActive='Manage MyQRTags' />

            <TopNavbar />

            <div className='section-background' style={{ minHeight: '100vh' }}>
                <div className='container py-5'>
                    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: '12px' }}>
                        <div className='border-bottom p-3'>
                            <Box
                                display="flex"
                                flexDirection={{ xs: 'column', lg: 'row' }}
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e5af9', whiteSpace: 'nowrap', fontSize: 21 }}>My QR Tags</Typography>

                                <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: { xs: 'column', sm: 'row'},
                                        justifyContent: { xs: "center", sm: "space-between" },
                                        maxWidth: '400px',
                                        width: '100%',
                                        gap: 2
                                }}>
                                    <Button variant="outlined" size="medium"  onClick={() => nav(`/store`)}>Buy More QR Tags</Button>

                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#e4eaff',
                                        borderRadius: '999px',
                                        padding: '4px',
                                        height: '40px',
                                        maxWidth: '200px',
                                        width: '100%',
                                        position: 'relative',
                                        cursor: 'pointer'
                                    }}>

                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                left: isUsed ? 4 : 'calc(100% - 96px)',
                                                width: '92px',
                                                height: '32px',
                                                backgroundColor: '#fff',
                                                borderRadius: '999px',
                                                transition: 'left 0.3s ease',
                                                zIndex: 1,
                                            }}
                                        />

                                        <Typography
                                            onClick={() => setIsUsed(true)}
                                            sx={{
                                                zIndex: 2,
                                                width: '50%',
                                                textAlign: 'center',
                                                fontWeight: 500,
                                                color: isUsed ? '#000' : '#555',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Used
                                        </Typography>

                                        <Typography
                                            onClick={() => setIsUsed(false)}
                                            sx={{
                                                zIndex: 2,
                                                width: '50%',
                                                textAlign: 'center',
                                                fontWeight: 500,
                                                color: !isUsed ? '#000' : '#555',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Unused
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </div>

                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ color: '#64748b', fontSize: '16px', minWidth: '170px', width: '170px' }}>QR Tag</TableCell>
                                    <TableCell style={{ color: '#64748b', fontSize: '16px' }}>Name</TableCell>
                                    <TableCell style={{ color: '#64748b', fontSize: '16px' }}>Manufacturer</TableCell>
                                    <TableCell style={{ color: '#64748b', fontSize: '16px' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {(qrtags && qrtags.length > 0) ? <>
                                    {qrtags.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell style={{ minWidth: '170px', width: '170px' }}>
                                                <img src={item.qr_code} alt="QR Code" width={100} />
                                            </TableCell>
                                            <TableCell>{item.item_details?.name || ''}</TableCell>
                                            <TableCell>{item.item_details?.manufacturer || ''}</TableCell>
                                            <TableCell>
                                                <Box display="flex" gap={1}>

                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            backgroundColor: '#b6b6b6',
                                                            color: '#fff',
                                                            width: '100%',
                                                            height: '40px',
                                                            textTransform: 'none',
                                                            borderRadius: '8px',
                                                            '&:hover': {
                                                                backgroundColor: '#b6b6b6'
                                                            }
                                                        }}
                                                        onClick={() => handleView(item)}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            backgroundColor: '#1e5af9',
                                                            color: '#fff',
                                                            width: '100%',
                                                            height: '40px',
                                                            textTransform: 'none',
                                                            borderRadius: '8px',
                                                            '&:hover': {
                                                                backgroundColor: '#1e5af9'
                                                            }
                                                        }}
                                                        onClick={() => handleDownload(item.qr_code, `${item.item_details?.name}.jpg`)}
                                                    >
                                                        Download
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            backgroundColor: '#56c134',
                                                            color: '#fff',
                                                            width: '100%',
                                                            height: '40px',
                                                            textTransform: 'none',
                                                            borderRadius: '8px',
                                                            '&:hover': {
                                                                backgroundColor: '#56c134'
                                                            }
                                                        }}
                                                        onClick={() => handleEmail(item, `${item.item_details?.name}.jpg`)}
                                                    >
                                                        Email
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </> : <>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <p className='text-muted py-4 text-center'>No QR tags found</p>
                                        </TableCell>
                                    </TableRow>
                                </>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            <Footer />

            <ViewQRModal 
                open={open}
                setOpen={setOpen}
                openData={openData}
            />
        </>
    )
}

export default MyQRTagsNew
