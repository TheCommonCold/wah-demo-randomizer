/** @type {import('next').NextConfig} */
const nextConfig = {
  // if I ever want to use the bot to react to messages this is needed
  // webpack: (config, { isServer }) => {
  //   config.module.rules.push({
  //     test: /\.node$/,
  //     loader: "node-loader",
  //   });
  //   return config;
  // },
}

module.exports = nextConfig
