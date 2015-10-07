//TODO - 6a.Write this object

function Post(objPost){

    if(false === (this instanceof Post)){
        return new Post(objPost);
    }

    //This code gets executed on new...
    var mPost = objPost || {};

    //Public Methods
    function _isValid(){
        if (mPost.title && mPost.author && mPost.link && mPost.post && mPost.id) {
            return true;
        }
        return false;
    }

    return {
        Post: mPost,
        isValid: _isValid
    }

}

module.exports.Post = Post;