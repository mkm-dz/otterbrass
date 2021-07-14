const TerserJSPlugin = require('terser-webpack-plugin')
var nodeExternals = require('webpack-node-externals');

const config = (env, argv) => {
    let result = {
        target: "node", // in order to ignore built-in modules like path, fs, etc.
        mode: "production",
        entry: {
            "index": "./src/index.ts",
        },
        output: {
            filename: "[name].js",
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
                parallel: true
            })
        ],
    }

    if (env.compilationMode === "dev") {
        console.log("**** Development mode activated ****");
        // Enable sourcemaps for debugging webpack's output.
        result.devtool = "source-map";
        result.mode = "development";

        // We dont want development code to be minified, so we overwrite that array.
        result.plugins = [];
    } else {
        console.log("**** Production mode activated ****");
    }

    // #4: Enable ESLint here

    return result;
};

module.exports = config;