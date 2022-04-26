const headers = require('./headers');
const handleResponse = (code, res, data, err) => {
  if (code <= 200) {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data,
      }),
    );
    res.end();
  } else {
    res.writeHead(code, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        err,
      }),
    );
    res.end();
  }
};
module.exports = handleResponse;
