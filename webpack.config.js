const webpack = require("webpack");
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {GenerateSW} = require('workbox-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        entryOne: './src/entry-one.js',
        entryTwo: './src/entry-two.js',
        entryThree: './src/entry-three.js',
    },
    module: {
        rules: [
            // Expose jQuery on window when loaded
            {
                test: require.resolve('jquery'),
                loader: 'expose-loader',
                options: {
                    exposes: ['$', 'jQuery'],
                },
            }
        ],
    },
    optimization: {
        // Create shared bundles with repeated code
        splitChunks: {
            chunks: 'all',
        },
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].[contenthash].js'
    },
    plugins: [
        // Autoload jQuery when a module needs it
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'window.$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
        }),
        // Generate maps
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map'
        }),
        // Generate stats for webpack-bundle-analyzer
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: true,
            statsFilename: 'webpack-stats.json'
        }),
        // Generate a service worker to precache assets output
        new GenerateSW()
    ]
}