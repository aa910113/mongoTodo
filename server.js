const http = require('http');
const headers = require('./headers');
const Article = require('./model/article');
const handleResponse = require('./handleResponse');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/homeWork')
  .then(() => console.log('資料庫連線OK!'));

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url == '/posts' && req.method == 'GET') {
    const articles = await Article.find();
    handleResponse(200, res, articles);
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
        handleResponse(200, res, newArticle);
      } catch (error) {
        handleResponse(400, res, null, error.message);
      }
    });
  } else if (req.url == '/posts' && req.method == 'DELETE') {
    const articles = await Article.deleteMany({});
    handleResponse(200, res, articles);
  } else if (req.url.startsWith('/posts/') && req.method == 'DELETE') {
    try {
      const id = req.url.split('/').pop();
      const articles = await Article.findByIdAndDelete(id);
      if (articles !== null) {
        handleResponse(200, res, articles);
      } else {
        handleResponse(400, res, null, '查無此 ID');
      }
    } catch (error) {
      handleResponse(400, res, null, error.message);
    }
  } else if (req.url.startsWith('/posts/') && req.method == 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
        const data = JSON.parse(body);
        if (JSON.stringify(data) !== '{}') {
          const articles = await Article.findByIdAndUpdate(id, data);
          handleResponse(200, res, articles);
        } else {
          handleResponse(400, res, null, '欄位沒有填寫正確');
        }
      } catch (error) {
        handleResponse(400, res, null, '欄位沒有填寫正確或沒有此 ID');
      }
    });
  } else if (req.method == 'OPTIONS') {
    handleResponse(200, res);
  } else {
    handleResponse(404, res, null, '無此網路路由');
  }
};

const server = http.createServer(requestListener);
server.listen(8000);
