var fs = require('fs');

function PostsDAO(){

    if (false === (this instanceof PostsDAO)){
        return new PostsDAO();
    }

    var posts;
    loadFileSettings();

    this.getPosts = function(pCallback){
        return pCallback(null, posts.PostsDB);
    }

    this.addPost = function(post, callback){
        posts.PostsDB.push(post);
        saveSettings(function(err, result){
            if (result){
                return callback(null, true);
            }
            return callback("Post did not save");
        });
    }

    function loadFileSettings(){
        try {
            posts = JSON.parse(fs.readFileSync(__dirname + "\\data.json").toString());
        }
        catch (e) {
            posts = posts || {"PostsDB":[]};
        }
    }

    function saveSettings(pCallback){
        fs.writeFile(__dirname + "\\data.json", JSON.stringify(posts, null, 2), function(err){
            var result = true;
            if (err){
                result = false;
            }
            if (pCallback){
                return pCallback(err, result);
            }
        });
    }

    this.getNextId = function(){
        if (posts.PostsDB.length > 0){
            return posts.PostsDB[posts.PostsDB.length - 1].id + 1;
        }
        else {
            return 1;
        }
    }
}

module.exports.PostsDAO = PostsDAO;