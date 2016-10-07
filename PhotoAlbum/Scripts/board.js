//var post = function (id, message, username, date) {
//    this.id = id;
//    this.message = message;
//    this.username = username;
//    this.date = date;
//    this.comments = ko.observableArray([]);

//    this.addComment = function (context) {
//        var comment = $('input[name="comment"]', context).val();
//        if (comment.length > 0) {
//            $.connection.boardHub.server.addComment(this.id, comment, vm.username())
//            .done(function () {
//                $('input[name="comment"]', context).val('');
//            });
//        }
//    };
//}

//var comment = function (id, message, username, date) {
//    this.id = id;
//    this.message = message;
//    this.username = username;
//    this.date = date;
//}

//var vm = {
//    posts: ko.observableArray([]),
//    notifications: ko.observableArray([]),
//    username: ko.observable(),
//    signedIn: ko.observable(false),
//    signIn: function () {
//        vm.username($('#username').val());
//        vm.signedIn(true);
//    },
//    writePost: function () {
//        $.connection.boardHub.server.writePost(vm.username(), $('#message').val()).done(function () {
//            $('#message').val('');
//        });
//    },
//}

//ko.applyBindings(vm);

//function loadPosts() {
//    $.get('/api/posts', function (data) {
//        var postsArray = [];
//        $.each(data, function (i, p) {
//            var newPost = new post(p.Id, p.Message, p.Username, p.DatePosted);
//            $.each(p.Comments, function (j, c) {
//                var newComment = new comment(c.Id, c.Message, c.Username, c.DatePosted);
//                newPost.comments.push(newComment);
//            });

//            vm.posts.push(newPost);
//        });
//    });
//}

//$(function () {
//    var hub = $.connection.boardHub;
//    $.connection.hub.start().done(function () {
//        loadPosts(); // Load posts when connected to hub
//    });

//    // Hub calls this after a new post has been added
//    hub.client.receivedNewPost = function (id, username, message, date) {
//        var newPost = new post(id, message, username, date);
//        vm.posts.unshift(newPost);

//        // If another user added a new post, add it to the activity summary
//        if (username !== vm.username()) {
//            vm.notifications.unshift(username + ' has added a new post.');
//        }
//    };

//    // Hub calls this after a new comment has been added
//    hub.client.receivedNewComment = function (parentPostId, commentId, message, username, date) {
//        // Find the post object in the observable array of posts
//        var postFilter = $.grep(vm.posts(), function (p) {
//            return p.id === parentPostId;
//        });
//        var thisPost = postFilter[0]; //$.grep returns an array, we just want the first object

//        var thisComment = new comment(commentId, message, username, date);
//        thisPost.comments.push(thisComment);

//        if (thisPost.username === vm.username() && thisComment.username !== vm.username()) {
//            vm.notifications.unshift(username + ' has commented on your post.');
//        }
//    };
//});


var commentsHub = $.connection.commentsHub;
var pageSize = 5;
var pageIndex = 0;
$(function () {


    $.connection.hub.start().done(function () {
        //GetComments(); // Load posts when connected to hub
    });


    $('#send-comment').click(function () {
        var commentHtml = $('#write-comment').summernote('code');
        $('#comment_html').val(commentHtml);
        //$.ajax({
        //    type: 'POST',
        //    dataType: 'html',
        //    data: {
        //        commentHtml: commentHtml,
        //        pageId: $('#page_id').val()
        //    },
        //    url: '/SiteProvider/WriteComment',
        //    success: function (data) {
        //        $('#comments').prepend(data);
        //        updateCommentsDeleteButton();

        //        commentsHub.server.addComment($('.delete-comment.close').first().attr('id'));
        //    },
        //    error: function () {

        //    }
        //});
    });
    GetComments();
    $(window).scroll(function () {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 1) {
            GetComments();
        }
    });

    function GetComments() {
        $.ajax({
            type: 'GET',
            url: '/Albums/GetComments',
            data: { "albumId": $('#album_id').val(), "chunkIndex": pageIndex, "chunkSize": pageSize },
            dataType: 'html',
            success: function (data) {
                if (data != null) {
                    $('#comments').append(data);
                    updateCommentsDeleteButton();
                    pageIndex++;
                }
            },
            beforeSend: function () {
                $("#progress").show();
            },
            complete: function () {
                $("#progress").hide();
            },
            error: function () {
            }
        });
    }



    $('#write-comment').summernote({
        toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        // ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video', 'hr']],
        ['view', ['codeview']],
        ['help', ['help']]
        ]
    });

    //var rating = $('#rating').rateYo({
    //    starWidth: "25px",
    //    rating: $('#vote_value').val().replace(',', '.')
    //});

    //rating.on("rateyo.set", function (e, data) {
    //    $.ajax({
    //        url: "/SiteProvider/SetVote",
    //        type: "POST",
    //        async: true,
    //        data: { pageId: $('#page_id').val(), value: data.rating },
    //        success: function () {

    //        },
    //        error: function () {

    //        }
    //    });
    //});


    commentsHub.client.deleteComment = function (commentId) {
        // $('#' + commentId).closest('.comment-block').remove();
        $("#comment_" + commentId).remove();
    }

    commentsHub.client.updateLastComment = function (commentId) {
        $.ajax({
            type: 'GET',
            url: '/Albums/GetComment',
            data: { "commentId": commentId },
            dataType: 'html',
            success: function (data) {
                if (data != null) {
                    $('#comments').prepend(data);
                    updateCommentsDeleteButton();
                }
            },
            error: function (o) {
                alert('fuck');
                alert(o);
            }
        });
    }
});


function updateCommentsDeleteButton() {
    $('.delete-comment.close')
        .each(function (index) {
            $(this)
                .click(function (e) {
                    var btn = $(this);
                    $.ajax({
                        type: 'DELETE',
                        url: '/Albums/DeleteComment',
                        data: { "id": $(this).attr('id') },
                        dataType: 'html',
                        success: function () {
                            btn.closest('.comment-block').remove();
                            commentsHub.server.deleteComment(btn.attr('id'));
                        },
                        error: function () {

                        }
                    });
                });
        });
}

function WriteCommentOnSuccess(data) {
    $('#comments').prepend(data);
    updateCommentsDeleteButton();
    commentsHub.server.addComment($('.delete-comment.close').first().attr('id'));
}
