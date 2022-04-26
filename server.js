const http = require('http');
const Article = require('./model/article');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/homeWork')
  .then(() => console.log('資料庫連線OK!'));

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
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
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const newArticle = await Article.create({
          name: data.name,
          tags: data.tags,
          type: data.type,
          image: data.image,
          createAt: data.createAt,
          content: data.content,
          likes: data.likes,
          comments: data.comments,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            article: newArticle,
          }),
        );
        res.end();
      } catch (error) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'error',
            error: error.message,
          }),
        );
        res.end();
      }
    });
  } else if (req.url == '/posts' && req.method == 'DELETE') {
    const articles = await Article.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        articles,
      }),
    );
    res.end();
  } else if (req.url.startsWith('/posts/') && req.method == 'DELETE') {
    try {
      const id = req.url.split('/').pop();
      const articles = await Article.findByIdAndDelete(id);
      if (articles !== null) {
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            articles,
          }),
        );
      } else {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'error',
            message: '查無此 ID',
          }),
        );
      }
      res.end();
    } catch (error) {
      res.writeHead(400, headers);
      res.write(
        JSON.stringify({
          status: 'error',
          message: '欄位沒有填寫正確或沒有此 ID',
          error: error,
        }),
      );
      res.end();
    }
  } else if (req.url.startsWith('/posts/') && req.method == 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);
        if (JSON.stringify(data) !== '{}') {
          const articles = await Article.findByIdAndUpdate(id, data);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              articles,
            }),
          );
          res.end();
        } else {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: 'error',
              message: '欄位沒有填寫正確',
            }),
          );
          res.end();
        }
      } catch (error) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'error',
            message: '欄位沒有填寫正確或沒有此 ID'
          }),
        );
        res.end();
      }
    });
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
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
