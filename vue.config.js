module.exports = {
  lintOnSave: false,
  baseUrl: "./",
  publicPath: "./",
  outputDir: "dist",
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/pvams": {
        // target: "http://148.70.2.3:8090",
        // target: "http://192.168.101.25:8081",
        target: "http://101.37.67.138:8088",
        // ws: true,
        changeOrigin: true
      }
    }
  },
};
