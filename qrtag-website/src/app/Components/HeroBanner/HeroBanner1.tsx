"use client"
import React, { useRef } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroBanner1 = () => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    autoplay: false,
    autoplaySpeed: 4000
  };

  const sliderRef = useRef(null);

  const testimonialContent = [
    {
      img: '/assets/img/banner/banner01.jpg', subtitle: 'Get it Back!', title: 'Tag it, Scan it,', content: <>
        <div className='d-md-block d-none'>
          Never lose a thing again with QRTag.it! Tag, track, and get your <br /> stuff back effortlessly.
        </div>
        <div className='d-md-none d-block'>
          Never lose a thing again with QRTag.it! Tag, track, and get your stuff back effortlessly
        </div>
      </>
    },
    {
      img: '/assets/img/banner/banner02.jpg', subtitle: 'have it back.', title: 'Tag, scan, and',
      content:
        <>
          <div className='d-md-block d-none'>Say goodbye to lost items with QRTag.it! Tag, track, and <br /> retrieve with ease.
          </div>
          <div className='d-md-none d-block'>
            Say goodbye to lost items with QRTag.it! Tag, track, and retrieve with ease.
          </div>
        </>
    },
    {
      img: '/assets/img/banner/banner03.jpg', subtitle: 'bring it back.', title: 'Tag, scan, and we’ll', content:
        <>
          <div className='d-md-block d-none'>Never misplace anything again with QRTag.it! Simply tag, track,<br /> and get it back fast.
          </div>
          <div className='d-md-none d-block'>
            Never misplace anything again with QRTag.it! Simply tag, track, and get it back fast.
          </div>
        </>
    },
    {
      img: '/assets/img/banner/banner04.jpg', subtitle: 'got your back.', title: 'Scan the tag, we’ve', content:
        <>
          <div className='d-md-block d-none'>Never misplace anything again with QRTag.it! Simply tag, track,<br /> and get it back fast.
          </div>
          <div className='d-md-none d-block'>
            Never misplace anything again with QRTag.it! Simply tag, track, and get it back fast.
          </div>
        </>
    },
    {
      img: '/assets/img/banner/banner05.jpg', subtitle: 'bring it back.', title: 'Tag, scan, and we’ll', content:
        <>
          <div className='d-md-block d-none'>Never misplace anything again with QRTag.it! Simply tag, track,<br /> and get it back fast.
          </div>
          <div className='d-md-none d-block'>
            Never misplace anything again with QRTag.it! Simply tag, track, and get it back fast.
          </div>
        </>
    },
    {
      img: '/assets/img/banner/banner06.jpg', subtitle: 'handle the rest.', title: 'Just tag and scan we’ll', content:
        <>
          <div className='d-md-block d-none'>Never misplace anything again with QRTag.it! Simply tag, track,<br /> and get it back fast.
          </div>
          <div className='d-md-none d-block'>
            Never misplace anything again with QRTag.it! Simply tag, track, and get it back fast.
          </div>
        </>
    },
    {
      img: '/assets/img/banner/banner07.jpg', subtitle: 'a tag and a scan.', title: 'Secure your items with', content:
        <>
          <div className='d-md-block d-none'>Never misplace anything again with QRTag.it! Simply tag, track,<br /> and get it back fast.
          </div>
          <div className='d-md-none d-block'>
            Never misplace anything again with QRTag.it! Simply tag, track, and get it back fast.
          </div>
        </>
    },
    {
      img: '/assets/img/banner/banner08.jpg', subtitle: 'we’ll return it to you.', title: 'One scan is all it takes', content:
        <>
          <div className='d-md-block d-none'>Never misplace anything again with QRTag.it! Simply tag, track,<br /> and get it back fast.
          </div>
          <div className='d-md-none d-block'>
            Never misplace anything again with QRTag.it! Simply tag, track, and get it back fast.
          </div>
        </>
    },
    {
      img: '/assets/img/banner/banner09.jpg', subtitle: 'bring it back.', title: 'Tag, scan, and we’ll', content:
        <>
          <div className='d-md-block d-none'>Never misplace anything again with QRTag.it! Simply tag, track,<br /> and get it back fast.
          </div>
          <div className='d-md-none d-block'>
            Never misplace anything again with QRTag.it! Simply tag, track, and get it back fast.
          </div>
        </>
    },
    {
      img: '/assets/img/banner/banner10.jpg', subtitle: 'bring it back.', title: 'Tag, scan, and we’ll', content:
        <>
          <div className='d-md-block d-none'>Never misplace anything again with QRTag.it! Simply tag, track,<br /> and get it back fast.
          </div>
          <div className='d-md-none d-block'>
            Never misplace anything again with QRTag.it! Simply tag, track, and get it back fast.
          </div>
        </>
    }
  ];

  return (
    <section className="cs_hero cs_slider cs_style_1 cs_bg_filled cs_slider_gap_30 position-relative pb-0" style={{ paddingTop: "90px" }}>
      <div>
        <div className="cs_hero_content px-0">
          <div className="cs_hero_text position-relative">
            <Slider ref={sliderRef} {...settings}>
              {testimonialContent.map((item, i) => (
                <div key={i} className='position-relative cs_slide_wrapper'>
                  <div className="half-blue-overlay"></div>
                  <div
                    className="cs_hero_text_inner position-absolute z-2"
                    style={{
                      minHeight: 650,
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      paddingLeft: '6vw',
                      paddingRight: '6vw',
                      pointerEvents: 'none',
                    }}
                  >
                    <div className='container position-relative banner-text'>
                      <h1 className="cs_white_color cs_extra_bold cs_mb_28 wow fadeInUp mb-4" >
                        {item?.title}
                        <br />
                        <span style={{ color: '#ff4d2d' }}>{item?.subtitle}</span>
                      </h1>
                      <div className="cs_white_color cs_mb_46 cs_fs_20 wow fadeInUp mobile-content">
                        {item?.content}
                      </div>
                    </div>
                  </div>
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={1600}
                    height={800}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

      </div>

    </section>
  );
};

export default HeroBanner1;