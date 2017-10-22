const spider = require("./spider.js");
const url = "http://www.dyhjw.com/zhihuangjin/";
setInterval(() => {
  spider.fetchPage(url);
}, 30000);
