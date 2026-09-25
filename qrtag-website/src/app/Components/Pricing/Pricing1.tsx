"use client";

import React, { useEffect, useState } from "react";
import PricingCard from "../Card/PricingCard";
import { GetPricingPlans } from "../../services/apiServices";
import { BeatLoader } from "react-spinners";
import CenterMessage from "../Common/CenterMessage";

const Pricing1 = () => {
    const [isActive, setIsActive] = useState("monthly");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fadeClass, setFadeClass] = useState("fade-in");

    const getPricingPlans = () => {
        try {
            GetPricingPlans((response) => {
                if (response && Array.isArray(response.data)) {
                    setProducts(response.data);
                } else if (response && Array.isArray(response.data?.results)) {
                    setProducts(response.data.results);
                } else {
                    setProducts([]);
                }
                setLoading(false);
            });
        } catch (error) {
            console.error("Error fetching Stripe products:", error);
            setProducts([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        getPricingPlans();
    }, []);

    const monthlyPlans = Array.isArray(products)
        ? products.filter(
            (item: any) => item?.metadata?.duration?.toLowerCase() === "monthly"
        )
        : [];
    const yearlyPlans = Array.isArray(products)
        ? products.filter(
            (item: any) => item?.metadata?.duration?.toLowerCase() === "yearly"
        )
        : [];

    const getPlanStyle = (planName) => {
        const name = planName?.toLowerCase() || "";
        if (name.includes("premium")) return "plan-premium";
        if (name.includes("standard")) return "plan-standard";
        if (name.includes("free")) return "plan-free";
        return "";
    };

    const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1);

    const handleTabChange = (type) => {
        if (isActive === type) return;
        setFadeClass("fade-out");
        setTimeout(() => {
            setIsActive(type);
            setFadeClass("fade-in");
        }, 300);
    };

    return (
        <section className="cs_tabs blue-bg position-relative mt-md-5 pt-md-3 pt-0 mt-0 pb-5">
            <div className="cs_height_120 cs_height_lg_80"></div>
            <div className="container">
                <div className="cs_section_heading cs_style_1 text-center mobile-heading">
                    <h2 className="cs_fs_60 cs_mb_28 ">
                        Let’s get <span className="peach-text">started</span>
                    </h2>
                    <div className="mobile-content">
                        <p
                            className="cs_section_heading_text mb-0 mb-md-3 mb-4 cs_fs_20"
                            style={{ color: "#494D59CC" }}
                        >
                            Pick the perfect plan for you.
                        </p>
                    </div>
                </div>

                <div
                    className="cs_tab_links_wrapper mb-5 pb-lg-2 pb-0 cs_center position-relative wow fadeInUp"
                    data-wow-delay="200ms"
                >
                    <ul className="cs_tab_links cs_fs_14 cs_style_1 cs_type_1 cs_mp_0">
                        <li
                            className={`${isActive === "yearly" ? "active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleTabChange("yearly");
                            }}
                        >
                            <a href="" aria-label="Tab button">
                                Bill Yearly
                            </a>
                        </li>
                        <li
                            className={`${isActive === "monthly" ? "active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleTabChange("monthly");
                            }}
                        >
                            <a href="" aria-label="Tab button">
                                Bill Monthly
                            </a>
                        </li>
                    </ul>
                </div>

                {loading ? (
                    <CenterMessage>
                        <BeatLoader />
                        <span className="mt-3 mt-sm-0 fw-semibold">Loading pricing...</span>
                    </CenterMessage>
                ) : (
                    <div className={`cs_tab_body position-relative z-1 ${fadeClass}`} key={isActive}>

                        {isActive === "monthly" && (
                            <div className="row cs_row_gap_30 cs_gap_y_30">
                                {monthlyPlans.length > 0 ? (
                                    <>
                                        <div
                                            className="col-lg-4 wow fadeInDown"
                                            data-wow-delay={`${monthlyPlans.length * 200}ms`}
                                        >
                                            <PricingCard
                                                addclass="cs_pricing_table cs_style_1 cs_white_bg cs_radius_20 plan-free"
                                                name="Free"
                                                content="Get started with the Free plan"
                                                price="$0.00"
                                                duration="/Month"
                                                featurelist={["1 Digital Tag For 30 days"]}
                                                btnname="Get Started"
                                                btnurl="https://app.qrtag.it/"
                                            />
                                        </div>

                                        {monthlyPlans
                                            .slice()
                                            .reverse()
                                            .map((item, index) => {
                                                const planName = item.name
                                                    ?.replace(/monthly/i, "")
                                                    ?.replace(/yearly/i, "")
                                                    ?.trim();
                                                const planStyle = getPlanStyle(planName);

                                                return (
                                                    <div
                                                        className="col-lg-4 wow fadeInDown"
                                                        key={item.id}
                                                        data-wow-delay={`${index * 200}ms`}
                                                    >
                                                        <PricingCard
                                                            addclass={`cs_pricing_table cs_style_1 cs_white_bg cs_radius_20 ${planStyle}`}
                                                            name={capitalize(planName)}
                                                            content={`Get started with the ${planName} plan`}
                                                            price={`$${(
                                                                item.prices?.[0]?.unit_amount / 100
                                                            ).toFixed(2)}`}
                                                            duration="/Month"
                                                            featurelist={[`${item.metadata?.content || ""}`]}
                                                            btnname="Get Started"
                                                            btnurl="https://app.qrtag.it/"
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </>
                                ) : (
                                    <p className="text-center">No monthly plans available.</p>
                                )}
                            </div>
                        )}

                        {isActive === "yearly" && (
                            <div className="row cs_row_gap_30 cs_gap_y_30">
                                {yearlyPlans.length > 0 ? (
                                    <>
                                        <div
                                            className="col-lg-4 wow fadeInDown"
                                            data-wow-delay="0ms"
                                        >
                                            <PricingCard
                                                addclass="cs_pricing_table cs_style_1 cs_white_bg cs_radius_20 plan-free"
                                                name="Free"
                                                content="Get started with the Free plan"
                                                price="$0.00"
                                                duration="/Year"
                                                featurelist={["1 Digital Tag For 30 days"]}
                                                btnname="Get Started"
                                                btnurl="https://app.qrtag.it/"
                                            />
                                        </div>

                                        {yearlyPlans
                                            .slice()
                                            .reverse()
                                            .map((item, index) => {
                                                const planName = item.name
                                                    ?.replace(/monthly/i, "")
                                                    ?.replace(/yearly/i, "")
                                                    ?.trim();
                                                const planStyle = getPlanStyle(planName);

                                                return (
                                                    <div
                                                        className="col-lg-4 wow fadeInDown"
                                                        key={item.id}
                                                        data-wow-delay={`${(index + 1) * 200}ms`}
                                                    >
                                                        <PricingCard
                                                            addclass={`cs_pricing_table cs_style_1 cs_white_bg cs_radius_20 ${planStyle}`}
                                                            name={capitalize(planName)}
                                                            content={`Get started with the ${planName} plan`}
                                                            price={`$${(
                                                                item.prices?.[0]?.unit_amount / 100
                                                            ).toFixed(2)}`}
                                                            duration="/Year"
                                                            featurelist={[`${item.metadata?.content || ""}`]}
                                                            btnname="Get Started"
                                                            btnurl="https://app.qrtag.it/"
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </>
                                ) : (
                                    <p className="text-center">No yearly plans available.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="cs_height_120 cs_height_lg_30"></div>
        </section>
    );
};

export default Pricing1;
