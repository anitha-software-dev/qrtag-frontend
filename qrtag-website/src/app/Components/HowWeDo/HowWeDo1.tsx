import Image from 'next/image';
import React from 'react';

const HowWeDo = () => {
  return (
    <section className="position-relative blue-bg overflow-hidden">
      <div className="cs_height_120 cs_height_lg_80"></div>
      <div className="container" id='how-it-works'>
        <div className="row cs_gap_y_40  position-relative z-1">
          <div className="col-lg-6 text-center text-lg-start">
            <div className="cs_section_heading cs_style_1 cs_type_1 align-items-center">
              <div className="cs_section_heading_left  mobile-heading ">
                <h3 className='blue-text blue-text-style cs_fs_20'>HOW IT WORKS</h3>
                <div className=''>
                  <h2 className="cs_fs_60 mb-0 wow fadeInUp line-height">Join <span style={{ color: "#8ACD42" }}>QR Tag</span> in 3 <br />Simple Steps</h2>
                </div>
              </div>

            </div>
            <div className="cs_height_30 cs_height_lg_50"></div>
            <div className=" cs_iconbox_wrapper wow fadeInLeft ">
              <div className="cs_iconbox cs_style_1">
                <div className="cs_iconbox_info mobile-content how-para">
                  <h3 className="cs_fs_22 how-title cs_mb_12"><span>01.</span>Stick it</h3>
                  <p className="cs_fs_16 cs_light mb-0 d-md-block d-none">Stick your QR Tag to your valuable items that have a <br /> smooth, dry surface.</p>
                  <p className="cs_fs_16 cs_light mb-0 d-block d-md-none">Stick your QR Tag to your valuable items that have a smooth, dry surface.</p>
                </div>
              </div>
              <div className="cs_iconbox cs_style_1">
                <div className="cs_iconbox_info mobile-content how-para">
                  <h3 className="cs_fs_22 how-title cs_mb_12"><span>02.</span>Activate it</h3>
                  <p className="cs_fs_16 cs_light mb-0  d-md-block d-none">Activate each tag in the QRTag.it app individually.<br /> Enter the info about the item that you want included.</p>
                  <p className="cs_fs_16 cs_light mb-0  d-block d-md-none">Activate each tag in the QRTag.it app individually. Enter the info about the item that you want included.</p>
                </div>
              </div>
              <div className="cs_iconbox cs_style_1">
                <div className="cs_iconbox_info mobile-content how-para">
                  <h3 className="cs_fs_22 how-title cs_mb_12"><span>03.</span>Scan it</h3>
                  <p className="cs_fs_16 cs_light mb-0 d-md-block d-none">If someone finds your lost item, they can scan the <br /> tag and connect with you through the app so you <br /> can reconnect!</p>
                  <p className="cs_fs_16 cs_light mb-0 d-block d-md-none">If someone finds your lost item, they can scan the tag and connect with you through the app so you can reconnect!</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 ">
            <div className=" cs_center position-relative">
              <Image src="/assets/img/steps-join.png" alt="img" width={800} height={1300} />
            </div>
          </div>
        </div>

      </div>
      <div className="cs_height_120 cs_height_lg_80"></div>
    </section>
  );
};

export default HowWeDo;