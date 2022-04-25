const http = require('http');
const Article = require('./model/article');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/homeWork')
  .then(() => console.log('資料庫連線OK!'));

const requestListener = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };
  if (req.url == '/posts' && req.method == 'GET') {
    const articles = await Article.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        articles,
      }),
    );
    res.end();
  } else if (req.url == '/posts' && req.method == 'POST') {
  } else if (req.url == '/posts' && req.method == 'DELETE') {
  } else if (req.url.startsWith('/posts/') && req.method == 'DELETE') {
  } else if (req.url.startsWith('/posts/') && req.method == 'PATCH') {
  } else if (req.method == 'OPTIONS') {
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'error',
        message: '無此網路路由',
      }),
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(8000);
