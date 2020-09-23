const TerserJSPlugin = require('terser-webpack-plugin')
var nodeExternals = require('webpack-node-externals');

const config = {
    target: "node", // in order to ignore built-in modules like path, fs, etc.
    mode: "production",
    entry: {
        "index": "./src/index.ts",
    },
    output: {
        filename: "[name]_bundle.js",
        path: __dirname + "/dist"
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder

    module: {
        rules: [
            // All '.tsx' files will be processed by ts-loader
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ]
    },
    plugins: [
        new TerserJSPlugin({
            parallel: true,
            sourceMap: false
        })
    ],
};


// Check if build is running in production mode,
// this works with a vs code task that calls this like this:
//  "-d source-map"
if (process.argv[2] === "--dev-mode") {
    console.log("**** Development mode activated ****");
    config.devtool = "source-map"
    config.mode = "development";

    // We dont want development code to be minified, so we overwrite that array.
    config.plugins = []
} else {
    console.log("**** Production mode activated ****");
    config.module.rules.push(
    // #4: Enable ESLint
    // ESLint
    // {
    //     test: /\.(ts|tsx)$/,
    //     enforce: 'pre',
    //     use: [
    //         {
    //             options: {
    //                 fix: true,
    //                 eslintPath: "eslint",
    //             },
    //             loader: "eslint-loader",
    //         },
    //     ],
    //     exclude: /node_modules/,
    // })
}

module.exports = config;