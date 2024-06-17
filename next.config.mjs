/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                // port: '', // Jika Anda menggunakan port tertentu, tambahkan di sini
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
