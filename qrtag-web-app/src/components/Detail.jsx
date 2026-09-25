import './css/App.css';
import Axios from '../config/axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditModal from './EditModal';
import UnlockFeatureModal from './common/UnlockFeatureModal'
import { Store } from '../StoreContext';
import { useNavigate } from 'react-router-dom'
import { Edit } from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const Detail = () => {

  const { user } = Store();
  const [singleData, setSingleData] = useState();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemTypes, setItemTypes] = useState([]);
  const [isEligible, setIsEligible] = useState(false);

  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/mystuff')
  }

  let { id } = useParams();

  const handleSingleData = () => {
    Axios.get(`/looser/items/${id}/`)
      .then((res) => {
        setSingleData(res?.data);
      })
      .catch((err) => console.log(err));
  };

  const handleItemTypes = () => {
    Axios.get(`/common/item-type/`)
      .then((res) => {
        setItemTypes(res?.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleSingleData();
    handleItemTypes()
  }, []);

  useEffect(() => {
    Axios.get(`/users/addItemEligibility/`)
      .then((res) => {
        if (res?.data && res?.data?.status === true) {
          setIsEligible(true)
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // console.log(singleData, 'singleData');
  const handleFoundButton = () => {
    if (user) {
      if (user.is_trial || user.is_honorary || user.subscription_plan !== null) {
        if (singleData?.status === 'lost') {
          Axios.post(`/looser/items/${singleData?.id}/mark-found/`)
            .then((res) => {
              toast.success("Item status marked as found!");
              handleSingleData();
            })
            .catch((err) => console.log(err));
        } else {
          Axios.post(`/looser/items/${singleData?.id}/mark-lost/`)
            .then((res) => {
              toast.success("Item status marked as lost!");
              handleSingleData();
            })
            .catch((err) => console.log(err));
        }
      } else {
        setOpenModal(true)
      }
    }
  };
  const handleOpen = () => {
    if (user) {
      if (user.is_trial || user.is_honorary || user.subscription_plan !== null) {
        setOpen(true);
      } else {
        setOpenModal(true)
      }
    }
    // if (user && user.subscription_plan === null && user.is_trial === false && user.is_honorary === false) {
    //   setOpenModal(true)
    //   return false
    // }
    // setOpen(true);
  }
  const handleClose = () => setOpen(false);

  const images = singleData?.photos?.length
    ? singleData.photos.map((item) => ({
      original: item?.photo,
      thumbnail: item?.photo,
      originalHeight: '350'
    }))
    : [];

  return (
    <>
      <div className='container main_layout detail_layout my-4'>
        <EditModal
          handleOpen={handleOpen}
          handleClose={handleClose}
          open={open}
          singleData={singleData}
          handleSingleData={handleSingleData}
          itemTypes={itemTypes}
        />
        <div className='all_images'>
          <div className='justify-content-start my-2'>
            <button onClick={handleBack} className='back_button' style={{ marginLeft: '-7px' }}>
              <ArrowBackIcon /> Back
            </button>
          </div>

          {/* <div className='main_img_div'>
            <img src={singleData?.photos?.[0]?.photo} alt='' />
          </div>
          <div className='images_div mt-2'>
            {singleData?.photos
              ?.slice(1, singleData?.photos?.length)
              .map((item) => {
                return (
                  <div className='d-flex w-100'>
                    <div key={item.id} className='img_div'>
                      <img src={item?.photo} alt='' />
                    </div>
                  </div>
                );
              })}
          </div> */}
          <div className='main_img_div'>
            {images.length > 0 && (
              <ImageGallery
                items={images}
                showThumbnails={true}
                showFullscreenButton={false}
                showPlayButton={false}
                autoPlay={false}
              />
            )}
          </div>
        </div>
        <div className='details_div'>
          <div className='name_detail_div mt-4 mt-md-0'>
            <h2>{singleData?.name}</h2>

            <button onClick={handleOpen} className='details_edit' style={{ paddingRight: '0px' }}>
              <Edit style={{ fontSize: 20 }} /> Edit Details
            </button>

          </div>
          <div>
            {singleData?.manufacturer && (
              <div className='item_history_div'>
                <p><b>Manufacturer:</b></p>
                <p>{singleData?.manufacturer}</p>
              </div>
            )}
            {singleData?.serial_no && (
              <div className='item_history_div'>
                <p><b>Serial Number:</b></p>
                <p>{singleData?.serial_no}</p>
              </div>
            )}
            {singleData?.estimated_value && (
              <div className='item_history_div'>
                <p><b>Estimated Value:</b></p>
                <p>{singleData?.estimated_value}</p>
              </div>
            )}
            {singleData?.item_type && (
              <div className='item_history_div'>
                <p><b>Type:</b></p>
                <p>{singleData?.item_type?.name}</p>
              </div>
            )}
            {singleData?.description && (
              <>
                <p>
                  <b>Description:</b>
                </p>
                <p className='LostItem_Description'>{singleData?.description}</p>
              </>
            )}
          </div>
          <div className='divider'></div>
          {singleData?.history.length > 0 && (
            <div className='history_div'>
              <h3 className='LostItem_History_H mt-2'>
                <b>History</b>
              </h3>
              {singleData?.history
                ?.slice()
                .sort((a, b) => new Date(b?.date) - new Date(a?.date))
                .map((item) => {
                  return (
                    <>
                      <div className='LostItem_History_P'>
                        <p>
                          <b>Item {item?.status}</b>
                        </p>

                        <p>
                          <span>{new Date(item?.date).toLocaleTimeString()}</span>
                          <span style={{ margin: '0 3px' }}> | </span>
                          <span>{new Date(item?.date).toLocaleDateString()}</span>
                        </p>

                      </div>
                      <div className='LostItem_History_P'>
                        <p>
                          <b className='locaion_p'>Scanned Location</b>
                        </p>
                        <div className='location_div'>
                          <p className='location_p'>{item?.location ? item.location : <span style={{ display: 'block', textAlign: 'center', fontWeight: 'bold' }}>-</span>}</p>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          )}
          <div className='status_div'>
            <p className='my-3'>
              This item is currently{' '}
              <span className={singleData?.status === 'lost' ? 'red' : 'blue'}>
                {singleData?.status}
              </span>
            </p>
          </div>
          <div className='status_div'>
            <button
              style={{
                backgroundColor:
                  singleData?.status === 'found' ? 'red' : '#0a3f74',
              }}
              onClick={handleFoundButton}
              className='found_btn'
            >
              Mark as{' '}
              <span>{singleData?.status === 'found' ? 'lost' : 'found'}</span>
            </button>
          </div>
        </div>
      </div>

      {openModal && (
        <UnlockFeatureModal
          open={openModal}
          setOpen={setOpenModal}
        />
      )}
    </>
  );
};

export default Detail;
