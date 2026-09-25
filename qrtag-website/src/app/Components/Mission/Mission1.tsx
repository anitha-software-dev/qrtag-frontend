import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Mission1 = () => {
    return (
        <section className="cs_about cs_style_1 position-relative overflow-hidden">
            <div className="cs_height_90 cs_height_lg_90"></div>
            <div className="text-center team-heading">
                <h2 className='cs_fs_60 text-white'>Our <span className='peach-text'>Vision</span></h2>
            </div>

            <div className="container">
                <div className="row pt-4">
                    <div className="col-lg-6 ">
                        <div className="cs_about_content">
                            <Image src="/assets/img/conviction.jpg" alt="img" width={600} height={600} />
                        </div>
                    </div>
                    <div className="col-lg-6 order-2" >
                        <div className='mission-content'>
                            <div className="cs_section_heading cs_style_1 cs_mb_28 pt-4 pt-md-5 mobile-heading">
                                <p className="cs_section_subtitle  cs_semibold cs_accent_color cs_mb_20 cs_fs_20 peach-text letter-spacing">
                                    HOW IT WORKS
                                </p>
                                <h2 className="cs_fs_60 cs_mb_21 wow fadeInDown">Our <span className='green-text'>Conviction</span> <br />is Firm:</h2>
                            </div>
                            <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-content">
                                <p className="cs_section_heading_text mb-0 mission-text">Safeguarding the treasures of our lives–from invaluable belongings to the intricate tapestry of human and pet connections–aligns seamlessly with championing a sustainable future. Through the state-of-the-art QR code technology we’ve harnessed, QRTag.it offers more than just a solution for recovery. We present a vision of conscientious living. </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cs_height_100 cs_height_lg_40"></div>

            <div className='mission-bg px-2 py-md-5 py-0 px-md-5 '>
                <div className="container py-5">
                    <div className="row cs_gap_y_40 cs_tab_reverse">

                        <div className="col-lg-6">
                            <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-heading">
                                <p className="cs_section_subtitle cs_semibold cs_accent_color cs_mb_20 cs_fs_20 peach-text letter-spacing">
                                    SUSTAINABILITY
                                </p>
                                <h2 className="cs_fs_60 cs_mb_21 wow fadeInDown">Consider the <br /><span className='green-text'> Stark Reality</span>:</h2>
                            </div>
                            <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-content">
                                <p className="cs_section_heading_text mb-0 mission-text">Billions are expended annually on replacing lost items. This staggering financial burden also underscores the environmental costs inherent in the processes of manufacturing, shipping, and disposal. QRTag.it stands at the forefront of transforming item tracking. Each tag meticulously records vital details–photographs, serial numbers, original receipts, and warranty specifics–providing a comprehensive approach to ownership and responsibility. By championing the recovery and prolonged use of possessions, we actively mitigate wasteful consumption and its detrimental environmental consequences.  </p>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="cs_about_content">
                                <Image src="/assets/img/stark.jpg" alt="img" width={600} height={600} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cs_height_120 cs_height_lg_80"></div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="cs_about_content">
                            <Image src="/assets/img/safety.jpg" alt="img" width={600} height={600} />
                        </div>
                    </div>
                    <div className="col-lg-6 p-3 p-md-1">
                        <div className='mission-content'>
                            <div className="cs_section_heading cs_style_1 cs_mb_28 pt-0 pt-lg-4 mobile-heading ">
                                <p className="cs_section_subtitle cs_fs_20 peach-text cs_semibold cs_accent_color cs_mb_20 letter-spacing">
                                    CONNECTION
                                </p>
                                <h2 className="cs_fs_60 cs_mb_21 wow fadeInDown">Linking Safety <br /> and<span className='green-text'> Connectivity</span></h2>
                            </div>
                            <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-content">
                                <p className="cs_section_heading_text mission-text mb-0">Our medical bracelets are emblematic of our unwavering commitment to health, safety, and societal care, serving as critical conduits linking first responders to next of kin. Our pet ID tags resonate deeply with the bonds we forge with the animal realm, ensuring no companion is left abandoned. The QR identifiers for homeowners, strategically positioned at residence thresholds, simultaneously bestow security and endorse community cohesion. </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cs_height_80 cs_height_lg_40"></div>

            <div className='mission-bg px-2 py-0 py-md-5 px-md-5'>
                <div className="container py-5">
                    <div className="row cs_gap_y_40 cs_tab_reverse">
                        <div className="col-lg-6">
                            <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-heading">
                                <p className="cs_section_subtitle cs_fs_20 peach-text cs_semibold cs_accent_color cs_mb_20 letter-spacing">
                                    INTEGRATION
                                </p>
                                <h2 className="cs_fs_60 cs_mb_21 wow fadeInDown">Tech with a  <br /><span className='green-text'>Human Touch </span>:</h2>
                            </div>
                            <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-content">
                                <p className="cs_section_heading_text mb-0 mission-text">At QRTag.it, our mission harmoniously intertwines technology with humanity. As we deftly navigate the multifaceted challenges of contemporary life, our horizon is clear: a world where each individual is not only interlinked but also ardently dedicated to a sustainable, resource-wise, and waste-minimal future.</p>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="cs_about_content">
                                <Image src="/assets/img/tech.jpg" alt="img" width={600} height={600} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="cs_height_80 cs_height_lg_40"></div> */}

            <div className='peach_bg text-center' id='mission'>
                <div className='container'>
                    <div className='mission-box'>
                        <div className='mobile-heading cs_mb_15'>
                            <h2 className="cs_fs_60 cs_mb_21 wow fadeInDown text-white">Our Mission</h2>
                        </div>
                        <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-content">
                            <p className=" cs_fs_20 text-white mission-box-text">At QRTag.it, our dedication to a sustainable future is the cornerstone of every innovation we pioneer. We recognize that each lost item represents not merely a personal loss, but a significant toll on both our environment and our economy. In an era marked by increasing waste and diminishing resources, the implications of replacing lost items stretch far beyond individual finances, impacting the very health of our planet.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Mission1;