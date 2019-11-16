'use strict';

// 引入 react
import React from 'react';
// 引入 react-dom
import ReactDOM from 'react-dom';
import '../../common';
import logo from './images/logo.png';
// import {a} from './tree-shaking';
// 引入 css
// import './search.css';
// 引入 less
import './search.less';

// 代码不会实际执行，不会出现在 bundle 文件中
if (false) {
  a();
}

class Search extends React.Component {

  constructor() {
    super(...arguments);

    this.state = {
      Text: null
    };
  }

  loadComponent() {
    // 动态 import 返回 Promise 对象
    import('./text.js').then((Text) => {
      this.setState({
        Text: Text.default
      });
    });
  }

  render() {
    const { Text } = this.state;
    return <div className="search-text">
      {
        Text ? <Text /> : null
      }
      搜索文字的内容<img src={ logo } onClick={ this.loadComponent.bind(this) } />
    </div>
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);