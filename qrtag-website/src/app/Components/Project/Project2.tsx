import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Project2 = () => {

  const chooseContent = [
    { img: '/assets/img/qrs/g7.jpg', title: 'PPC Advertising', content: 'Seo Design' },
    { img: '/assets/img/qrs/g3.png', title: 'PPC Advertising', content: 'Seo Design' },
    { img: '/assets/img/qrs/g8.jpg', title: 'PPC Advertising', content: 'Seo Design' },
    { img: '/assets/img/qrs/g2.png', title: 'PPC Advertising', content: 'Seo Design' },
    { img: '/assets/img/qrs/g1.jpg', title: 'PPC Advertising', content: 'Seo Design' },
    { img: '/assets/img/qrs/g4.jpg', title: 'PPC Advertising', content: 'Seo Design' },
    { img: '/assets/img/qrs/g5.jpg', title: 'PPC Advertising', content: 'Seo Design' },
    { img: '/assets/img/qrs/g9.jpg', title: 'PPC Advertising', content: 'Seo Design' },
    { img: '/assets/img/qrs/g6.jpg', title: 'PPC Advertising', content: 'Seo Design' }
  ];


  return (
    <section className="cs_tabs position-relative">
      <div className="cs_height_5 cs_height_lg_10"></div>
      <div className="container-fluid">
        <div className="cs_tab_body wow fadeInUp" data-wow-delay="200ms">
          <div className="cs_tab active px-2" id="all">
            <div className="row">
              {chooseContent.map((item, i) => (
                <div key={i} className="col-lg-4 g-2" aria-label="Click go to casestudy page">
                  <div className='cs_card cs_style_3 position-relative'>
                    <div className="cs_card_overlay position-absolute"></div>
                    <Image
                      src={item.img}
                      alt="Casestudy image"
                      width={400}       
                      height={300}
                      className="w-100" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
       
      </div>
      <div className="cs_height_40 cs_height_lg_40"></div>
    </section>
  );
};

export default Project2;