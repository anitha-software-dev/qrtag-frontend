import rawConfig from "./config.json";

const Config = {
  NODE_ENV: process.env.NODE_ENV || rawConfig.NODE_ENV || "development",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || rawConfig.BASE_URL || "/api/v1",
  BACKEND_API_URL: process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || rawConfig.BACKEND_API_URL || "",
  BASE_URL1: process.env.NEXT_PUBLIC_BASE_URL1 || rawConfig.BASE_URL1 || "",
  APP_URL1: process.env.NEXT_PUBLIC_APP_URL1 || rawConfig.APP_URL1 || "",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || rawConfig.APP_URL || "",
  WEB_URL: process.env.NEXT_PUBLIC_WEB_URL || rawConfig.WEB_URL || "/",
  WEB_URL1: process.env.NEXT_PUBLIC_WEB_URL1 || rawConfig.WEB_URL1 || "",
};

export default Config;
