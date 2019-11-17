import { join } from "path";
const include = join(__dirname, "src");
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
const CKEditorWebpackPlugin = require("@ckeditor/ckeditor5-dev-webpack-plugin");
const { styles } = require("@ckeditor/ckeditor5-dev-utils");

export default {
  devtool: "source-map",
  entry: [require.resolve("regenerator-runtime/runtime.js"), "./src/index"],
  output: {
    path: join(__dirname, "dist"),
    libraryTarget: "umd",
    library: "react-ckeditor5"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel-loader" },
      { test: /\.json$/, loader: "json-loader" },
      // { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag"
            }
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve("@ckeditor/ckeditor5-theme-lark")
              },
              minify: true
            })
          }
        ]
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.svg$/,
        use: ["raw-loader"]
      }
    ]
  },
  externals: {
    react: "commonjs react" // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
  }
};
