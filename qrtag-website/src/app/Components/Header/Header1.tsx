"use client"
import { useEffect, useState } from 'react';
import Nav from './Nav';
import Link from 'next/link';
import Image from 'next/image';
export default function Header1({ variant }: any) {
  const [mobileToggle, setMobileToggle] = useState(false);
  const [isSticky, setIsSticky] = useState<string>("");
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > prevScrollPos) {
        setIsSticky('cs-gescout_sticky'); 
      } else if (currentScrollPos !== 0) {
        setIsSticky('cs-gescout_show cs-gescout_sticky'); 
      } else {
        setIsSticky('');
      }
      setPrevScrollPos(currentScrollPos); 
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); 
    };
  }, [prevScrollPos]);

  return (
    <div>
      <header
        className={`cs_site_header header_style_2 header_style_2_0 cs_style_1 header_sticky_style1 ${variant ? variant : ''
          } cs_sticky_header cs_site_header_full_width ${mobileToggle ? 'cs_mobile_toggle_active' : ''
          } ${isSticky ? isSticky : ''}`}
      >
        <div className="cs_main_header">
          <div className="container">
            <div className="cs_main_header_in">
              <div className="cs_main_header_left ">
                <Link className="cs_site_branding logo-img" href="/">
                  <Image src="/assets/img/logo.png" alt="img" width={156} height={158}  />
                </Link>
              </div>
              <div className="cs_main_header_center">
                <div className="cs_nav cs_primary_font fw-medium">
                  <span
                    className={
                      mobileToggle
                        ? 'cs-munu_toggle cs_teggle_active'
                        : 'cs-munu_toggle'
                    }
                    onClick={() => setMobileToggle(!mobileToggle)}
                  >
                    <span></span>
                  </span>
                  <Nav setMobileToggle={setMobileToggle} />
                </div>
              </div>
              <div className="cs_main_header_right">
                <div className="header-btn d-flex align-items-center">
                  <div className="main-button">
                    <Link href="https://app.qrtag.it/" className='cs_btn cs_style_1 cs_fs_14 signin_btn '>
                      <span> Sign in </span></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

    </div>

  );
}
