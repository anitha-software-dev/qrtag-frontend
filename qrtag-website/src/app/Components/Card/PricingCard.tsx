import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const PricingCard = ({addclass,name,content,price,duration,featurelist,btnname,btnurl}) => {
    return (
        <div className={addclass}>
        <div className="cs_pricing_head">
          <div className="cs_pricing_head_text ">
            <h3 className="cs_pricing_head_title cs_fs_32 mb-0">{name}</h3>
            <p className="cs_pricing_head_subtitle cs_mb_30">{content}</p>
            <div className="cs_pricing_seperator cs_mb_25"></div>
            <h3 className="cs_price_value cs_fs_48 cs_mb_25">{price} <small>{duration}</small></h3>
          </div>
        </div>
        <div className="cs_pricing_seperator cs_mb_35"></div>
        <div className="cs_pricing_feature cs_mb_20">
          <ul className="cs_pricing_feature_list cs_medium cs_mp_0">
          {featurelist?.map((item, index) => (
            <li key={index} style={{ display: 'flex', gap: '8px' }}>
              <i className="bi bi-check-lg text-success"></i>
              <span>{item}</span>
            </li>
            ))}
          </ul>
        </div>
        <Link href={btnurl} className="cs_pricing_btn cs_radius_8 cs_semibold text-capitalize" aria-label="Click to buy service">{btnname}</Link>
      </div>
    );
};

export default PricingCard;