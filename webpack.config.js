var DashboardPlugin = require('webpack-dashboard/plugin');
var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: './public/js/main.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
      loaders: [
            { test: path.join(__dirname, 'public'),
              loader: 'babel-loader?presets[]=es2015' }
        ],
        loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": ["react", "es2015"]
      }}],
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: "underscore",
            $: "jquery",
            Backbone: "backbone",
            jQuery: "jquery",
            React: 'react',
            ReactDOM: 'react-dom',
            JSXTransformer: 'JSXTransformer',
            jsx: 'jsx'
        }),
        new DashboardPlugin()
    ]
};
