"use strict"

module.exports = {
  mode: "development",
  // mode: "production",
  entry: [
    "./dist/script.js"
  ],
  resolve: {
    alias: {
        "vue$": "vue/dist/vue.esm.js" // 'vue/dist/vue.common.js' for webpack 1
    }
  }
}
