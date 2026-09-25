import Image from 'next/image';
import React from 'react';

const Team4 = () => {

    const teamContent = [
        { name: 'Rick', content: 'Rick, the technological visionary behind QRTag.it, brings over two decades of global, cross-industry expertise in platform design, scalable architecture, and intuitive system development. His deep technical acumen has been instrumental in crafting QRTag.it’s robust unified technical architecture—designed to be highly scalable, secure, and monetizable. This architecture not only ensures seamless customer experiences but also supports both retail and enterprise markets, setting a benchmark in innovation and operational excellence.' },
        { name: 'Susan', content: 'Susan brings a unique combination of marketing expertise, background in legal documentation and contracts, and a customer-centric approach to QRTag.it customer service. Her qualifications in business process improvement, organizational behavior, and contract management, coupled with her deep understanding of user needs, enable her to craft solutions that resonate with customers. ' },
        { name: 'Manoj', content: 'With a strategic mindset and entrepreneurial drive, Manoj spearheads QRTag.it’s sales, business development, and monetization strategies. His ability to identify opportunities and craft innovative growth models has been pivotal to the platform’s success. Manoj’s knack for transforming challenges into opportunities ensures that QRTag.it remains a step ahead in delivering exceptional value to its users, making it a preferred choice for secure and reliable QR tag solutions worldwide.' },
    ];

    return (
        <section className="cs_about cs_style_1 cs_type_1 position-relative">

            <div className="cs_height_90 cs_height_lg_90"></div>

            <div className="text-center team-heading ">
                <h2 className='cs_fs_60 text-white'>Meet Our <span className='peach-text'>Team</span></h2>
            </div>

            <div className="container">
                <div className="row g-0 pb-md-5 pb-0 pt-4">
                    <div className="col-lg-5 wow fadeInLeft ">
                        <div className="">
                            <Image src="/assets/img/dave.jpg" alt="img" width={600} height={600} className="w-100 h-100 object-fit-cover"/>
                        </div>
                    </div>
                    <div className="col-lg-7 download_content pt-lg-5 pt-0">
                        <div className=" pt-lg-5 pt-0">
                            <div className='team_bg team_border'>
                                <div className="cs_section_heading cs_style_1 mobile-heading">
                                    <h2 className="cs_fs_80 cs_mb_21 wow fadeInUp peach-text"> Dave</h2>
                                </div>
                                <div className="mobile-content">
                                    <p className="cs_fs_16 mb-0 team-content">Dave, a retired Army Major and Japanese linguist, brings over two decades of expertise in psychology, nursing, and encryption to QRTag.it. His passion for codes and secure communication inspired the creation of this groundbreaking platform. Dave’s vision is to empower users to safeguard their valuables and personal information while contributing to sustainability efforts. A leader with a global perspective, he combines military precision with innovative thinking to make QRTag.it a trusted solution for modern challenges. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='blue-bg mt-5'>
                <div className="cs_height_120 cs_height_lg_60"></div>
                <div className='container'>
                    <div className="row cs_row_gap_30 cs_gap_y_30 position-relative z-1">
                        {teamContent.map((item, i) => (
                            <div key={i} className="col-lg-4 col-sm-6 wow fadeInDown">
                                <div className="cs_team cs_style_1 position-relative">
                                    <div className="text-left mobile-content">
                                        <h3 className="cs_fs_50 cs_extra_bold blue-text text-capitalize mb-3"> {item.name}</h3>
                                        <p className="mb-0 team_info">{item.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
                <div className="cs_height_90 cs_height_lg_60"></div>
            </div>
        </section>
    );
};

export default Team4;