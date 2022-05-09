module.exports = {
    resolve: {
	    fallback: {
        "child_process": 'empty',
        "fs": require.resolve("browserify-fs"),
        "util": require.resolve("util"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "tls": require.resolve("tls-browserify"),
        "net": require.resolve("net-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify"),
        "stream": false,
        "zlib": require.resolve("browserify-zlib")
    }
    },
};
module.rules = {
   loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }, {
      test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
      loader: 'url-loader?limit=100000' }]
};
