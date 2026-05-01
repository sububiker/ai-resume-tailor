/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // In K8s: BACKEND_URL=http://ai-resume-backend-svc:8000 (baked in at build)
    // In local dev: falls back to localhost:8000
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
