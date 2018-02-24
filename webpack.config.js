var config = {
   entry: './src/app.js',

   output: {
  path: __dirname,
  publicPath: '/',
  filename: 'index.js'
},

   devServer: {
      inline: true,
      port: 8080
   },

   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015', 'react',]
            }
         },
        { test: /\.css$/, loader: "style-loader!css-loader" },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        }
      ]
   }
}

module.exports = config;
