var dao = require('../data/postsDAO');
var postsDao = new dao.PostsDAO();

var mod = module.exports;

mod.getPosts = function(obj){
    postsDao.getPosts(obj.callback);
}

mod.getPostById = function(obj){
    postsDao.getPosts(function(err, posts){
        for (var i = 0; i < posts.length; i++){
            if (obj.postId == posts[i].id){
                return obj.callback(null, posts[i]);
            }
        }
        return obj.callback("Post Not Found");
    });
}

//TODO 5c - handle add in a controller
mod.addPost = function(obj){
    var id = postsDao.getNextId();
    obj.post.id = id;
    postsDao.addPost(obj.post, function(err, data){
        if (err){
            console.log(err);
            return obj.callback(err);
        }
        return obj.callback(null, id);
    });
}