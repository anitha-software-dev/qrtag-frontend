"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import BlogDetails2 from "../../../Components/BlogDetails/BlogDetails2";
import { GetBlogDetails } from "../../../services/apiServices";
import { BeatLoader } from "react-spinners";
import CenterMessage from "../../../Components/Common/CenterMessage";
import Link from "next/link";

function BlogDetailsContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug");
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        GetBlogDetails(slug, (response) => {
            setBlog(response?.data || null);
            setLoading(false);
        });
    }, [slug]);

    if (!slug) return (
        <CenterMessage>
            <div className="cs_about cs_style_1 position-relative overflow-hidden p-3 p-md-0">
                <div className="cs_section_heading cs_style_1 cs_mb_28 mobile-content text-center">
                    <h5 className="cs_footer_widget_title cs_fs_22 cs_semibold mb-2 position-relative text-uppercase">We couldn’t find the article!</h5>
                    <p className="cs_fs_16" style={{ color:"#7a7a7a"}}>The link you followed might be broken or the post may have been removed. Please check the URL or browse other articles.</p>
                </div>
                <div className="cs_about_btn_group justify-content-center">
                    <Link href="/blog" className="cs_btn cs_style_1 cs_fs_16 cs_bold text-Capitalize wow fadeInLeft"><span>Back to Blogs</span></Link>
                </div>
            </div>
        </CenterMessage>
    );
    if (loading) return (
       <CenterMessage>
           <BeatLoader />
           <span className="fw-semibold mt-3">Loading blog details...</span>
       </CenterMessage>
    );
    if (!blog) return (
      <CenterMessage>
          <p className="text-center py-5">No blog found.</p>
      </CenterMessage>
    );

    return <BlogDetails2 blog={blog} />;
}

export default function BlogDetailsPage() {
    return (
        <Suspense fallback={
            <CenterMessage>
                <BeatLoader />
                <span className="fw-semibold mt-3">Loading blog details...</span>
            </CenterMessage>
        }>
            <BlogDetailsContent />
        </Suspense>
    );
}
