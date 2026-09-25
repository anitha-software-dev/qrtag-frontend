'use client';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { GetAllBlogs } from "../../services/apiServices"
import { BeatLoader } from 'react-spinners'
import CenterMessage from '../Common/CenterMessage';

const Blog3 = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBlogList = () => {
    try {
      GetAllBlogs((response) => {
        if (response && Array.isArray(response.data)) {
          setBlogs(response.data);
        } else if (response && Array.isArray(response.data?.results)) {
          setBlogs(response.data.results);
        } else {
          setBlogs([]);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching blog list:", error);
      setBlogs([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    getBlogList()
  }, [])

  return (
    <section className="pb-3 position-relative">
      <div className="cs_height_50 cs_height_lg_10"></div>

      <div className="text-center mobile-heading">
        <h3 className='blue-text-style cs_fs_20'>BLOGS</h3>
        <h2 className='cs_fs_60 pb-3'>Smart Tips <span className='peach-text'>& Stories</span></h2>
      </div>

      <div className="container">
        {loading ? (
          <CenterMessage>
            <BeatLoader />
            <span className="mt-3 mt-sm-0 fw-semibold">Loading blogs...</span>
          </CenterMessage>
        ) : !blogs || blogs.length === 0 ? (
          <CenterMessage>
            <p className="text-center py-5">No blogs found.</p>
          </CenterMessage>
        ) : (
          <div className="row cs_row_gap_30 cs_gap_y_30 position-relative z-1">
            {(blogs || []).map((item: any, i: number) => (
              <div key={i} className="col-lg-4 col-md-6 col-sm-12 wow fadeInLeft">
                <article className="cs_post cs_style_1 cs_type_1 h-100">
                  <Link
                    href={`/blog/blog-details?slug=${item.slug}`}
                    aria-label="Click to read post"
                    className="cs_post_thumbnail blog-image position-relative d-block"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={362}
                      height={198}
                      className="img-fluid w-100 rounded"
                    />

                    <span className="cs_posted_by cs_white_bg cs_white_color cs_radius_15 text-center position-absolute gap-2 d-flex align-items-center justify-content-center">
                      <i
                        className="bi bi-clock cs_clock_bold"
                        style={{
                          color: '#ff4d2d',
                          fontSize: '15px',
                          fontWeight: 'bold',
                        }}
                      ></i>
                      <p className="mb-0 text-dark cs_fs_12">
                        {item.published_date
                          ? new Date(item.published_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                          : 'Unknown date'}
                      </p>
                    </span>
                  </Link>

                  <div className="cs_post_content cs_white_bg pt-3">
                    <h3 className="cs_post_title cs_fs_22 cs_mb_11">
                      <Link
                        href={`/blog/blog-details?slug=${item.slug}`}
                        aria-label="Click to read post"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <div
                      className="cs_post_meta cs_fs_14 text-secondary"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: item.description
                          ? item.description
                            .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '')
                            .replace(/<ul[^>]*>.*?<\/ul>/gi, '')
                            .trim()
                          : '<p>Read more...</p>',
                      }}
                    ></div>

                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cs_height_120 cs_height_lg_80"></div>
    </section>
  );
};

export default Blog3;
