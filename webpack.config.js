'use strict'

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
