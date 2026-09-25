"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer2 = () => {

  return (
    <footer className="cs_footer  cs_style_1 cs_type_1 ">
      <div className="cs_height_50 cs_height_lg_50"></div>
      <div className="footer-content">

        <div className="cs_main_footer text-center text-center text-lg-start">
          <div className="cs_footer_row">

            <div className="cs_footer_widget cs_footer_text">
              <div className="cs_text_widget">
                <Image src="/assets/img/logo.png" className="cs_mb_20 wow zoomIn" alt="img" width={130} height={130} />
                <p className="mb-0 footer-logo-text">QRTag.it LLC P.O. Box 540235</p>
                <p className="cs_mb_30 footer-logo-text">North Salt Lake Utah 84054</p>
              </div>
            </div>

            <div className="cs_footer_links_wrapper">
              <div className="cs_footer_widget">
                <h2 className="cs_footer_widget_title cs_fs_22 cs_semibold mb-2 position-relative text-uppercase" id="useful-links">Useful Links</h2>
                <ul className="cs_footer_menu cs_mp_0">
                  <li><Link href="/" aria-label="Page link">Home</Link></li>
                  <li><Link href="/#about" aria-label="Page link">About Us</Link></li>
                  <li><Link href="/#features" aria-label="Page link">Features</Link></li>
                  <li><Link href="/our-vision/#mission" aria-label="Page link">Mission</Link></li>
                  <li><Link href="/#faqs" aria-label="Page link">FAQs</Link></li>
                </ul>
              </div>
              <div className="cs_footer_widget footer-middle">
                <h2 className="cs_footer_widget_title cs_fs_22 mb-2 cs_semibold position-relative text-uppercase" id="support">Support</h2>
                <ul className="cs_footer_menu cs_mp_0">
                  <li><Link href="/#contact" aria-label="Page link">Contact</Link></li>
                  <li><Link href="/privacy-policy" aria-label="Page link">Privacy Policy</Link></li>
                  <li><Link href="/terms-and-conditions" aria-label="Page link">Terms of use</Link></li>
                  <li><Link href="/return-policy" aria-label="Page link">Return Policy</Link></li>
                </ul>
              </div>
              <div className="cs_footer_widget text-center text-lg-start footer-last" >
                <h2 className="cs_footer_widget_title mb-2 cs_fs_22 cs_semibold position-relative text-uppercase" id="download">
                  Download
                </h2>
                <div>
                  <ul className="cs_footer_menu cs_mp_0">
                    <li>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.withered_feather_36062&pli=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Click to visit Google Play Store"
                      >
                        Google Play Store
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://apps.apple.com/us/app/qrtag-it/id6444082603"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Click to visit Apple App Store"
                      >
                        Apple Store
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cs_footer_bottom text-center text-lg-start border-top">
        <div className=" footer-content copyright-text">
          <span className=''>&copy;Copyright  2025 QRTag.it All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer2;