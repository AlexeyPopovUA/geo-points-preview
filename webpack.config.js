const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

module.exports = env => {
    console.log(env);

    const mode = env.prod ? 'production' : 'development';
    const destinationPath = env.release ? 'docs' : 'dist';
    const watch = !env.release;

    return {
        entry: {
            index: './src/index.jsx'
        },
        target: "web",
        mode,
        devtool: "sourcemaps",
        watch,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/
        },
        output: {
            filename: '[name].[chunkhash].js',
            path: path.resolve(__dirname, destinationPath)
        },
        plugins: [
            new CleanWebpackPlugin([destinationPath]),
            new MiniCssExtractPlugin({
                filename: '[name].[chunkhash].css'
            }),
            new HtmlWebpackPlugin({
                inject: false,
                hash: true,
                template: './index.html',
                filename: 'index.html'
            }),
            new WebpackMd5Hash()
        ],
        module: {
            rules: [
                {
                    test: /\.jsx$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: MiniCssExtractPlugin.loader},
                        {loader: 'css-loader'},
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: ["./styles"]
                            }
                        }
                    ]
                },
                {
                    loader: "source-map-loader",
                    test: /\.jsx$/,
                    enforce: "pre"
                }
            ]
        }
    };
};
