const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SimpleProgressPlugin = require('webpack-simple-progress-plugin')
const path = require('path')
const webpack = require('webpack')
// const theme = require('./theme')

const src = p => path.resolve(__dirname, '../src/', p)
const GATEWAY = process.env.NODE_ENV === 'production'
  ? 'https://gateway.songxiaocai.com'
  : 'http://gateway.songxiaocai.org'

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
    new webpack.DefinePlugin({
      'process.env': {
        GATEWAY: `'${GATEWAY}'`
      }
    }),
    new SimpleProgressPlugin(),
    new HtmlWebPackPlugin({
      debug: process.env.NODE_ENV !== 'production',
      inject: true,
      template: src('./index.html'),
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new BundleAnalyzerPlugin()
  ],
  devServer: {
    public: 'local.songxiaocai.test:4444',
    port: 4444,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/graphql': {
        target: 'http://localhost:1024',
        ws: true
      },
      '/logout': {
        target: 'http://localhost:1024'
      },
      '/export': {
        target: 'http://localhost:1024'
      },
      '/requirement': {
        target: 'http://localhost:1024'
      },
      '/public/*': {
        target: 'http://localhost:1024'
      }
    }
  }
}
