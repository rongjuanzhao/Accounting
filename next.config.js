/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 配置API路由的基础路径
  basePath: '',
  // 配置环境变量
  env: {
    POSTGRES_URL: process.env.POSTGRES_URL,
  },
}

export default nextConfig