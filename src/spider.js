const http = require("http");
const fs = require("fs");
const cheerio = require("cheerio");
const request = require("request");

function startRequest(x) {
  //采用http模块向服务器发起一次get请求
  http
    .get(x, function(res) {
      var html = ""; //用来存储请求网页的整个html内容
      var titles = [];
      res.setEncoding("utf-8"); //防止中文乱码
      //监听data事件，每次取一块数据
      res.on("data", function(chunk) {
        html += chunk;
      });
      //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
      res.on("end", function() {
        var $ = cheerio.load(html); //采用cheerio模块解析html
        const now = new Date();
        const timeSr = `${now.getFullYear()}-${now.getMonth() +
          1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        var time = $("span.nowTime b")
          .next()
          .text()
          .trim();
        console.log(time);
        var news_item = {
          //获取文章的标题
          price: $("div.tady_price .nom")
            .text()
            .trim(),
          //获取文章发布的时间
          time: timeSr
          //i是用来判断获取了多少篇文章
        };
        console.info(news_item);
        savedContent(timeSr, news_item.price); //存储每篇文章的内容及文章标题
      });
    })
    .on("error", function(err) {
      console.log(err);
    });
}
//该函数的作用：
function savedContent(timeSr, content) {
  //将新闻文本内容一段一段添加到/data文件夹下，并用新闻的标题来命名文件
  fs.appendFile("../data/" + timeSr + ".txt", content, "utf-8", function(err) {
    if (err) {
      console.error(err);
    }
  });
}

exports.fetchPage = function(url) {
  //封装了一层函数
  startRequest(url);
};
