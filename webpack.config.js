const path = require('path');
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
    },
  }),
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  }),
  {
    apply: (compiler) => {
      compiler.hooks.compile.tap('BuildStartPlugin', () => {
        console.log('🚀 Webpack Build Started...');
      });

      compiler.hooks.done.tap('BuildEndPlugin', () => {
        // Pushes the log to the very end of the execution queue
        process.nextTick(() => {
          console.log('✅ Webpack Build Finished!');
        });
      });
    },
  },
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
  entry: {
    main: './src/client/main.ts',
    sw: './src/client/sw.ts',
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.ts', '.vue', '.js'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js',
      // Force CJS build of test-utils so webpack doesn't choke on its ESM export map.
      '@vue/test-utils': path.resolve(__dirname, 'node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js'),
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
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
          compilerOptions: {module: 'esnext', removeComments: false}
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', {loader: 'css-loader', options: {url: false}}],
      },
      {
        test: /\.less$/,
        use: ['style-loader', {loader: 'css-loader', options: {url: false}}, {
          loader: 'less-loader',
          options: {
            // Prepend the shared design tokens and mixins to every component's
            // <style lang="less"> block. This lets scoped components use
            // @variables (e.g. @player_red, @font_size_normal) and .mixins()
            // (e.g. .raised-bevel()) directly, without importing them.
            //
            // Only include files that contain declarations and mixins, not actual styles.
            additionalData: '@import "variables.less"; @import "mixins.less";',
            lessOptions: {
              paths: [path.resolve(__dirname, 'src/styles')],
            },
          },
        }],
      },
    ],
  },
  plugins,
  output: {
    path: __dirname + '/build',
    hashFunction: 'xxhash64',
    publicPath: '/',
    chunkFilename: 'chunks/[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
