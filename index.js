
var Server      = require("http").Server
var toObj       = function (url){ return require("url").parse(url)}
var fs          = require("fs")
var ReadFile    = fs.ReadStream
var exists      = fs.existsSync

var jade        = require("jade")
var render      = jade.renderFile
var Aggregator  = require("./FilesStream/");

var extname     = require("path").extname
var join        = require("path").join
var log         = global.log =  console.log;
var app         = new Server()
    app.port    = 80
    app.host    = "127.0.0.1"




var sendFile    = function (filePath,destination,opt) {
    var isJadeFile  = extname(filePath)  === ".jade"
    if (isJadeFile) {
        var html = jade.renderFile(filePath)
            destination.end(html)
        return
    } else {
        var fileSteam = new ReadFile(filePath, opt)
            fileSteam.pipe(destination)
    }
}

var onRequest = function (req, res) {
    if (!(req.method === "GET" )) return;
    var destPath         = toObj(req.url).path
    var requiredFilePath = join("./client_side/bootstrap/dist",destPath)
    var bundlejs         = new Aggregator("/bundle.js",{encoding:"utf8"})
        bundlejs.addFiles([
                              "./client_side/jquery/dist/jquery.min.js",
                              "./client_side/bootstrap/dist/js/bootstrap.min.js",
                              "./client_side/binary.js"
                          ])
        bundlejs.once("error", function (err) {
            if (err) {
                console.log("Error: %s | \r\n",err.message,typeof err);
                res.statusCode = 204
                res.end()
            }
        })

    this.countOfReq      = this.countOfReq || 0
    this.countOfReq++

    //log("| Accepted request[ %s ]: %s | file: %s", this.countOfReq.toString(),destPath, requiredFilePath )
         if (destPath === "/")           sendFile("./VCS.Git.Synopsis.jade", res, {encoding: "utf8"})
    else if (exists(requiredFilePath))   sendFile(requiredFilePath, res);
    else if (destPath === bundlejs.name) bundlejs.pipe(res);
    else {
        res.statusCode = 204
        res.end()
    }
}
var onListen = function () {log("Start listening clients on " + app.host + ":" + app.port.toString())}
    app.on("request", onRequest)
    app.on("listening", onListen)
    app.listen(app.port, app.host)
    var executor = require("child_process").exec
    executor.apply(null, ['start http://kronos.io', []])