import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // 忽略 @mapbox/node-pre-gyp 中的 HTML 文件
    config.module.rules.push({
      test: /node_modules\/@mapbox\/node-pre-gyp\/.*\.html$/,
      use: "ignore-loader",
    });

    // 排除 Node.js 原生模块，这些模块不应在浏览器环境中使用
    if (!isServer) {
      config.externals = [...(config.externals || []), { bcrypt: "bcrypt" }];
    }

    return config;
  },
};

export default nextConfig;
