import Axios from "../config/axios"

export const GetAllBlogs = async (callback = ({ success, data }) => { }) => {
    try {
        const response = await Axios.get("/blogs/");
        callback({ success: true, data: response?.data });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        callback({ success: false, data: null });
    }
};

export const GetBlogDetails = async (slug, callback = ({ success, data }) => { }) => {
    try {
        const response = await Axios.get(`/blogs/${slug}/`);
        callback({ success: true, data: response?.data });
    } catch (error) {
        console.error("Error fetching blog details by slug:", error);
        callback({ success: false, data: null });
    }
};

export const submitContact = async (payload, callback = ({ success, data }) => { }) => {
    try {
        const response = await Axios.post("/contact-us/", payload);
        callback({ success: true, data: response.data });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        callback({ success: false, data: null });
    }
};

export const GetPricingPlans = async (callback = ({ success, data }) => { }) => {
    try {
        const response = await Axios.get("/payment/stripe-products/");
        callback({ success: true, data: response?.data });
    } catch (error) {
        console.error("Error fetching Stripe products:", error);
        callback({ success: false, data: null });
    }
};