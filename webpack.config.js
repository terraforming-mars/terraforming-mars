module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
  module: {
    rules: [
      {test: /\.tsx?$/, loader: 'ts-loader'},
    ],
  },
  output: {
    path: __dirname + '/build',
  },
};
