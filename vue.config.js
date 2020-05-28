process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  configureWebpack: {
    entry: {
      app: './docs/index.js'
    },
    externals: process.env.NODE_ENV === 'production' && !process.env.DOCS ? ['vuetify/lib'] : []
  },
  productionSourceMap: false
}
