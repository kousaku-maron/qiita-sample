<!-- [React]create-react-appを使わずにReact環境を構築する -->

# はじめに

ReactでWebアプリケーションを作る際、`create-react-app`を使って環境を構築することが多いと思う。だがwebpackの設定をカスタマイズしたいケース、`create-react-app`でインストールされる`react-scripts`が邪魔になるケースなど、独自で環境を構築したいときどうすれば環境を作れるのだろうか。このような疑問を持っている方のために、Reactの環境構築の方法をここに記す。

# webpackとbabelの導入

webpackは、複数のファイルをひとつにまとめるツールで、babelはES6等新しい書き方をしたjavascriptをどのブラウザでも読み込めるよう変換するツールです。

※プラグインもインストールしています。

```bash
mkdir react-env
cd react-env
npm install -D @babel/core @babel/preset-env @babel/preset-react babel-loader file-loader url-loader webpack webpack-cli webpack-dev-server html-webpack-plugin
```

# webpackとbabelの設定

webpackとbabelを利用する設定を書きます。

### webpackの設定

`webpack.config.js`を作成しましょう。

```js:webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    port: 3000,
    contentBase: 'dist'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use:{
          loader: 'babel-loader'
        },
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'html/index.html'),
      
      filename: 'index.html'
    }),
  ]
};
```

`entry`には、読み込むファイルを設定します。`create-react-app`で使ったアプリケーションでいう`index.js`です。`output`には読み込んだファイルに紐付くコードをまとめたファイルをどこに出力するか設定します。ここでが、`dist`フォルダに`bundle.js`として出力させるようにしています。

```js
module.exports = {
  ...
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  ...
};
```

`webpack-dev-server`を利用して、ローカル環境でアプリケーションを起動させるとき参照するフォルダと、利用するポート番号を設定します。

```ls
module.exports = {
  ...
  devServer: {
    port: 3000,
    contentBase: 'dist'
  },
  ...
}
```

`module`の`rules`には、ローダーを適用するファイルと、使用するローダーを設定します。ここでは、`src`フォルダの`js`と`jsx`のファイルを`babel-loader`で、画像ファイルを`url-loader`で変換するように設定しています。

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use:{
          loader: 'babel-loader'
        },
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
  ...
}
```

`plugins`ではwebpackを拡張できます。今回はhtmlファイルを作成するプラグインを導入しています。`html`フォルダの`index.html`にwebpackを通じで出力される`bundle.js`を読み込むコードを追記して、`output`に出力されます。

```js
module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'html/index.html'),
      
      filename: 'index.html'
    }),
  ]
};
```

### babelの設定

`webpack.config.js`の`bael-loader`でも設定できるが、今回は切り出して設定します。

`.babelrc`を作成しましょう。

```json:.babelrc
{
  "presets": [
    "@babel/env",
    "@babel/preset-react"
  ]
}
```

# 必要なフォルダとファイルを準備

webpackの設定でわかるように、ビルドさせるエントリーファイルである`src/index.js`、ビルドされたファイルが出力される`dist`フォルダ、`dist`フォルダに作成されるhtmlファイルのもととなる`html/index.html`が必要なので作成する。

※`index.js`は次のセクションで書きます。

```bash
├── dist
├── html
│   └── index.html
├── package-lock.json
├── package.json
├── src
│   └── index.js
└── webpack.config.js
```

```html:index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>React Test</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

# Reactアプリケーションを開発

必要なモジュールをインストールします。

```bash
npm install --save react react-dom
```

`src/index.js`で「Hello React」を表示させます。

```js:index.js
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <h1>Hello React</h1>,
  document.getElementById('root')
)
```

# コマンドの設定

`npm start`でローカル環境でReactアプリケーションの起動、`npm run build`でReactアプリケーションのビルドを行わせます。

```json:package.json
{
  ...
  "scripts": {
    "start": "webpack-dev-server",
    "build": "webpack --mode production --progress"
  },
  ...
}
```

# さいごに

独自でReactの環境を作れるようになれば、`Next.js`を使わずにサーバーサイドレンダリングも簡単にできたりもします。ぜひ一度お試しあれ。
