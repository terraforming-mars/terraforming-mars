const webpack = require('webpack');

// Makes the .vue file format parseable.
const {VueLoaderPlugin} = require('vue-loader');
// Compresses resources for smaller download.
const CompressionPlugin = require('compression-webpack-plugin');
// Speeds up typescript type checking into a separate process.
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// Enables the tsconfig-paths behavior in webpack. tsconfig-paths is responsible for the
// import mapping that often begins with @.
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const zlib = require('zlib');

const plugins = [
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      configOverwrite: {
        exclude: [
          'tests/**/*.ts',
        ],
      },
      extensions: {
        vue: true,
      },
    },
  }),
  new VueLoaderPlugin(),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new CompressionPlugin());
  plugins.push(new CompressionPlugin({
    algorithm: 'brotliCompress',
    filename: '[path][base].br',
    compressionOptions: {params: {[zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY}},
  }));
}

if (process.env.NODE_ENV === 'development') {
  // Reports progress on the commandline during compilation.
  plugins.push(new webpack.ProgressPlugin());
}

module.exports = {
  devtool: 'source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/client/main.ts',
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
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
  plugins,
  output: {
    path: __dirname + '/build',
  },
};
