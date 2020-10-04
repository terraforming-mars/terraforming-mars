'use strict'

const child_process = require("child_process");
const version = child_process.execSync("git log -1 --pretty=format:\"%h %cD\"").toString();

module.exports = {
  devtool: "source-map",
  mode: 'production',
  entry: [
    './dist/script.js'
  ],
  resolve: {
    alias: {
        'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },
  stats: {
    warnings: false
  }
}
