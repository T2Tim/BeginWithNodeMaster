var hapi = require('hapi');
var eventBus = require('./eventBus').EventBus();
var Inert = require('inert');
var post = require('../data/post');

/**
 * Module uses the hapi web server as an interface into the application.
 * This module should only be used once.
 * Once an request is received and validated - this interface should fire an
 * event which will be handled in the application layer. All events fired from here are
 * required to have a callback that can be called when complete. Sample Event Obj...
 *
 * Event Obj = {
 *                  action: {} //Think action code
 *                  method: {} //Optional http method
 *                  payload: any parameters / data passed in the request
 *                  Callback: function(err, data)
 *             }
 *
 *  The event that is fired, along with the action should be enough to route the request
 *  Through the application.
 *
 */

module.exports.hapiInterface = function(resourceDir, pCallback){
    var server = new hapi.Server();
    server.connection({
        port: 8080
    });

    //we register our plugin
    server.register(Inert, function () {});

    /************************* PRE Handler **********************************/

    //TODO - 6b - write this pre handler
    function getPost(req, res){
        if (req.payload){
            var newPost = new post.Post(req.payload);
            if (newPost.isValid()){
                console.log("New post built");
                return res(newPost);
            }
        }
        return res(false);
    }

    /******************* Server Extension Methods **************************/
    /*
     * Server extension that converts a payload to our payload class for easy verification and such
     */
    server.ext('onPreHandler', function (req, res) {
        //any code here executes before the route
        return res.continue();
    });

    /*
     * Wraps payload for sending according to spec with timestamp and hash
     */
    server.ext('onPreResponse', function (req, res) {
        //any code here executes after the route
        return res.continue();
    });

    /************************ Catch all not found route ****************************/
    server.route({
        method: '*',
        path: '/{p*}', // catch-all path
        handler: function (req, res) {
            console.log('(Server.NotFound) Invalid Path: ' + req.path + ' Method: ' + req.method + ' received payload: ' + JSON.stringify(req.payload) + ' from host: ' + req.info.remoteAddress);
            res('Page not found').code(404);
        }
    });

    /***************************** Traditional Web Server Routers ( **********************/
    server.route({
        method: 'GET',
        path: '/',
        config: {
            security: true
        },
        handler: function (req, res) {
            console.log("Returning index.html");
            return res.file(resourceDir + '\\html\\index.html');
        }
    });

    server.route({
        //TODO - 1.get route working
        method: 'GET',
        path: '/styles/{cssFile}',
        config: {
            security: true
        },
        handler: function (req, res) {
            console.log("Returning style sheet: " + req.params.cssFile);
            return res.file(resourceDir + '/styles/' + req.params.cssFile);
        }
    });

    //TODO - 2.Write Route
    server.route({
        method: 'GET',
        path: '/scripts/{jsFile}',
        config: {
            security: true
        },
        handler: function (req, res) {
            console.log("Returning JS file: " + req.params.jsFile);
            return res.file(resourceDir + '/scripts/' + req.params.jsFile);
        }
    });

    /*********************** API Endpoints ********************/
    //TODO - 3. build our api route (leave handler)
     server.route({
        method: 'GET',
        path: '/api/posts',
        config: {
            security: true
        },
        handler: function (req, res) {
            var obj = {
                callback: function(err, data){
                    if (err){
                        console.log("Error getting posts");
                        return res({result: false, msg: err});
                    }
                    return res({result: true, data: data});
                }
            }
            eventBus.emit('getPosts', obj);
        }
    });

    server.route({
        method: 'GET',
        path: '/api/posts/{id}',
        config: {
            security: true
        },
        handler: function (req, res) {
            //TODO - 4a.Build and emit event object
            var obj = {
                postId: req.params.id,
                callback: function(err, data){
                    if (err){
                        console.log("Error getting post " + req.params.id);
                        return res({result: false, msg: err});
                    }
                    return res({result: true, data: data});
                }
            }
            eventBus.emit('getPostById', obj);
        }
    });

    //TODO - 5a - build route
    //Build route
    server.route({
        method: 'POST',
        path: '/api/posts',
        config: {
            security: true,
            //TODO - 6c. add in post validation
            pre: [
                {method: getPost, assign: 'post'}
            ]
        },
        handler: function (req, res) {
            //truthy and falsey
            if (req.pre.post){
                var obj = {
                    post: req.pre.post,
                    callback: function(err, data){
                        if (err){
                            console.log("An error occurred submitting post");
                            return res({result: false, msg: err})
                        }
                        return res({result: true, data: data});
                    }
                }
                eventBus.emit('addPost', obj);
            }
            else {
                console.log("Invalid post");
                return res({result: false, msg: 'Invalid Post'});
            }
        }
    });

    //Start our server
    server.start(function(err){
        if (err){
            console.log(err.message || err);
            return pCallback(err, server);
        }
        else {
            console.log('(hapiWrapper) Server has started');
            return pCallback(null,server);
        }
    });
};




