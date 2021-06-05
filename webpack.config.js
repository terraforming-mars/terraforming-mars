const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
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
        options: {appendTsSuffixTo: [/\.vue$/]},
      },
      {
        test: /.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  output: {
    path: __dirname + '/build',
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};
