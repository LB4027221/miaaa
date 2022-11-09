/*eslint-disable*/
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SimpleProgressPlugin = require('webpack-simple-progress-plugin')
const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const packageJson = require('../package.json')

const src = p => path.resolve(__dirname, '../src/', p)
const GATEWAY = 'https://gateway.songxiaocai.com'
const DOMAIN = 'https://reports.songxiaocai.com'
const NODE_ENV = 'production'

module.exports = {
  mode: 'production',
  output: {
    path: src('../dist/assets/'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[id].[hash].js',
	  publicPath: `https://dev-sxc-pesticide.oss-cn-hangzhou.aliyuncs.com/code_platform/testUp/miaaa/${packageJson.version}/`
  },
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
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new SimpleProgressPlugin(),
    new webpack.EnvironmentPlugin({
      DOMAIN,
      GATEWAY,
      NODE_ENV: 'production',
      OSSURL: `'https://dev-sxc-pesticide.oss-cn-hangzhou.aliyuncs.com/'`
    }),
    new ManifestPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|it/),
    new HtmlWebPackPlugin({
      template: src('./index.html'),
      debug: process.env.NODE_ENV !== 'production',
      filename: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[hash].css',
      chunkFilename: 'assets/css/[name].[hash].[id].css'
    })
  ]
}
