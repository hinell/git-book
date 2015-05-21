var Server      = require("http").Server
var toObj       = function (url){ return require("url").parse(url)}
var fs          = require("fs")
var ReadFile    = fs.ReadStream
var exists      = fs.existsSync

var jade        = require("jade")
var render      = jade.renderFile
var FilesStream  = require("./files.stream/");

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
    var bundleJs         = new FilesStream("/bundle.js",{encoding:"utf8"})
        bundleJs.addFiles([
                              "./client_side/jquery/dist/jquery.min.js",
                              "./client_side/bootstrap/dist/js/bootstrap.min.js",
                              "./client_side/bin.main.js"
                          ])

        bundleJs.once("error", function (err) {
            if (err) {
                var message = "Error: "+ err.message + " | " + (typeof err)
                    console.log(message);
                    res.statusCode = 204
                    res.end(message)
            }
        })
    
        bundleCss       = new FilesStream("/bundle.css")
        bundleCss.addFiles([
                            "./client_side/bootstrap/dist/css/bootstrap.min.css",
                            "./client_side/bootstrap/dist/css/bootstrap-theme.min.css",
                            "./client_side/custom.styles.css"
                           ])

        bundleCss.once("error", function (err) {
            if (err) {
                var message = "Error: "+ err.message + " | " + (typeof err)
                    console.log(message);
                    res.statusCode = 204
                    res.end(message)
            }
        })

    this.countOfReq      = this.countOfReq || 0
    this.countOfReq++

    //log("| Accepted request[ %s ]: %s | file: %s", this.countOfReq.toString(),destPath, requiredFilePath )
         if (destPath === "/")           sendFile("./VCS.Git.Synopsis.jade", res, {encoding: "utf8"})
    else if (exists(requiredFilePath))   sendFile(requiredFilePath, res);
    else if (destPath === bundleJs.name)  bundleJs.pipe(res);
    else if (destPath === bundleCss.name) bundleCss.pipe(res);
    else {
        res.statusCode = 204
        res.end()
    }
}


    app.on("request", onRequest)
    app.on("listening", function () {log("Start listening clients on " + app.host + ":" + app.port.toString())})
    app.listen(app.port, app.host)
    var executor = require("child_process").exec
    executor.apply(null, ['start http://kronos.io', []])