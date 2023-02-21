const http = require('http');

exports.default = function (settings) {
http.createServer(function (req, res) {
url = req.url;
if (url == '/' || url == '/index.html' || url == '/index') {
url = '/index.html';
}
else if (!url.includes('.html')) {
url = '/'+url;
}
else{
    url = "404.html"
}
}).listen(settings.port);

}