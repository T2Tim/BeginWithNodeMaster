
$(document).ready(function(){
    //wire up some event listeners
    $("#homePage").click(function(){
        PageMethods.buildPostsPreview();
    });

    $("#showPosts").click(function(){
        PageMethods.showAllPostsPreview();
    });

    $("#addPost").click(function(){
        PageMethods.showAddPost();
    });

    //and then load some posts
    PageMethods.buildPostsPreview();
});




