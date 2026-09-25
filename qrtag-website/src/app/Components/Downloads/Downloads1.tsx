import Image from 'next/image';
import React from 'react';

const Downloads1 = () => {
    return (
        <section className="cs_about cs_style_1 cs_type_1 ">
            <div className="cs_height_120 cs_height_lg_10"></div>
            <div className="container">
                <div className="row downloads_bg m-auto m-md-0">
                    <div className="col-lg-5 wow fadeInLeft mobile_image">
                        <div className="">
                            <Image src="/assets/img/mobile.png" alt="img" width={340} height={290} />
                        </div>
                    </div>
                    <div className="col-lg-7 download-content text-center text-lg-start">
                        <div className="cs_about_content">
                            <div className="cs_section_heading mobile-heading cs_style_1 ">
                                <h2 className="cs_fs_60 cs_mb_21 black-text download-title">Download the <br /> App now!</h2>
                            </div>
                            <div className="mobile-content">
                                <p className="cs_fs_18 mb-0 download-para black-text d-md-block d-none">Unlock limitless possibilities! Download our app today for <br /> exclusive access and unbeatable convenience. </p>
                                <p className="cs_fs_18 mb-0 download-para black-text d-block d-md-none">Unlock limitless possibilities! Download our app today for exclusive access and unbeatable convenience. </p>
                            </div>
                            <div className="cs_download_btn_group">
                                <div>
                                    <a
                                        href="https://play.google.com/store/apps/details?id=com.withered_feather_36062&pli=1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Image
                                            src="/assets/img/g-play.png"
                                            alt="Google Play Store"
                                            width={150}
                                            height={150}
                                        />
                                    </a>
                                </div>

                                <div className="cs_client_info_wrapper wow fadeInRight">
                                    <a
                                        href="https://apps.apple.com/us/app/qrtag-it/id6444082603"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Image
                                            src="/assets/img/app-store.png"
                                            alt="Apple App Store"
                                            width={150}
                                            height={150}
                                        />
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="cs_height_120 cs_height_lg_80"></div>
        </section>
    );
};

export default Downloads1;