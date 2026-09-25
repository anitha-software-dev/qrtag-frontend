import '../css/App.css'
import { useEffect, useState } from 'react';

import GooglePlay from '../../images/Google Play.png'
import AppStore from '../../images/App Store.png'
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import LocationModal from '../common/locationPopup.js';
import { Store } from '../../StoreContext';

const ItemBox = ({ data, enableDownload, handleAction }) => {

    const { user, loggedIn } = Store();
    const [histories, setHistories] = useState([])

    useEffect(() => {

        if (data && data?.history) {
            const hist = data?.history.filter((i) => i.status === 'scanned')
            setHistories(hist)
        }

    }, [data])

    const isPublic = (key) => {
        if (loggedIn && user.id === data?.user_id) {
            return true
        }
        const visibility = data?.visibility;
        if (!visibility || Object.keys(visibility).length === 0) {
            return true;
        }
        return visibility.hasOwnProperty(key) && visibility[key] === "public";
    }
    
    const handleButton = () => {
        if (handleAction) {
            handleAction()
        }
    }

    let images = [];

    if (data?.thumbnail && data?.thumbnail !== 'N/A') {
        images.push({
            original: data?.thumbnail,
            thumbnail: data?.thumbnail,
            originalHeight: '350'
        });
    }

    if (data?.photos) {
        images = [
            ...images,
            ...data?.photos
                .filter(item => item.photo !== data?.thumbnail)
                .map(item => ({
                    original: item.photo,
                    thumbnail: item.photo,
                    originalHeight: '350'
                }))
        ];
    }

    return (
        <>

            <div className=' main_layout detail_layout mt-2 my-4'>
                <div className=' all_images '>
                    <div className='main_img_div border rounded p-3'>
                        {images.length > 0 && (
                            <ImageGallery
                                items={images}
                                showThumbnails={true}
                                thumbnailPosition="bottom"
                                showFullscreenButton={false}
                                showPlayButton={false}
                                autoPlay={false}
                            />
                        )}
                    </div>
                </div>
                <div className='details_div'>
                    <div className='name_detail_div mt-4 mt-md-0'>
                        {(isPublic('name')) && <>
                            <h2 style={{ color: '#1E5AF9', fontSize: '45px' }}>{data?.name}</h2>
                        </>}
                    </div>
                    <div className='row g-0 border rounded overflow-hidden mb-3'>
                        {data?.id && <>
                            <div className='col-md-3 col-6 border-end border-bottom px-3 py-2'>
                                <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }} >Item ID:</p>
                                <p style={{ fontWeight: 600 }}>#{data?.id}</p>
                            </div>
                        </>}
                        {data?.manufacturer && isPublic('manufacturer') && <>
                            <div className='col-md-3 col-6 border-end  border-bottom px-3 py-2'>
                                <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Manufacturer</p>
                                <p style={{ fontWeight: 600 }}>{data?.manufacturer}</p>
                            </div>
                        </>}
                        {data?.serial_no && (isPublic('serial') || isPublic('serial_no')) && <>
                            <div className='col-md-3 col-6 border-end px-3 py-2'>
                                <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Serial Number</p>
                                <p style={{ fontWeight: 600 }}>{data?.serial_no}</p>
                            </div>
                        </>}
                        {data?.estimated_value && <>
                            <div className='col-md-3 col-6 px-2 py-2'>
                                <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Estimated Value</p>
                                <p style={{ fontWeight: 600 }}>${data?.estimated_value}</p>
                            </div>
                        </>}
                        {data?.description && isPublic('description') && <>
                            <div className='col-md-12 border-top px-3 py-2'>
                                <p style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Description:</p>
                                <p style={{ color: '#1C2434' }} className='LostItem_Description'>
                                    {data?.description}
                                </p>
                            </div>
                        </>}
                    </div>
                    {loggedIn && user.id === data?.user_id && (
                        <div className='history_div'>
                            <h3 className='LostItem_History_H mt-2 mb-2'>History</h3>
                            <div className='LostItem_HistoryDiv' style={{ border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px' }}>
                                {(histories && histories.length > 0) ? <>
                                    {histories.slice().sort((a, b) => new Date(b?.date) - new Date(a?.date)).map((item) => (
                                        <>
                                            <div className='LostItem_HistoryList'>
                                                <div className='LostItem_History_P' style={{ borderBottom: '1px solid #d1d5db' }}>
                                                    <p className='mb-1 mx-1' style={{ color: '#64748B', fontWeight: 500, fontSize: 15, textTransform: 'capitalize' }}>Item {item?.status}</p>
                                                    <p className='mb-1 mx-1'><span>{new Date(item?.date).toLocaleTimeString()}</span><span style={{ margin: '0 3px' }}>|</span><span>{new Date(item?.date).toLocaleDateString()}</span></p>
                                                </div>
                                                <div className='LostItem_History_P' style={{ borderBottom: '1px solid #d1d5db' }}>
                                                    <p className='mb-1 mx-1' style={{ color: '#64748B', fontWeight: 500, fontSize: 15 }}>Scanned Location</p>
                                                    <div className='location_div '><p className='location_p mb-1 mx-1' style={{ textAlign: 'right' }}>{item?.location}</p></div>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                </> : <>
                                    <p className='text-center py-5 text-muted'>No History Found!</p>
                                </>}
                            </div>
                        </div>
                    )}

                    <div className='status_div'>
                        <p className={`my-2 status-message ${data?.status === 'found' ? 'found' : 'lost'}`}>
                            This item is currently {data?.status}
                        </p>
                    </div>

                    {loggedIn && user.id === data.user_id && (
                        <div className='status_div '>
                            <LocationModal
                                data={data}
                                btnText={data?.status === "lost" ? 'Mark as found' : "Mark as lost"}
                                handleButton={handleButton}
                                status={data?.status}
                            />
                        </div>
                    )}

                    {user.id !== data?.user_id && (
                        <div className='status_div'>
                            <LocationModal data={data} btnText='Chat with the Owner' />
                        </div>
                    )}

                    {(enableDownload) && <>
                        <div className='mt-5'>
                            <h5 className='my-3'>
                                Download the QRTag.it App Now
                            </h5>
                            <p style={{ color: '#64748B', fontSize: '14px', fontWeight: 400, }}>
                                What are you waiting for? Download the QRTag.it App now! The user interface of QRTag.it is simple and easy to navigate
                            </p>
                        </div>
                        <div className='d-flex'>
                            <a href="https://apps.apple.com/us/app/qrtag-it/id6444082603" target="_blank">
                                <img
                                    src={AppStore}
                                    style={{ width: '120px', height: 'auto', marginRight: '10px' }}
                                    alt='App Store'
                                />
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.withered_feather_36062" target="_blank">
                                <img
                                    src={GooglePlay}
                                    style={{ width: '120px', height: 'auto' }}
                                    alt='Google Play'
                                />
                            </a>
                        </div>
                    </>}
                </div>

            </div>
        </>
    );
};

export default ItemBox;
