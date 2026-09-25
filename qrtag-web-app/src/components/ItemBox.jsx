import React from 'react'
import './css/App.css';
import ErrorIcon from '@mui/icons-material/Error';


const ItemBox = ({ src, status, alt, name, onClick }) => {
  return (
    <div className='box_outline item-box' style={{ position: 'relative', paddingBottom: '1%', cursor: 'pointer' }}  onClick={onClick}>
      {(status && status === 'found') ? <div className="box_item_badge found"><ErrorIcon sx={{ fontSize: 14 }} className='mx-1' /><div>FOUND</div></div> : (status && status === 'lost') ? <div className="box_item_badge lost"><ErrorIcon sx={{ fontSize: 14 }} className='mx-1' /><div>LOST</div></div> : <></> }
      <div className='item_img_div'>
        <img src={src} alt={alt} />
      </div>
      <h1 className='item_heading text-center mt-3'>{name}</h1>
    </div>
  )
}

export default ItemBox