const ws = require('ws');
const ploycon = require('polyconjs');
const http = require('http');

const infoprefix = "{INFO}";
const reqprefix = "{REQUEST}";
const errprefix = "{ERROR}";

exports.default = function (ploy, settings) {
var db = new ploycon(ploy.addr+":"+ploy.port,"");
// create websocket server
const wsserv = http.createServer();
wsserv.listen(settings.port);
const wss = new ws.Server({ server: wsserv });
console.log(infoprefix+"polyconnector ready on port:" + settings.port)
// on connection
wss.on('connection', async function connection(ws) {
    console.log(infoprefix+"New connection")
    // on message
    ws.on('message', async function incoming(message) {
        var msg = JSON.parse(message);
        console.log(reqprefix)
        console.log(msg)
        if(msg.channel == "login"){
            db = new ploycon(ploy.addr+":"+ploy.port,msg.key);
            await db.open().catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"login",status:"error",error:err}))
            }).then(function(data){
                ws.send(JSON.stringify({channel:"login",status:"success"}))
            })   
        }
        else if(msg.channel == "get"){
            if(msg.mode == "all"){
            db = new ploycon(ploy.addr+":"+ploy.port,msg.key);
            await db.open().catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"get",status:"error",error:err}))
            })
            let data = await db.retrieve(msg.database).catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"get",status:"error",error:err}))
            })
            let schema = await db.getschema(msg.database).catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"get",status:"error",error:err}))
            })
                ws.send(JSON.stringify({channel:"get",mode:"all",status:"success",data:data,schema:schema}))
        }
        else if(msg.mode == "object"){
        db = new ploycon(ploy.addr+":"+ploy.port,msg.key);
        await db.open().catch(function(err){
            console.log(errprefix+err)
            ws.send(JSON.stringify({channel:"get",status:"error",error:err}))
        })
        let schema = await db.getschema(msg.database).catch(function(err){
            console.log(errprefix+err)
            ws.send(JSON.stringify({channel:"get",status:"error",error:err}))
        })
        let colname = schema[msg.col]
        let data = await db.retrieve(msg.database,msg.row,colname).catch(function(err){
            console.log(errprefix+err)
            ws.send(JSON.stringify({channel:"get",status:"error",error:err}))
        })
        ws.send(JSON.stringify({channel:"get",mode:"object",status:"success",data:data}))
    }
    }else if(msg.channel == "edit"){
        if(msg.mode == "schema"){
            db = new ploycon(ploy.addr+":"+ploy.port,msg.key);
            await db.open().catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"edit",status:"error",error:err}))
            })

            msg.schema = JSON.stringify(msg.schema)
            let data = await db.record(msg.database,"schema",undefined,msg.schema).catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"edit",status:"error",error:err}))
            })
            ws.send(JSON.stringify({channel:"edit",mode:"schema",status:"success"}))
        }else if(msg.mode == "row"){
            db = new ploycon(ploy.addr+":"+ploy.port,msg.key);
            await db.open().catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"edit",status:"error",error:err}))
            })
            let e = JSON.parse(msg.data)
            for (const [key, value] of Object.entries(e)) {
                console.log(key, value);
            let data = await db.record(msg.database,msg.row,key,value).catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"edit",status:"error",error:err}))
            })
        }
            ws.send(JSON.stringify({channel:"edit",mode:"row",status:"success"}))
        }else if(msg.mode == "add"){
            db = new ploycon(ploy.addr+":"+ploy.port,msg.key);
            await db.open().catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"edit",status:"error",error:err}))
            })
            let e = JSON.parse(msg.data)
            console.log(e)
            let data = await db.append(msg.database,e).catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"edit",status:"error",error:err}))
            })
            ws.send(JSON.stringify({channel:"edit",mode:"add",status:"success"}))
        }else if(msg.mode == "delete"){
            db = new ploycon(ploy.addr+":"+ploy.port,msg.key);
            await db.open().catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"edit",status:"error",error:err}))
            })
            let data = await db.record(msg.database,msg.row,undefined,undefined).catch(function(err){
                console.log(errprefix+err)
                ws.send(JSON.stringify({channel:"edit",status:"error",error:err}))
            })
            ws.send(JSON.stringify({channel:"edit",mode:"delete",status:"success"}))
        }
    }
    });
});

}