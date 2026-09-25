import axios from "axios";
import Config from "./config"; 

const getBaseUrl = () => {
    if (typeof window === "undefined") {
        return Config.BACKEND_API_URL || "";
    }
    return Config.BASE_URL || "/api/v1";
};

const Axios = axios.create({
    baseURL: getBaseUrl(), 
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default Axios;
