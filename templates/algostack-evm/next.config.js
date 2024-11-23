/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  transpilePackages: ["connectkit"],
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, { webpack, isServer }) => {
    if (isServer) {
      // Module not found
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp:
            /(^@google-cloud\/spanner|^@mongodb-js\/zstd|^aws-crt|^aws4$|^pg-native$|^mongodb-client-encryption$|^@sap\/hana-client$|^snappy$|^pino-pretty$|^lokijs$|^react-native-sqlite-storage$|^bson-ext$|^cardinal$|^kerberos$|^hdb-pool$|^sql.js$|^sqlite3$|^better-sqlite3$|^ioredis$|^typeorm-aurora-data-api-driver$|^pg-query-stream$|^oracledb$|^mysql$|^snappy\/package\.json$|^cloudflare:sockets$)/,
        }),
      );
    }

    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
};

module.exports = nextConfig;
