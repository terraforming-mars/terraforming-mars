const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

module.exports = {
  entry: './src/main.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
  module: {
    rules: [{test: /\.tsx?$/, loader: 'ts-loader'}],
  },
  plugins: [
    new CompressionPlugin(),
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      filename: '[path][base].br',
      compressionOptions: {params: {[zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY}},
    }),
  ],
  output: {
    path: __dirname + '/build',
  },
};
