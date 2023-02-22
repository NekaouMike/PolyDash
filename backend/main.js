const ws = require('ws');
const ploycon = require('ployconjs');
const http = require('http');

exports.default = function (ploy, settings) {
var db = new ploycon(ploy.addr+":"+ploy.port,"");
// create websocket server
const wsserv = http.createServer();
wsserv.listen(settings.port);
const wss = new ws.Server({ server: wsserv });
console.log("Server ready on port:" + settings.port)
// on connection
wss.on('connection', async function connection(ws) {
    console.log("New connection")
    // on message
    ws.on('message', async function incoming(message) {
        var msg = JSON.parse(message);
        console.log(msg)
        if(msg.channel == "login"){
            db = new ploycon(ploy.addr+":"+ploy.port,msg.key);
            await db.open().catch(function(err){
                console.log(err)
                ws.send(JSON.stringify({channel:"login",status:"error",error:err}))
            }).then(function(data){
                console.log(data)
                ws.send(JSON.stringify({channel:"login",status:"success"}))
            })   
        }
        else if(msg.channel == "get"){
            if(msg.mode == "all"){
            db = new ploycon(ploy.addr+":"+ploy.port,msg.key);
            await db.open().catch(function(err){
                console.log(err)
                ws.send(JSON.stringify({channel:"get",status:"error",error:err}))
            })
            let data = await db.retrieve(msg.database).catch(function(err){
                console.log(err)
                ws.send(JSON.stringify({channel:"get",status:"error",error:err}))
            })
            console.log(data)
            let schema = await db.getschema(msg.database).catch(function(err){
                console.log(err)
                ws.send(JSON.stringify({channel:"get",status:"error",error:err}))
            })
                ws.send(JSON.stringify({channel:"get",status:"success",data:data,schema:schema}))
        }
    }
    });
});

}