// imports
const http = require('http');
const fs = require('fs');

// declare consts
const home = "index.html";
const fileroot = "frontend/render";
const infoprefix = "{INFO}";
const reqprefix = "{REQUEST}";
const errprefix = "{ERROR}";

// run server
exports.default = function (settings) {
http.createServer(function (req, res) {
  //router
  var url = req.url.split("?")[0];
  if (url.endsWith("/")) {
    var file = fileroot + url + home;
    if (fs.existsSync(file)) {
    console.log(infoprefix + "Rendering home page")
    }else{
      console.log(errprefix + 'server can not find | ' + file +' |')
       file = fileroot+"/404.html"
    }
  }
  else{
    var file = fileroot+url
    if (fs.existsSync(file)) {
      console.log(infoprefix + "| " + file + ' | is a valid file')
    }
   else{
    console.log(errprefix + 'server can not find |' + file +' |')
     file = fileroot+"/404.html"
   }
  }
  // render file
  fs.readFile(file, function(err, data) {
if(file.endsWith(".html")){
  res.writeHead(200, {'Content-Type': 'text/html'});
}else if(file.endsWith(".css")){
    res.writeHead(200, {'Content-Type': 'text/css'});
}
  if (err) throw err;
  res.write(data);
  return res.end();
  });
  console.log(reqprefix + url)

}).listen(settings.port);   
console.log(infoprefix + "Server ready on port:" + settings.port)
}