'use strict';

// 引入 react
import React from 'react';
// 引入 react-dom
import ReactDOM from 'react-dom';
import logo from './images/logo.png';
// 引入 css
// import './search.css';
// 引入 less
import './search.less';

class Search extends React.Component {

  render() {
    return <div className="search-text">
      搜索文字的内容<img src={ logo } />
    </div>
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);