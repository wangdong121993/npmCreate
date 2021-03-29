// https://webpack.docschina.org/loaders/sass-loader/
console.log('webpack.config.js')
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin"); // https://webpack.docschina.org/plugins/terser-webpack-plugin/
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const SpeedMeasureWebpack5Plugin = require('speed-measure-webpack5-plugin'); //分析打包速度针对webpack5安装
const VueLoaderPlugin = require('vue-loader-plugin') // vue-loader@15版本以上需要 vue-loader-plugin
const notifier = require('node-notifier')
const smw = new SpeedMeasureWebpack5Plugin();

// module.exports = smw.wrap({
module.exports = {
  mode: "development",
  entry: "./src/main.js",
  devServer: { // https://webpack.docschina.org/configuration/dev-server/
    port: 8021,
    hot: true,
    open: true,
    // contentBase: '../dist'
  },
  // todo 打包需要配置
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, './../dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,
          // 'cache-loader',
          'vue-style-loader',
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // 其他选项
                    },
                  ],
                ],
              },
            },
          }
        ]
      },
      // {
      //   test: '/\.less(us)?$/i',
      //   // loader: "style-loader!css-loader!less-loader",
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     'less-loader'
      //   ]
      // },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        use: {
          loader: 'url-loader', // https://webpack.docschina.org/loaders/url-loader/
          options: {
            limit: 1024,
            esModule: false
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/
      new TerserPlugin({
        parallel: true,
        extractComments: (astNode, comment) => {
          return false
        }
      })
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@':path.resolve('./src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true, //去掉空格,
        removeComments: true // 去掉注释
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new CleanWebpackPlugin(),
    // 友好提示
    new FriendlyErrorsWebpackPlugin({
      onErrors: (severity, errors) => {
        notifier.notify({
          title: 'webpack 编译失败了~',
          message: `${severity} ${errors[0].name}`,
          subtitle: errors[0].file || ''
        });
      },
    }),
    // 分析打包文件大小
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true
    }),
    new VueLoaderPlugin()
  ]
}
// )