/* ----------------------------------------------------------------------------
 File:        craco.config.js
 Project:     Celaya Solutions Cosmos Explorer
 Created by:  Celaya Solutions, 2025
 Author:      Christopher Celaya <chris@celayasolutions.com>
 Description: CRACO configuration for webpack polyfills and PostCSS setup
 Version:     1.0.0
 License:     BSL (SPDX id BUSL)
 Last Update: June 2025
---------------------------------------------------------------------------- */

const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      };
      
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ];
      
      return webpackConfig;
    },
  },
  style: {
    postcss: {
      plugins: [
        require('@tailwindcss/postcss'),
      ],
    },
  },
}; 