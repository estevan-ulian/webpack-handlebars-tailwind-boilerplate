const path = require("path");
const webpack = require("webpack");
const HandlebarsPlugin = require("handlebars-webpack-plugin");
const HandlebarsPluginMergeJSON = require("handlebars-webpack-plugin/utils/mergeJSON");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

/**
 * @name projectData
 * @description Project data config. Go here to change or add more data to your project.
 * @type {Object}
 * @example { "foo": "bar", [{ "foo": "bar" }] }
 * @see https://github.com/sagold/handlebars-webpack-plugin?tab=readme-ov-file#merging-input-data
 */
const projectData = HandlebarsPluginMergeJSON(path.join(__dirname, "src/data/**/*.json"));

/**
 * @name paths
 * @description Paths config used in various places in webpack config.
 * @type {Object}
 * @property {Object} src - Source paths.
 * @property {Object} dist - Distribution paths.
 */
const paths = {
    src: {
        imgs: "./src/assets/images",
        fonts: "./src/assets/fonts",
        favicon: "./src/assets/favicon",
        css: "./src/assets/css",
        js: "./src/assets/js",
    },
    dist: {
        imgs: "./assets/images",
        fonts: "./assets/fonts",
        favicon: "./assets/favicon",
        css: "./assets/css",
        js: "./assets/js",
    },
};

/**
 * @name webpackConfig
 * @description Webpack config for development and production.
 * @param {Object} env - Environment object.
 * @param {string} env.prod - Production environment.
 * @param {string} env.dev - Development environment.
 * @returns {Object} Webpack configuration object.
 * @see https://webpack.js.org/configuration/
 */

const webpackConfig = (env) => {
    const devMode = !env.prod;
    console.log("_____________environment:", env.dev ? "development" : "production");

    return {
        mode: env.prod ? "production" : "development",
        entry: {
            main: [paths.src.js + "/main.js"],
            theme: [paths.src.js + "/theme.js"],
        },

        output: {
            filename: paths.dist.js + "/[name]-bundle.js",
            path: path.resolve(__dirname, "dist"),
            clean: true,
        },

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    sideEffects: true,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
                },
                {
                    test: /\.(png|jpeg|jpg|gif)$/i,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]",
                                outputPath: "assets/images/",
                            },
                        },
                    ],
                },
            ],
        },

        plugins: [
            new webpack.ProgressPlugin(),
            new MiniCssExtractPlugin({
                filename: `${paths.dist.css}/[name]-bundle.css`,
            }),
            new CssMinimizerPlugin(),
            new CopyPlugin({
                patterns: [
                    {
                        from: paths.src.fonts,
                        to: paths.dist.fonts,
                        noErrorOnMissing: true,
                    },
                    {
                        from: paths.src.imgs,
                        to: paths.dist.imgs,
                        noErrorOnMissing: true,
                    },
                    {
                        from: paths.src.favicon,
                        to: paths.dist.favicon,
                        noErrorOnMissing: true,
                    },
                ],
            }),
            new HandlebarsPlugin({
                entry: path.join(process.cwd(), "src", "pages", "**", "*.html"),
                output: path.join(process.cwd(), "dist", "[path]", "[name].html"),
                partials: [path.join(process.cwd(), "src", "components", "**", "*.{html,svg}")],
                data: projectData,
                helpers: {
                    webRoot: () => "{{webRoot}}",
                    config: (data) => data,
                    ifEquals: function (arg1, arg2, options) {
                        if (arg1 === arg2) {
                            return options.fn(this);
                        }
                        return options.inverse(this);
                    },
                    log: (data) => {
                        console.log(data);
                    },
                    limit: (arr, limit) => {
                        if (!Array.isArray(arr)) {
                            return [];
                        }
                        return arr.slice(0, limit);
                    },
                },
                onBeforeSave: (Handlebars, res, file) => {
                    const elem = file.split("//").pop().split("/").length;
                    return res.split("{{webRoot}}").join(".".repeat(elem));
                },
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
            }),
        ],

        resolve: {
            extensions: ["", ".js", ".json", ".css"],
            modules: ["node_modules"],
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "initial",
                    },
                },
            },
            runtimeChunk: "single",
            minimize: true,
        },

        devtool: devMode ? "eval" : false,

        devServer: devMode
            ? {
                  port: 3000,
                  open: {
                      app: {
                          name: "Google Chrome", // just in MacOs
                      },
                  },
                  hot: false,
                  compress: true,
                  liveReload: true,
                  historyApiFallback: true,
                  watchFiles: [path.resolve(__dirname, "src/**/*.{js,html,css}"), path.resolve(__dirname, "dist/**/*.{html,js}")],
              }
            : {},
    };
};

module.exports = webpackConfig;
