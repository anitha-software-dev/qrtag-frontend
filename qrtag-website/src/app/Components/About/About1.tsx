import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const About1 = () => {
  return (
    <section className=" about-bg cs_about cs_style_1 position-relative overflow-hidden">
      <div className="cs_height_120 cs_height_lg_80 "></div>
      <div className=''></div>
      <div className="container">
        <div className="row text-lg-start text-center " id='about'>
          <div className="col-lg-5">
            <div className="cs_about_content">
              <div className="cs_section_heading mobile-heading cs_style_1 ">
                <h2 className="cs_fs_60 wow fadeInDown">About <br /><span className='green-text'>QRTag.it</span> App</h2>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-content d-md-block d-none">
              <p className="cs_fs_20 mb-0 " style={{ color:"#7a7a7a"}}>Tag and keep track of all your valuable stuff with the QRTag.it app.<br/> If you misplace one of your items, mark it as lost and your tag will become active, allowing you to know the instant your tag has been found and where it was scanned. </p>
            </div>
            <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-content d-block d-md-none">
              <p className="cs_fs_20 mb-0 " style={{ color: "#7a7a7a" }}>Tag and keep track of all your valuable stuff with the QRTag.it app. If you misplace one of your items, mark it as lost and your tag will become active, allowing you to know the instant your tag has been found and where it was scanned. </p>
            </div>
            <div className="cs_about_btn_group">
              <Link href="https://app.qrtag.it/" className="cs_btn cs_style_1 cs_fs_16 cs_bold text-Capitalize wow fadeInLeft"><span>Sign in</span></Link>
            </div>
          </div>
        </div>

      </div>
      <div className="cs_height_80 cs_height_lg_40"></div>
    </section>
  );
};

export default About1;