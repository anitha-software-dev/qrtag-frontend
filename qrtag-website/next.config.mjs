/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // output: "export",
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    // Handle dynamic routes for static export
    generateBuildId: async () => {
        return 'build-' + Date.now()
    }
};

export default nextConfig;
