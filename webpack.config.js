const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SimpleProgressPlugin = require('webpack-simple-progress-plugin')
const path = require('path')
const webpack = require('webpack')


const src = p => path.resolve(__dirname, './src/', p)
const GATEWAY = process.env.NODE_ENV === 'production'
  ? 'https://gateway.songxiaocai.com'
  : 'http://gateway.songxiaocai.org'
const NODE_ENV = process.env.NODE_ENV === 'production'
  ? 'production'
  : 'development'
const DOMAIN = 'http://local.songxiaocai.org:4444'

module.exports = {
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  performance: {
    hints: false
  },
  resolve: {
    alias: {
      _axios: src('lib/axios'),
      '@lib': src('lib'),
      '@component': src('component'),
      '@gql': src('gql/index.js')
    },
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx', '.sass', '.graphql', '.gql']
  },
  module: {
    rules: [
      {
        test: /\.pegjs$/,
        loader: 'pegjs-loader'
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
      },
      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: 'html-loader',
      //       options: { minimize: true }
      //     }
      //   ]
      // },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }]
      },
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|it/),
    new webpack.DefinePlugin({
      'process.env': {
        DOMAIN: `'${DOMAIN}'`,
        GATEWAY: `'${GATEWAY}'`,
        NODE_ENV: `'${NODE_ENV}'`,
        OSSURL: `'https://dev-sxc-pesticide.oss-cn-hangzhou.aliyuncs.com/'`
      }
    }),
    new SimpleProgressPlugin(),
    new HtmlWebPackPlugin({
      template: src('./index.html'),
      filename: 'index.html',
      debug: process.env.NODE_ENV !== 'production',
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new BundleAnalyzerPlugin()
  ],
  devServer: {
    disableHostCheck: true,
    public: 'local.songxiaocai.org:4444',
    port: 4444,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/graphql': {
        target: 'http://local.songxiaocai.org:7001',
        ws: true
      },
      '/subscriptions': {
        target: 'ws://local.songxiaocai.org:7001',
        ws: true
      },
      '/upload': {
        target: 'http://local.songxiaocai.org:7001'
      },
      '/downloadTpl': {
        target: 'http://local.songxiaocai.org:7001'
      },
      '/logout': {
        target: 'http://local.songxiaocai.org:7001'
      },
      '/export': {
        target: 'http://local.songxiaocai.org:7001'
      },
      '/requirement': {
        target: 'http://local.songxiaocai.org:7001'
      },
      '/public/*': {
        target: 'http://local.songxiaocai.org:7001'
      },
      '/report/*': {
        target: 'http://local.songxiaocai.org:7001'
      },
      '/sqltrace/*': {
        target: 'http://local.songxiaocai.org:7001'
      },
      '/records/*': {
        target: 'http://local.songxiaocai.org:7001'
      }
    }
  }
}
