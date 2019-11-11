'use strict';

// 引入 react
import React from 'react';
// 引入 react-dom
import ReactDOM from 'react-dom';
import '../../common';
import logo from './images/logo.png';
import {a} from './tree-shaking';
// 引入 css
// import './search.css';
// 引入 less
import './search.less';

// 代码不会实际执行，不会出现在 bundle 文件中
if (false) {
  a();
}

class Search extends React.Component {

  render() {
    // 代码中用到 a，会出现在 bundle 文件中
    const funcA = a();
    return <div className="search-text">
      {funcA}搜索文字的内容<img src={ logo } />
    </div>
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);