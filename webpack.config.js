const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = {
  target: 'web',
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  entry: {
    main: {
      import: path.resolve(__dirname, 'src/main.ts'),
      dependOn: 'globals',
    },
    globals: {
      import: path.resolve(__dirname, 'src/globals.ts')
    },
  },
  optimization: {
    runtimeChunk: 'single', // create a single runtime bundle for all chunks
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    // path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true, // remove unused built files
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src/assets'),
    ],
    extensions: ['.ts', '.js',],
    fallback: {
      fs: false,
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets', to: 'assets'}
      ]
    }),
    new HtmlWebpackPlugin({
      title: 'Path To Love',
      template: './src/index.html',
    }),
    new WebpackShellPluginNext({
      // onBuildStart:{
      //   scripts: ['echo Start building ...'],
      //   blocking: true,
      //   parallel: false
      // },
      // onBuildEnd:{
      //   scripts: ['echo Finish building.'],
      //   blocking: false,
      //   parallel: true
      // }
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], // loaders are executed in reversed order
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator : {
          filename : 'assets/images/[name][ext]',
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator : {
          filename : 'assets/fonts/[name][ext]',
        }
      }
    ]
  }
};