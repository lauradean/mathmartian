import path from 'path';

module.exports = {
  target: 'web',
  entry: {
    app: ['./client/js/index.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve('public'),
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ],
      },
      {
        test: /\.png/,
        loader: 'url-loader?limit=10000&mimetype=image/png',
      },
    ],
  },
};
