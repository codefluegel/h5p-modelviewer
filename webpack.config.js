import { dirname, resolve as _resolve, join } from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mode = process.argv.includes('--mode=production') ? 'production' : 'development';
const libraryName = process.env.npm_package_name;

export default {
  mode: mode,
  entry: {
    dist: './entries/dist.js',
  },
  output: {
    path: _resolve(__dirname, 'dist'),
    filename: `${libraryName}.js`,
    clean: true,
  },
  target: ['browserslist'],
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${libraryName}.css`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(s[ac]ss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
        include: join(__dirname, 'src/images'),
        type: 'asset/resource',
      },
    ],
  },
  stats: {
    colors: true,
  },
  ...(mode !== 'production' && { devtool: 'eval-cheap-module-source-map' }),
};
