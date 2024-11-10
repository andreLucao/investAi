/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/fluxo-principal',
        destination: '/fluxo-principal/primeira-etapa',
        permanent: true,  // use true para redirecionamento 308, ou false para 307
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
};

// Para .mjs, usamos export default em vez de module.exports
export default nextConfig;