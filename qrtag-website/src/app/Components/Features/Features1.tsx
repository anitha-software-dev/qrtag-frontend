import Image from 'next/image';
import React from 'react';

const Counter1 = () => {
  return (
    <div className="cs_counter cs_style_1 mt-4" id='features'>
      <div className="container">
        <div className="row" >
          <div className="col-lg-3 col-sm-6">
            <div className="cs_counter_wrapper text-center text-md-start my-3 my-md-0 px-3 py-3 cs_bg_gradient feature-border cs_radius_10">
              <span className="counter_card_icon cs_white_bg cs_radius_50 cs_mb_25">
                <Image src={'/assets/img/scan.png'} alt="img" width={65} height={65} />
              </span>
              <div className=" cs_fs_22 cs_bold feature-heading mb-3">
                Found an Item?
              </div>
              <p className="feature-content cs_fs_14 mb-0">Finders can use their phone&apos;s camera to scan the QR Tag and communicate through the website to safely return your items.</p>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="cs_counter_wrapper text-center text-md-start my-3 my-md-0 px-3 py-3 cs_bg_gradient text-left feature-border cs_radius_10 ">
              <span className="counter_card_icon cs_white_bg cs_radius_50 cs_mb_25">
                <Image src={'/assets/img/bell.png'} alt="img" width={65} height={65} />
              </span>
              <div className=" cs_fs_22 cs_bold feature-heading mb-3">
                Receive Notification
              </div>
              <p className="feature-content cs_fs_14 mb-0">You receive notifications when your QRCode-tagged item is scanned, providing easy communication with finders to aid retrieval.</p>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="cs_counter_wrapper text-center text-md-start my-3 my-md-0 px-3 py-3 cs_bg_gradient text-left feature-border cs_radius_10 ">
              <span className="counter_card_icon cs_white_bg cs_radius_50 cs_mb_25">
                <Image src={'/assets/img/chat.png'} alt="img" width={65} height={65} />
              </span>
              <div className="cs_fs_22 cs_bold feature-heading mb-3">
                Chat Feature
              </div>
              <p className="feature-content cs_fs_14 mb-0">Chat with finders of scanned lost items through the app, controlling communication access until the items is marked as returned.</p>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="cs_counter_wrapper text-center text-md-start my-3 my-md-0 px-3 py-3 cs_bg_gradient text-left feature-border cs_radius_10">
              <span className="counter_card_icon cs_white_bg cs_radius_50 cs_mb_25">
                <Image src={'/assets/img/rewards.png'} alt="img" width={65} height={65} />
              </span>
              <div className="cs_fs_22 cs_bold feature-heading mb-3">
                Provide Rewards
              </div>
              <p className="feature-content cs_fs_14 mb-0">Offer rewards for finders returning lost items, claimable through our website without sharing personal details.</p>
            </div>

          </div>
        </div>
      </div>
      <div className="cs_height_120 cs_height_lg_40"></div>
    </div>
  );
};

export default Counter1;