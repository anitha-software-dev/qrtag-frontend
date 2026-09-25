import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Avatar, Button, IconButton, Card, CardContent, Grid, Typography, Box,
    Tooltip
} from '@mui/material';

import { Link } from 'react-router-dom';
import DeleteMemorialModal from '../common/DeleteMemorialModal';
import Axios from '../../config/axios';
import Breadcrumbs from '../common/Breadcrumbs'
import Footer from '../common/Footer'
import AddIcon from '../../images/add-item.png'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import RemoveIcon from '@mui/icons-material/Remove'
import ViewIcon from '../../images/view.png'
import EditIcon from '../../images/Edit.png'
import DeleteIcon from '../../images/delete.png'
import CreateMemorial from './CreateMemorial';
import { BeatLoader } from 'react-spinners'
import PublishModal from '../common/PublishModal'


const MemorialList = () => {

    const [memorialList, setMemorialList] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [itemId, setItemId] = useState(null)
    const [editMemorialId, setEditMemorialId] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [publish, setPublish] = useState(false);

    const paginationBtnStyle = {
        minWidth: '35px',
        height: '35px',
        backgroundColor: '#f8fafc',
        color: '#334155',
        borderRadius: '8px',
        boxShadow: 'inset 0 0 0 1px #e2e8f0',
        '&:hover': { backgroundColor: '#f1f5f9' }
    }

    const getAllMemorials = () => {
        setIsFetching(true);
        Axios.get('/common/digital-memorial/')
            .then((res) => {
                setIsFetching(false);
                if (res && res.data) {
                    setMemorialList(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
                setIsFetching(false);
                setMemorialList([]);
            });
    };

    useEffect(() => {
        getAllMemorials();
    }, []);

    const openDeleteMemorialModal = (id) => {
        setDeleteModal(true)
        setItemId(id)
    }

    const openPublishModal = (id) => {
        setPublish(true)
        setItemId(id)
    }

    const handleDownload = (qrCodeUrl) => {
        if (!qrCodeUrl) return;

        try {
            const cacheBustedUrl = `${qrCodeUrl}?_=${new Date().getTime()}`;

            fetch(cacheBustedUrl, { cache: 'reload' })
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'qr_code.png';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch((e) => {
                    console.error('Download failed:', e);
                });
        } catch (error) {
            console.error('Failed to download the QR code:', error);
        }
    };


    return (
        <>
            <Navbar />
            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbChild='Memorials' breadCrumbActive='Manage Memorials' />

            <div className='section-background' style={{ minHeight: '100vh' }}>
                <div className="container py-5" >
                    <div className='p-2 p-md-0' style={{ background: '#fff', borderRadius: '10px' }}>

                        <Grid container alignItems="center" justifyContent="space-between" spacing={2} sx={{
                            padding: '2%', borderBottom: '1px solid #E2E8F0', py: { xs: 3, md: 2 }
                        }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                    <Typography variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: '#1e5af9',
                                            whiteSpace: 'nowrap',
                                            fontSize: 21,
                                            display: 'inline-block'
                                        }}
                                    >
                                        Memorials
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} container justifyContent={{ xs: 'center', sm: 'flex-end' }}>

                                <Button
                                    onClick={() => {
                                        setEditMemorialId(null);
                                        setOpenDrawer(true);
                                    }}
                                    sx={{
                                        backgroundColor: '#ef4444',
                                        color: '#fff',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        borderRadius: '6px',
                                        px: 2,
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        '&:hover': { backgroundColor: '#dc2626' }
                                    }}
                                >
                                    Add Memorial
                                    <img src={AddIcon} alt="add" width={25} />
                                </Button>
                            </Grid>

                        </Grid>
                        {(isFetching) ? <>
                            <div className='text-center w-100' style={{ minHeight: "200px", marginTop: "8rem" }}>
                                <BeatLoader />
                            </div>
                        </> : <>

                            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ color: '#64748b', fontSize: '16px' }}>Name</TableCell>
                                            <TableCell style={{ color: '#64748b', fontSize: '16px' }}>DOB</TableCell>
                                            <TableCell style={{ color: '#64748b', fontSize: '16px' }}>DOD</TableCell>
                                            <TableCell align="right" style={{ color: '#64748b', fontSize: '16px', maxWidth: '200px' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {memorialList && memorialList.length > 0 ? (
                                            memorialList.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <img
                                                                src={item.profile_photo || '/placeholder.png'}
                                                                alt="avatar"
                                                                style={{ borderRadius: '5px' }}
                                                                width={50}
                                                                height={60}
                                                            />
                                                            <span>{item.name}</span>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell style={{ width: '150px', minWidth: '150px' }}><span>{item.from_date}</span></TableCell>
                                                    <TableCell style={{ width: '150px', minWidth: '150px' }}><span>{item.to_date}</span></TableCell>

                                                    <TableCell align="right">
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="flex-end"
                                                            gap={1.5}
                                                            flexWrap="nowrap"
                                                        >
                                                            {item.status !== 'publish' ? (
                                                                <Button
                                                                    variant="contained"
                                                                    sx={{
                                                                        backgroundColor: '#1e5af9',
                                                                        textTransform: 'none',
                                                                        minWidth: '95px',
                                                                        marginRight: '10%',
                                                                        fontSize: '0.9rem',
                                                                        fontWeight: 400,
                                                                        '&:hover': { backgroundColor: '#154be0' }
                                                                    }}
                                                                    onClick={() => openPublishModal(item.id)}
                                                                >
                                                                    Publish
                                                                </Button>
                                                            ) : item.status === 'publish' && item.qr_code !== null ? (

                                                                <Button
                                                                    variant="contained"
                                                                    sx={{
                                                                        backgroundColor: '#797979',
                                                                        textTransform: 'none',
                                                                        minWidth: '95px',
                                                                        marginRight: '10%',
                                                                        fontSize: '0.9rem',
                                                                        fontWeight: 400,
                                                                        '&:hover': { backgroundColor: '#797979' }
                                                                    }}

                                                                    onClick={() => handleDownload(item.qr_code)}
                                                                >
                                                                    Download
                                                                </Button>
                                                            ) : null}

                                                            <Link to={`/memorial/${item.id}`}>
                                                                <Tooltip title="View Memorial" placement="top" arrow>
                                                                    <img
                                                                        src={ViewIcon}
                                                                        alt="view"
                                                                        style={{ cursor: 'pointer' }}
                                                                        width={35}
                                                                    />
                                                                </Tooltip>
                                                            </Link>
                                                            <Tooltip title="Edit Memorial" placement="top" arrow>
                                                                <img
                                                                    src={EditIcon}
                                                                    alt="edit"
                                                                    style={{ cursor: 'pointer' }}
                                                                    width={35}
                                                                    onClick={() => {
                                                                        setEditMemorialId(item.id);
                                                                        setOpenDrawer(true);
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="Delete Memorial" placement="top" arrow>
                                                                <img
                                                                    src={DeleteIcon}
                                                                    alt="delete"
                                                                    style={{ cursor: 'pointer' }}
                                                                    width={35}
                                                                    onClick={() => openDeleteMemorialModal(item.id)}
                                                                />
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>

                                                </TableRow>
                                            ))
                                        ) : (
                                            !isFetching && (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'gray' }}>
                                                        No Memorials Found!
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>

                                <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" sx={{
                                    flexDirection: { xs: 'column', lg: 'row' },
                                    gap: { xs: 2, lg: 0 }
                                }}>

                                    <Typography fontSize={13} color="#1C2434" display="flex" alignItems="center" sx={{ justifyContent: { xs: 'center', lg: 'flex-start' }, width: { xs: '100%', lg: 'auto' } }}>

                                    </Typography>

                                    <Box display="flex" gap={1} sx={{
                                        justifyContent: { xs: 'center', lg: 'flex-end' },
                                        width: { xs: '100%', lg: 'auto' },
                                        flexWrap: 'wrap',
                                    }}>
                                        <Button size="small" sx={paginationBtnStyle}><ChevronLeftIcon fontSize="small" /></Button>
                                        <Button size="small" sx={{ ...paginationBtnStyle, backgroundColor: '#1e5af9', color: '#fff' }}>1</Button>
                                        <Button size="small" sx={paginationBtnStyle}><ChevronRightIcon fontSize="small" /></Button>
                                    </Box>
                                </Box>
                            </TableContainer>
                        </>}
                    </div>

                </div >

                {openDrawer && (
                    <CreateMemorial
                        open={openDrawer}
                        onClose={() => setOpenDrawer(false)}
                        memorialId={editMemorialId}
                        getList={getAllMemorials}
                    />
                )}

                {publish && (
                    <PublishModal
                        open={publish}
                        setOpen={setPublish}
                        itemId={itemId}
                        getList={getAllMemorials}
                    />
                )}

                <DeleteMemorialModal
                    open={deleteModal}
                    setOpen={setDeleteModal}
                    itemId={itemId}
                    getList={getAllMemorials}
                />
            </div>

            <Footer />
        </>
    );
};

export default MemorialList;
