var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var autoprefixer = require('autoprefixer');
var perfectionist = require('perfectionist');

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/app/app.component.ts',
        'common': './src/common.ts'
    },

    devtool: 'cheap-module-source-map',

    resolve: {
        alias: {
            'vs': '/node_modules/monaco-editor/min/vs'
        },
        extensions: ['', '.js', '.ts']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['ts', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw'
            },
            {
                test: /^(?!.*component).*\.scss$/,
                loaders: ['style', 'css', 'resolve-url', 'postcss', 'sass']
            },
            {
                test: /\.component\.scss$/,
                loaders: ['raw', 'resolve-url', 'postcss', 'sass']
            }
        ],
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/,
                loader: "source-map-loader",
                exclude: [
                    helpers.root('node_modules/rxjs'),
                    helpers.root('node_modules/@angular')
                ]
            }
        ]
    },

    postcss: function () {
        return [autoprefixer({ browsers: ['Safari >= 8', 'last 2 versions'] }), perfectionist];
    },

    plugins: [

        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills', 'common', 'vendor', 'app'].reverse()
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],

    externals: {
        '/node_modules/monaco-editor/min/vs/*': 'monaco'
    }
};