"use client";
import React, { useEffect, useState } from "react";
import { ReactShareSocial } from "react-share-social";

const BlogDetails2 = ({ blog }: { blog: any }) => {
    const [headings, setHeadings] = useState<string[]>([]);
    const [shareUrl, setShareUrl] = useState<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setShareUrl(window.location.href);
        }

        if (blog?.description) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = blog.description;

            const h4Elements = tempDiv.querySelectorAll("h4");
            h4Elements.forEach((el, index) => {
                el.id = `section-${index}`;
            });

            blog.description = tempDiv.innerHTML;

            const titles = Array.from(h4Elements).map((el) => el.textContent || "");
            setHeadings(titles);
        }
    }, [blog]);

    return (
        <section>
            <div key={blog.id}>
                <div className="cs_height_90 cs_height_lg_90"></div>
                <div
                    className="blog_bg position-relative d-flex align-items-center"
                    style={{
                        backgroundImage: `url(${blog.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "top right",
                        backgroundRepeat: "no-repeat",
                        minHeight: "400px",
                        color: "#fff",
                    }}
                >
                    <div className="blog_bg_overlay"></div>
                    <div className="container position-relative z-2">
                        <div className="blog-heading py-md-5 py-0 mt-md-5 mt-0">
                            <span className="text-dark cs_fs_12 cs_white_bg cs_radius_15 px-3 py-1">
                                <i
                                    className="bi bi-clock me-2 cs_clock_bold"
                                    style={{
                                        color: "#ff4d2d",
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                    }}
                                ></i>
                                {blog.published_date
                                    ? new Date(blog.published_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })
                                    : "Unknown date"}
                            </span>

                            <p className="text-white cs_fs_30 cs_bold blog-title mb-0 mt-3">
                                {blog.title}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="cs_height_70 cs_height_lg_80"></div>

                <div className="container">
                    <div className="row cs_row_gap_30 cs_gap_y_60">
                        <aside className="col-xl-3 col-lg-3">
                            <div className="cs_sidebar cs_style_1 cs_type_1">
                                <div className="custom-accordion">
                                    <details className="accordion-item" open>
                                        <summary className="accordion-title d-flex justify-content-between align-items-center">
                                            <h3 className="text-white cs_fs_22 my-1">Topics</h3>
                                            <span className="icon">
                                                <svg
                                                    width="25"
                                                    height="25"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M6 9L12 15L18 9"
                                                        stroke="#fff"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </summary>

                                        <ul className="toc-list text-white mt-4">
                                            <li>
                                                <span >1. Share on</span>
                                                <ul >
                                                    {headings.length > 0 ? (
                                                        headings.map((heading, index) => (
                                                            <li key={index}>
                                                                <span>1.{index + 1}</span>{" "}
                                                                <a href={`#section-${index}`} className="toc-link">
                                                                    {heading}
                                                                </a>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>No topics found</li>
                                                    )}
                                                </ul>
                                            </li>
                                            <li>
                                                <span className="">2. Trusted by:</span>
                                                <ul className="toc-sublist">
                                                    <li>
                                                        <span>2.1</span>{" "}
                                                        <a href="#useful-links" className="toc-link">Useful Links</a>
                                                    </li>
                                                    <li>
                                                        <span>2.2</span>{" "}
                                                        <a href="#support" className="toc-link">Support</a>
                                                    </li>
                                                    <li>
                                                        <span>2.3</span>{" "}
                                                        <a href="#download" className="toc-link">Download</a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </details>
                                </div>
                            </div>

                            <div className="social-sidebar my-4 p-4">
                                <p className=" cs_fs_14 fw-semibold text-dark mb-3">
                                    Share on
                                </p>
                                <div className="d-flex align-items-center ">
                                    {/* <ReactShareSocial
                                        url={shareUrl}
                                        socialTypes={["facebook", "linkedin"]}
                                    /> */}
                                    <div className="ml-5">
                                        <a
                                            href={`https://facebook.com/?url=${encodeURIComponent(shareUrl)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-icon"
                                        >
                                            <i className="bi bi-facebook"></i>
                                        </a>
                                        <a
                                            href={`https://linkedin.com/?url=${encodeURIComponent(shareUrl)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-icon"
                                        >
                                            <i className="bi bi-linkedin"></i>
                                        </a>
                                        <a
                                            href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-icon"
                                        >
                                            <i className="bi bi-instagram"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </aside>

                        <div className="col-xl-9 col-lg-9 px-md-5 px-4">
                            <div className="cs_post_details">
                                <div
                                    className="blog-description"
                                    dangerouslySetInnerHTML={{ __html: blog.description }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cs_height_120 cs_height_lg_50"></div>
            </div>
        </section>
    );
};

export default BlogDetails2;
