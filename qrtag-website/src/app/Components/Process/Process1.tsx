import Image from 'next/image';
import React from 'react';

const Process1 = () => {
  return (
    <section className="cs_about solution-cycle cs_style_1 position-relative overflow-hidden">
      <div className="cs_height_120 cs_height_lg_80"></div>
      <div className="container">
        <div className="row cs_gap_y_40 text-center text-md-start">
          <div className="col-lg-4">
            <div className="cs_about_content">
              <div className="cs_section_heading mobile-heading cs_style_1">
                <h2 className="cs_fs_75 mb-0 wow fadeInDown">Our <br /><span className='green-text'>Solutions</span></h2>
              </div>
            </div>
          </div>
          <div className="col-lg-8 pb-0 pb-md-5 ml-5">
            <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-content">
              <p className="cs_fs_18">At QRTag.it, we empower Consumers, Businesses, and Government agencies with secure, smart, and scalable QR-based solutions.  </p>

              <p className="cs_fs_18 ">Our portfolio spans eight robust solution categories covering 30+ real-world use cases — helping protect assets, connect people, manage experiences, and power digital transformation. </p>

              <p className="cs_fs_16 dark-blue-text mb-0">All QRTag.it solutions are secure, privacy-compliant, and customizable for your needs.   </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cs_process_content py-md-5 py-5 ">
        <Image src="/assets/img/solutions.png" alt="img" className='' width={900} height={920} />
      </div>

      <div className="cs_height_60 cs_height_lg_90"></div>

    </section>

  );
};

export default Process1;