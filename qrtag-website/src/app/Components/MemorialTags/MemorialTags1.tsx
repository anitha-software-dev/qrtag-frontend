import Image from 'next/image';
import React from 'react';

const MemorialTags1 = () => {
    return (
        <section className="">
            <div className="cs_height_150 cs_height_lg_80"></div>
            <div className="container">
                <div className="row ">
                    <div className="cs_height_70 cs_height_lg_20"></div>
                    <div className="col-lg-12 d-flex align-items-center text-center text-lg-start justify-content-center justify-content-lg-start flex-column flex-lg-row">
                        <div className="col-lg-10 mt-5 mt-lg-0 ">
                            <div className="cs_section_heading_left  mobile-heading ">
                                <h2 className="cs_fs_45 wow fadeInUp"> QRTag.it Smart Restaurant Solution</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 ">
                        <div className="cs_section_heading cs_style_1 cs_type_1 align-items-center">
                            <div className="col-lg-9">
                                <div className="">
                                    <Image src="/assets/img/tag-banner.png" alt="img" width={800} height={1300} />
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="cs_section_heading_left mobile-heading ">
                                    <h2 className="cs_fs_32 blue-text mb-0 wow fadeInUp">  Contactless to </h2>
                                    <h2 className="cs_fs_32 blue-text mb-0 wow fadeInUp">  Countless</h2>
                                    <h2 className="cs_fs_32 blue-text mb-0 wow fadeInUp">
                                        Possibilities
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className=" cs_center tag-content mt-5 d-flex flex-column flex-lg-row justify-content-center align-items-center">
                            <Image src="/assets/img/roadmap.png" alt="img" width={380} height={1300} />
                            < div className=''>
                                <div className='pb-3 py-lg-0 pt-3 pt-lg-0 '>
                                    <h3 className="cs_fs_20 cs_mb_4 mt-2">Enhanced Guest Experience & Hygiene</h3>
                                    <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mobile-content'>
                                        <p className="cs_fs_16 cs_light mb-0">Eliminates shared menus, reduces germ
                                            risks, and ensures cleaner, safer dining
                                            with digital access.
                                        </p>
                                        <h2 className="cs_fs_60 mb-0 wow fadeInUp gray-text"> 01</h2>
                                    </div>
                                </div>
                                <div className='pb-3 py-lg-0'>
                                    <h3 className="cs_fs_20 cs_mb_4 mt-2">Real-Time Updates & Upsells</h3>
                                    <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mobile-content'>
                                        <p className="cs_fs_16 cs_light mb-0">Instantly update specials, promote offers, engage guests to drive loyalty and increase check size.
                                        </p>
                                        <h2 className="cs_fs_60 mb-0 wow fadeInUp gray-text"> 02</h2>
                                    </div>
                                </div>
                                <div className='pb-3 py-lg-0'>
                                    <h3 className="cs_fs_20 cs_mb_4 mt-2">Smarter Operations</h3>
                                    <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mobile-content'>
                                        <p className="cs_fs_16 cs_light mb-0">Integrates front and kitchen operations,prevents ticket loss, and cuts training errors.
                                        </p>
                                        <h2 className="cs_fs_60 mb-0 wow fadeInUp gray-text"> 03</h2>
                                    </div>
                                </div>
                                <div className='pb-3 py-lg-0'>
                                    <h3 className="cs_fs_20 cs_mb_4 mt-2">Reduced Waste & Better Insights</h3>
                                    <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mobile-content'>
                                        <p className="cs_fs_16 cs_light mb-0">Tracks inventory with AI to cut spoilage,and delivers real-time data to optimize performance.
                                        </p>
                                        <h2 className="cs_fs_60 mb-0 wow fadeInUp gray-text"> 04</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="cs_height_60 cs_height_lg_80"></div>

                        <div className="cs_working_thumbnail_wrapper cs_center d-flex align-items-center text-center text-lg-start justify-content-center justify-content-lg-start flex-column flex-lg-row mobile-content ">
                            <Image src="/assets/img/dave.jpg" alt="img" width={140} height={130} />

                            <p className="cs_fs_16 cs_light mb-0 ">I’m Dave, a retired Army Major, and I created QRTag.it as an
                                innovative platform to enrich customer experiences, enable
                                secure communication, simplify lost-and-found, and give
                                instant access to critical information—anytime, anywhere.
                            </p>
                            <div className='mobile-qrtag pt-3 pt-lg-0'>
                                <p className='mb-1 dark-blue-text text-center'>Scan & Connect</p>
                                <Image src="/assets/img/tag-qr.png" alt="img "  className='mb-3 ' width={400} height={400} />
                            </div>
                        </div>

                        <div className="cs_height_40 cs_height_lg_50"></div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default MemorialTags1;