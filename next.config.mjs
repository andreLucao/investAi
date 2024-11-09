/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/fluxo-inicial',
          destination: '/fluxo-inicial/primeira-etapa',
          permanent: true,
        },
        
      ];
    },
};

export default nextConfig;