const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const helpers = require('./webpack.helpers');

const env = { locale: (process.env.LOCALE || "fr").trim() };

console.log("-------------------------------------------------");
console.log(`@@@@@@@@@@@@@ USING PRODUCTION (${env.locale}) @@@@@@@@@@@@@`);

module.exports = {

    entry: {
        'vendor': './clientApp/vendor.ts',
        'polyfills': './clientApp/polyfills.ts',
        'app': './clientApp/main-aot.ts' // AoT compilation
    },

    output: {
        path: path.join(__dirname, 'wwwroot/'),
        filename: 'dist/[name].[hash].bundle.js',
    },

    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
    },

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        outputPath: path.join(__dirname, 'wwwroot/')
    },

    mode: 'production',

    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack'
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|ttf|otf|svg|cur|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/[name].[ext]'
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

    //MP
    // optimization: {
    //     emitOnErrors: true,
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             cache: true,
    //             parallel: true
    //         })
    //     ]
    // },

    performance: {
        hints: false
    },

    plugins: [
        // new DefinePlugin({
        //     // define a global "ENV" variable that we can use in the app, it contains the --env option from the npm command
        //     'ENV': JSON.stringify(env)
        // }),

        new AngularWebpackPlugin({
            tsconfig: './tsconfig-aot.json',
        }),

        //MP new CleanWebpackPlugin(),

        //MP new webpack.NoEmitOnErrorsPlugin(),

        // new webpack.optimize.ModuleConcatenationPlugin(),

        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery"
        // }),

        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     inject: 'body',
        //     template: 'clientApp/index.html'
        // }),
    ],

    stats: {
        warningsFilter: /System.import/,
    },
};
