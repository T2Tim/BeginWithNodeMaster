var eventBus = require('./modules/eventBus').EventBus();
var hapiWrapper = require('./modules/HapiWrapper');
var postsController = require('./modules/postsController');

var App = {
    webServer: null,
    appDir: require('path').resolve(__dirname),
    init: function (){
        //start up our interface(s)
        hapiWrapper.hapiInterface(App.appDir + '\\client' ,function(err, webInterface){
            if(err){
                console.log('(App.Init) Interface Error: ' + err.message || err);
            }
            //hold a reference to our web interface
            App.webServer = webInterface;
        });
        Events.init();
    }
};

var Events = {
    init: function(){
        eventBus.on('getPosts',postsController.getPosts);
        //TODO - 4b.listen to get post
        eventBus.on('getPostById', postsController.getPostById);
        //TODO - 5b.listen to post post
        eventBus.on('addPost', postsController.addPost);
    }
};

//we start up our app
try {
    App.init();
}
catch (ex){
    console.log('(App.Startup) Startup Exception: ' + ex.message || ex)
}
