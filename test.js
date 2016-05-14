var http = require('http');

var post_data = querystring.stringify({
  call : "heads"
});

var post_options = {
      host: 'localhost',
      port: '3000',
      path: '/flip',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
  }
};

var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
    });
});

// post the data
post_req.write(post_data);
post_req.end();