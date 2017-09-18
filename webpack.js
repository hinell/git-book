let join          = require('path').join;
let webpack       = require('webpack');
let Uglifyjs      = require('uglifyjs-webpack-plugin');
let TsProcessFork = require('fork-ts-checker-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV

let plugins = NODE_ENV === 'production'
  ? [new Uglifyjs()]
  : [
      new webpack.HotModuleReplacementPlugin({title: 'HOT!'})
    , new TsProcessFork({ watch: ['./src/']  })
    ]

let config = {};
config.target     = 'web' // async-node | electron | electron-renderer | node | node-webkit | web | webworker
config.externals  // http://webpack.github.io/docs/configuration.html#externals
config.entry      = {bundle:'./src/index.ts'}
config.output     = {
    path     : join(__dirname, './public')
  , filename : '[name].js'
}
config.plugins   = plugins
config.devServer = {
  host: "0.0.0.0",
  port: 8080,
  publicPath: '/public/',
  hot: true,
  open: true,
}
config.watchOptions = {ignored: /node_modules/};
config.module = {
  rules: [
      {test: /\.tsx?$/  , use: {loader: 'ts-loader'  , options: { transpileOnly: true }} }
    , {test: /\.pug$/   , use: ['pug-loader']}
    , {test: /\.css$/   , use: ['style-loader','css-loader']}
    , {test: /\.scss$/  , use: [{loader: 'style-loader', options: { hmr: true }},{loader: 'css-loader', options: {url: false} },'sass-loader']  }
    ]
}
module.exports = config;
