// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@frontend': path.resolve(__dirname, 'src'),
        '@backend': path.resolve(__dirname, '../backend/src'),
      };
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        {
          module: /node_modules\/bootstrap/,
          message: /Deprecation/,
        },
        {
          module: /node_modules\/sass/,
          message: /legacy JS API/,
        },
      ];
      return webpackConfig;
    },
  },
};
