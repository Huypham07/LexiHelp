// webpack.config.js
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

// Determine the target browser from command line arguments
// Default to 'chrome' if not specified
const targetBrowser = process.env.BROWSER || "chrome";

// Get the correct manifest based on the target browser
const getManifestPath = () => {
  return `./manifests/manifest.${targetBrowser}.json`;
};

module.exports = {
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  // mode: 'development',
  entry: {
    popup: "./src/main.tsx",
    background: "./src/background/background.ts",
    contentScript: "./src/content/content.ts",
  },
  output: {
    path: path.resolve(__dirname, `dist/${targetBrowser}`),
    filename: "[name]/bundle.js", // Outputs files like dist/popup/bundle.js
    clean: true, // Clean the output directory before emit
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Handle .ts and .tsx files
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
  test: /\.css$/i,
  exclude: /node_modules/, // bỏ qua node_modules
  use: ["style-loader", "css-loader", "postcss-loader"],
}
,
    ],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "src/popup/index.html",
      filename: "popup/index.html",
      chunks: ["popup"],
    })
    ,
    new CopyWebpackPlugin({
      patterns: [
        { from: getManifestPath(), to: "manifest.json" },
        { from: "icons", to: "icons" },
        { from: "src/assets/fonts", to: "fonts" },
      ],
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
