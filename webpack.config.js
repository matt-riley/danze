var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var stylelint = require('stylelint');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var PostcssImport = require('postcss-easy-import');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var stylefmt = require('stylefmt');
var rucksack = require('rucksack-css');

var pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  style: path.join(__dirname, 'app/main.css'),
  public: path.join(__dirname, 'app/public'),
  test: path.join(__dirname, 'tests')
};

process.env.BABEL_ENV = TARGET;

var common = {
  entry: PATHS.app,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
      preLoaders: [
        {
          test: /\.jsx?$/,
          loaders: ['eslint'],
          include: PATHS.app
        },
        {
          test: /\.css$/,
          loaders: ['postcss'],
          include: PATHS.app
        },
      ],
      loaders: [
        {
          test: /\.(jpe?g|png|gif|svg|woff|woff2|ttf|eot)$/i,
          loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
          ]
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          query: {
            plugins: ['transform-runtime', 'transform-decorators-legacy', 'add-module-exports'],
            presets: ['es2015', 'stage-0', 'react']
          },
          include: PATHS.app
        }
      ]
    },
    postcss: function() {
      return [
        PostcssImport({
          addDependencyTo: webpack,
        }),
        precss,
        autoprefixer({ browsers: ['last 2 versions'] }),
        rucksack,
      ];
    },
    imageWebpackLoader: {
      svgo: {
        plugin: [
          {
            removeViewBox: true
          },
          {
            removeEmptyAttrs: true
          }
        ]
      }
    },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Danze',
      template: PATHS.app + '/templates/index_default.html',
      inject: 'body',
      appMountId: 'page',
    })
  ]
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css', 'postcss'],
          include: PATHS.app
        },
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  });
}

if(TARGET == 'build' || TARGET === 'stats' || TARGET === 'deploy') {
  module.exports = merge(common, {
    entry: {
      app: PATHS.app,
      vendor: Object.keys(pkg.dependencies)
    },
    output: {
      path: PATHS.build,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader']),
          include: PATHS.app
        },
      ]
    },
    plugins: [
      new Clean([PATHS.build]),
      new ExtractTextPlugin('[name].[chunkhash].css'),
      new HtmlwebpackPlugin({
        title: 'Danze - Matt Riley',
        template: PATHS.app + '/templates/index_default.html',
        inject: 'body',
        appMountId: 'page',
        minify: {
          collapseWhitespace: true,
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new CopyWebpackPlugin(
        [
          { from: PATHS.public, to: PATHS.build }
        ],
        {
          ignore: [
            '.DS_Store'
          ]
        }
      )
    ]
  });
}

if(TARGET === 'test' || TARGET === 'tdd') {
  module.exports = merge(common, {
    devtool: 'inline-source-map',
    resolve: {
      alias: {
        'app': PATHS.app
      }
    },
    module: {
      preloaders: [
        {
          test: /\.jsx?$/,
          loaders: ['isparta-instrumenter'],
          include: PATHS.app
        }
      ],
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['babel?cacheDirectory'],
          include: PATHS.test
        }
      ]
    }
  });
}