/* ----------------------------------------------------------------------------
 File:        config-overrides.js
 Project:     Celaya Solutions Cosmos Explorer
 Created by:  Celaya Solutions, 2025
 Author:      Christopher Celaya <chris@celayasolutions.com>
 Description: Webpack configuration overrides for Node.js polyfills
 Version:     1.0.0
 License:     BSL (SPDX id BUSL)
 Last Update: June 2025
---------------------------------------------------------------------------- */

const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
  };
  
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];
  
  return config;
}; 