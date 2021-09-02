const {VueLoaderPlugin} = require('vue-loader');
const CompressionPlugin = require('compression-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const zlib = require('zlib');

module.exports = {
  devtool: 'source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/main.ts',
  resolve: {
    extensions: ['.ts', '.vue', '.js'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
    fallback: {
      util: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {appendTsSuffixTo: [/\.vue$/], transpileOnly: true},
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader?url=false'],
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader?url=false', 'less-loader'],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configOverwrite: {
          exclude: [
            "tests/**/*.ts"
          ],
        },
        extensions: {
          vue: true
        }
      }
    }),
    new VueLoaderPlugin(),
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
