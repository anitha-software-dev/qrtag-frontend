
import '../css/App.css'
import Navbar from '../common/Navbar'
import { useEffect, useState } from 'react';

import EditIcon from '../../images/edit-icon.png';
import 'react-image-gallery/styles/css/image-gallery.css';
import Footer from '../common/Footer.js'
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Breadcrumbs from '../common/Breadcrumbs'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ItemBox from './ItemBox';
import Axios from '../../config/axios'
import { BeatLoader } from 'react-spinners'
import AddItemDrawer from '../common/AddItemDrawer';
import TopNavbar from '../common/TopNavContent';

const ItemDetails = () => {

    const { id } = useParams()
    const nav = useNavigate()

    const [loading, setLoading] = useState();
    const [itemData, setItemData] = useState({});
    const [openEditDrawer, setOpenEditDrawer] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false);
    const [itemTypes, setItemTypes] = useState([]);

    const toggleEditDrawer = (open) => () => {
        setOpenEditDrawer(open);
    };

    const fetchItem = async () => {
        setLoading(true)
        const { data } = await Axios.get(`/looser/items/${id}/`)
        setLoading(false)
        if (data) {
            setItemData(data)
        } else {
            setItemData({})
        }
    }

    const handleAction = () => {
        if (itemData?.status === 'lost') {
          Axios.post(`/looser/items/${itemData?.id}/mark-found/`)
            .then((res) => {
              if (res?.status === 200) {
                toast.success('The item has been marked as found!');
                fetchItem()
              } else {
                toast.error('Update Failed!');
              }
            })
            .catch((err) => console.log(err));
        } else {
          Axios.post(`/looser/items/${itemData?.id}/mark-lost/`)
            .then((res) => {
              fetchItem()
              if (res?.status === 200) {
                toast.success('The item has been marked as lost!');
                fetchItem()
              } else {
                toast.error('Update Failed!');
              }
            })
            .catch((err) => console.log(err));
        }
    };

    const fetchItemTypes = () => {
        Axios.get(`/common/item-type/`)
            .then((res) => {
                setItemTypes(res?.data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        if (id) {
            fetchItem()
            fetchItemTypes()
        }
    }, [id])

    return (
        <>
            <Navbar />

            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbChild='My Stuff' breadCrumbActive={itemData?.name} />
            <TopNavbar />

            <div className='py-3 py-lg-5 p-3 p-md-0' style={{ backgroundColor: '#dfe7fb' }}>
                <div className='container finder_layout p-3' style={{ backgroundColor: '#fff', borderRadius: '10px' }}>
                    <div className='d-flex flex-lg-row flex-column justify-content-between border-bottom'>
                        <div className='d-flex mb-md-3 mb-0 mx-2 mt-3' onClick={() => nav(`/`)} style={{ cursor: "pointer", fontWeight: 600 }}>
                            <ArrowBackIcon style={{ color: '#1e5af9' }} />
                            <p className='mb-0 mb-md-2' style={{ marginLeft: "5px", color: '#1e5af9' }}>My Stuff</p>
                        </div>

                        <div className='m-3 m-md-0'>
                            <Button
                                sx={{ backgroundColor: '#ef4444', color: '#fff', textTransform: 'none', fontWeight: 500, borderRadius: '6px', display: 'flex', alignItems: 'center', height: 50, px: 2, gap: 1, '&:hover': { backgroundColor: '#dc2626' } }}
                                onClick={() => setOpenEditModal(true)}
                            >
                                Edit Details
                                <img src={EditIcon} alt="edit" width={30} />
                            </Button>
                        </div>

                    </div>

                    {(loading) ? <>
                        <div className='text-center w-100' style={{ minHeight: "300px", marginTop: "8rem" }}>
                            <BeatLoader />
                        </div>
                    </> : <>
                        <ItemBox data={itemData} handleAction={handleAction} />
                    </>}

                </div>
            </div>

            <Footer />

            {openEditModal && (
                <AddItemDrawer
                    open={openEditModal}
                    setOpen={setOpenEditModal}
                    itemTypes={itemTypes}
                    getList={fetchItem}
                    itemData={itemData}
                    isEdit={true}
                />
            )}
        </>
    )
}

export default ItemDetails;
