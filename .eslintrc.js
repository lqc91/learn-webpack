module.exports = {
  "parser": "babel-eslint", // 指定解析器
  "extends": "airbnb", // 使用 airbnb 配置扩展规则
  "env": { // 启用 browser 和 Node.js 环境
    "browser": true,
    "node": true
  },
  "rules": { // 配置规则
    "indent": ["error", 2],
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }]
  }
}