import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Benefits1 = () => {

  const chooseContent = [
    { img: '/assets/img/login_ico.png', title: 'Simple Login', content: 'Google, Facebook, Apple or Phone Number' },
    { img: '/assets/img/down_ico.png', title: 'Free to Download', content: 'Your first QR Tag is free and will ship upon registration.' },
    { img: '/assets/img/item_ico.png', title: 'Add Items Quickly', content: 'Add item information to share with finders to assist in return.' },
    { img: '/assets/img/regd_ico.png', title: 'Register Valuables', content: 'Add information to replace valuables in case of emergency.' },
  ];

  return (
    <section style={{ backgroundColor: "#1E5AF9" }}>
      <div className="cs_height_120 cs_height_lg_80"></div>
      <div className="container">
        <div className="cs_section_heading mobile-heading cs_style_1 text-center">
          <div className=" cs_center cs_fs_16 cs_accent_color cs_mb_20 wow fadeInDown text-white  ">
            <p className='benefit-title px-4 py-1 cs_radius_20'> OUR BENEFITS</p>
          </div>
          <h2 className="cs_fs_60 mb-0 wow fadeInUp text-white line-height">Scan. Connect. <span className='peach-text'>Reclaim <br />Lost Items!</span></h2>
        </div>
        <div className="cs_height_40 cs_height_lg_50"></div>
        <div className="row cs_row_gap_30 cs_gap_y_30">
          {chooseContent.map((item, i) => (
            <div key={i} className="col-xl-3 col-md-6 wow fadeInDown py-2">
              <div className="cs_card cs_style_2 px-1 px-lg-2 py-5 cs_radius_10 position-relative overflow-hidden">
                <span className="cs_card_icon cs_white_bg cs_center cs_radius_50 cs_mb_25 ">
                  <Image src={item.img} alt="img" width={81} height={81} />
                </span>
                <div className="cs_card_content text-center">
                  <h3 className="cs_card_title cs_fs_22 cs_semibold cs_mb_10">{item.title}</h3>
                  <p className="cs_card_subtitle cs_mb_22 mx-1 cs_fs_14">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cs_height_120 cs_height_lg_80"></div>
    </section>
  );
};

export default Benefits1;