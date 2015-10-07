

var PageAPIs = {

    getPosts: function(pCallback) {
        $.ajax({
            method: "GET",
            url: "/api/posts",
        }).done(function(data) {
            if (data.result){
                return pCallback(null, data.data);
            }
            return pCallback(data.msg);
        }).error(function(err){
            return pCallback(err);
        });
    },

    getPostById: function(pId, pCallback) {
        $.ajax({
            method: "GET",
            url: "/api/posts/" + pId,
        }).done(function(data) {
            if (data.result){
                return pCallback(null, data.data);
            }
            return pCallback(data.msg);
        }).error(function(err){
            return pCallback(err);
        });
    },

    addPost: function(post, pCallback){
        $.ajax({
            method: "POST",
            url: "/api/posts",
            data: post,
        }).done(function(data) {
            if (data.result){
                return pCallback(null, data.data);
            }
            return pCallback(data.msg);
        }).error(function(err){
            return pCallback(err);
        });
    }
};

var PageMethods = {

    clearForm: function(){
        $("#postTitle").val("");
        $("#postAuthor").val("");
        $("#postLink").val("");
        $("#postPreview").val("");
        $("#msg").html("");

    },

    buildPostsPreview: function(){
        PageAPIs.getPosts(function(err, data){
            $("#body").empty();

            if (data.length > 0){
                for (var i = 0; i < 2; i++){
                    if (data[i]){
                        $("#body").append(PageHelpers.previewBuilder(data[i]['title'],data[i]['author'],data[i]['post'], data[i]['id']));
                    }
                }
                $(".postBox").click(function(){
                    var id =  $(this).attr("id");
                    PageMethods.showPostById(id);
                });
            }

        });
    },

    showAllPostsPreview: function(){
        PageAPIs.getPosts(function(err, data){
            $("#body").empty();
            for (var i = 0; i < data.length; i++) {
                $("#body").append(PageHelpers.previewBuilder(data[i]['title'], data[i]['author'], data[i]['post'], data[i]['id']));
            }
            $(".postBox").click(function(){
                var id =  $(this).attr("id");
                PageMethods.showPostById(id);
            });
        });
    },

    showPostById: function(postId){
        PageAPIs.getPostById(postId, function(err, data){
            if (err){
                $("#msg").html(err);
            }
            else {
                $("#body").empty();
                $("#body").append(PageHelpers.getPost(data['title'],data['author'],data['post'], data['id'], data['link']));
            }
        });
    },

    addPost: function(){
        var title = PageHelpers.getInputData("postTitle");
        var author = PageHelpers.getInputData("postAuthor");
        var link = PageHelpers.getInputData("postLink");
        var post = PageHelpers.getInputData("postPreview");

        if (title && author && link && post){
            PageAPIs.addPost({title: title, author: author, link: link, post: post}, function(err, result){
                if (err){
                    $("#msg").html(err);
                }
                else {
                    PageMethods.clearForm();
                    $("#msg").html("Post Saved!");
                }
            });
        }
    },

    showAddPost: function(){
        $("#body").empty();
        $("#body").append(PageHelpers.getAddForm());
        $("#clearForm").click(function(){
            PageMethods.clearForm();
        });

        $("#submitForm").click(function(){
            PageMethods.addPost();
        });

    }
};

var PageHelpers = {

    getInputData: function(pId){
        var el = document.getElementById(pId);
        if (el && el.value && el.value.length > 0){
            return el.value;
        }
        return false;
    },

    previewBuilder: function(title, author, post, postId){
        var mainDiv = document.createElement('div');
        mainDiv.className = 'postBox';
        mainDiv.id = postId;

        var titleDiv = document.createElement('div');
        titleDiv.className = 'postTitle';
        titleDiv.innerHTML  = title;

        var authorDiv = document.createElement('div');
        authorDiv.className = 'postAuthor';
        authorDiv.innerHTML  = author;

        var postDiv = document.createElement('div');
        postDiv.className = 'postData';
        postDiv.innerHTML  = this.postTrimmer(post);

        //add them all in
        mainDiv.appendChild(titleDiv);
        mainDiv.appendChild(authorDiv);
        mainDiv.appendChild(postDiv);

        return mainDiv;
    },

    postTrimmer: function(post){
        var position = 100;
        while (true) {
            if (post.charAt(position) === ' '){
                post = post.substr(0, position) + '...';
                return post;
            }
            else {
                if (position > post.length){
                    return post;
                }
                position++;
            }
        }
    },

    getPost: function(title, author, post, postId, link) {
        var mainDiv = document.createElement('div');
        mainDiv.className = 'postBox';
        mainDiv.id = postId;

        var titleDiv = document.createElement('div');
        titleDiv.className = 'postTitle';
        titleDiv.innerHTML = title;

        var alink = document.createElement('a');
        alink.href = link;
        alink.target = "_blank";
        alink.innerHTML = link;

        var authorDiv = document.createElement('div');
        authorDiv.className = 'postAuthor';
        authorDiv.innerHTML = author;

        var postDiv = document.createElement('div');
        postDiv.className = 'postData';
        postDiv.innerHTML = post;

        //add them all in
        mainDiv.appendChild(titleDiv);
        mainDiv.appendChild(alink);
        mainDiv.appendChild(authorDiv);
        mainDiv.appendChild(postDiv);

        return mainDiv;
    },

    getAddForm: function(){
        return '<div class="addPost">' +
                '<label>Title:</label>' +
                '<input type="text" id="postTitle" size="65" />' +
                '<br /><br />' +
                '<label>Author:</label>' +
                '<input type="text" id="postAuthor" size="65" />' +
                '<br /><br />' +
                '<label>Link:</label>' +
                '<input type="text" id="postLink" size="65" />' +
                '<br /><br />' +
                '<label>Preview:</label>' +
                '<textarea id="postPreview" rows="10" cols="65" />' +
                '<br /><br />' +
                '<div class="link" id="submitForm">Submit</div>' +
                '<div class="link" id="clearForm">Clear</div>' +
                '</div>' +
                '</div>';
    }

}