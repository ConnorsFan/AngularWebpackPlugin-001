const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const helpers = require('./webpack.helpers');

const env = { locale: (process.env.LOCALE || "fr").trim() };

console.log("--------------------------------------------------");
console.log(`@@@@@@@@@@@@@ USING DEVELOPMENT (${env.locale}) @@@@@@@@@@@@@`);

module.exports = {

    devtool: 'source-map',

    entry: {
        'vendor': './clientApp/vendor.ts',
        'polyfills': './clientApp/polyfills.ts',
        'app': './clientApp/main.ts' // AoT compilation
    },

    output: {
        path: path.join(__dirname, 'wwwroot/'),
        filename: 'dist/[name].bundle.js',
        publicPath: ''
    },

    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
        fallback: {
            "crypto": false
        }
    },

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        outputPath: path.join(__dirname, 'wwwroot/'),
        stats: {
            warningsFilter: /System.import/,
        },
    },

    mode: 'development',

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    { loader: 'ts-loader' },
                    { loader: 'angular2-template-loader' },
                    { loader: 'source-map-loader' }
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|ttf|otf|svg|cur|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name : 'assets/[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ],
        exprContextCritical: false
    },

    optimization: {
        emitOnErrors: false
    },

    performance: {
        hints: false
    },

    plugins: [
        new DefinePlugin({
            // define a global "ENV" variable that we can use in the app, it contains the --env option from the npm command
            'ENV': JSON.stringify(env)
        }),

        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: 'body',
            template: 'clientApp/index.html'
        }),
    ],

    stats: {
        warningsFilter: /System.import/,
    },
};
