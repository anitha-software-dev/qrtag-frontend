import Image from 'next/image';
import React from 'react';

const ReturnPolicy1 = () => {

    return (
        <section className="cs_about cs_style_1 cs_type_1 position-relative">

            <div className="cs_height_90 cs_height_lg_90"></div>

            <div className="text-center team-heading ">
                <h2 className='cs_fs_60 text-white'>Return <span className='peach-text'>Policy</span></h2>
            </div>

            <div className="container">
                <div className="row cs_gap_y_30 ">

                    <div className="col-lg-12">
                        <div className="cs_team_content ">
                            <div className="cs_section_heading cs_style_1 mobile-heading ">
                                <h2 className="cs_fs_60 cs_mb_21 wow fadeInUp"> QRTag.it <span className='green-text'>Return Policy</span></h2>
                                <div className='mobile-content'>
                                    <p><strong>_____________</strong> EFFECTIVE DATE: January 25th, 2025 </p>
                                </div>
                            </div>
                            <div className="mobile-content">
                                <h2 className='dark-blue-text pt-4 cs_fs_30'>
                                    Subscriptions:
                                </h2>
                                <p className="cs_fs_16">To request a refund for your subscription, you must contact our customer support within 14 days of your initial purchase date. A full refund will be issued for cancellations made within the trial period, if applicable. After the trial period, you will be charged for the current billing cycle and can cancel your subscription to prevent future charges, but no prorated refunds will be provided for the current billing period. For any questions regarding your subscription, please contact us at{" "}
                                    <a href="mailto:support@QRTag.it" target='_blank' style={{ color: '#c36' }}>
                                        support@QRTag.it
                                    </a>.
                                </p>

                                <h2 className='dark-blue-text pt-4 cs_fs_30'>
                                    Products:
                                </h2>
                                <p className="cs_fs_16 mb-0">
                                    If you are not satisfied with your purchase from QRTag.it for any reason, you can return the product within 30 days of purchase. We will provide you with a return shipping label upon your return request. You can choose to exchange the product, return it for store credit, or get a refund to your original payment method.
                                </p>
                                <br />
                                <p className="cs_fs_16 mb-0">
                                    Please note that returned products must be unused, in the original packaging, and with the original tags still attached. Discounted items from a final sale cannot be returned for a refund nor exchanged.
                                </p>
                                <br />
                                <p className="cs_fs_16">
                                    To return a purchased item, follow the steps below:
                                </p>
                                <p className="cs_fs_16">
                                    1. Email us with your order number and state which items you would like to return. We will provide you with a free shipping label.
                                </p>
                                <p className="cs_fs_16">
                                    2. Make sure the items you’re returning do not have any visible signs of use and have the original tags on.
                                </p>
                                <p className="cs_fs_16">
                                    3. Package the products into their original packaging.
                                </p>
                                <p className="cs_fs_16">
                                    4. Put the products into shipment packaging and stick the provided return shipping label on it.
                                </p>
                                <p className="cs_fs_16">
                                    5. Bring your package to the post office or order a free pick-up from your location.
                                </p>
                                <p className="cs_fs_16">
                                    We will need 14 days to process your return and assess it for eligibility. After it has been accepted, we will send you an email and your refund should be in your account within 7 to 14 days depending on your bank.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cs_height_110 cs_height_lg_10"></div>
        </section>
    );
};

export default ReturnPolicy1;