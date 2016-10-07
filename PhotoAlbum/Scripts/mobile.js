function errorHandler(e) {
    alert(e.status + " - " + e.statusText);
    console.log(e.responseText);
}

var voteFlag = false;
var rateModel;

function rateController(id, rating) {
    rateModel.rate = rating;
    if (!voteFlag) {
        $.post({
            url: "/api/Ratings",
            data: rateModel,
            success: function (data) {
                voteFlag = true;
                rateModel = data
                $.notify({
                    delay: 3000,
                    icon: 'fa fa-star',
                    title: '<strong> ' + rateModel.rate + ' stars!</strong>',
                    message: 'Your rating was accepted.'
                }, {
                    offset: { x: 10, y: 60 },
                    animate: {
                        enter: 'animated fadeInLeftBig',
                        exit: 'animated fadeOutDownBig'
                    },
                });
            },
            error: errorHandler
        });
    } else {
        $.ajax({
            type: 'PUT',
            url: "/api/Ratings",
            data: rateModel,
            success: function () {
                $.notify({
                    delay: 3000,
                    icon: 'fa fa-star',
                    title: '<strong> ' + rateModel.rate + ' stars!</strong>',
                    message: 'Your rating was updated.'
                }, {
                    offset: { x: 10, y: 60 },
                    animate: {
                        enter: 'animated fadeInLeftBig',
                        exit: 'animated fadeOutDownBig'
                    },
                });
            },
            error: errorHandler
        });
    }
}

// init ratebox
$(function () {
    $.get({
        url: "/api/Ratings",
        data: {
            "albumId": albumId,
            "userId": userId
        },
        success: function (data) {
            if (data.id != 0) {
                voteFlag = true;
            } else {
                data.albumId = albumId;
                data.applicationUserId = userId;
            }
            rateModel = data;
            $("div.ratebox").attr("data-rating", data.rate);

            $('.ratebox').raterater({
                submitFunction: 'rateController',
                allowChange: true,
                starWidth: 50,
                spaceWidth: 5,
                numStars: 5,
                step: 0.5
            });
        },
    });
});


var commentsModel = {
    myObservableArray: ko.observableArray(),
    removeButton: function (sender) {
        alert(sender.target.id);
    }
}
ko.applyBindings(commentsModel);

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
        //var obj = {
        //    commentHtml: commentHtml,
        //    albumId: Number(albumId)
        //};
        var obj = {
            "comment": commentHtml,
            "id": albumId
        };
        $.ajax({
            type: 'POST',
            url: '/api/Comments',
            data: obj,
            //data: { data: 'qwerty' },
            success: function (data) {
                $('#comments').prepend(insertCommentInMarkup(data));
                updateCommentsDeleteButton();
                commentsHub.server.addComment($('.delete-comment.close').first().attr('id'));
            },
            error: function (e, a, b) {
                alert(e.status);
                alert(e.statusText);
                alert(e.responseText);
                console.log(e.responseText);
            }
        });
    });

    GetComments();

    //$(window).scroll(function () {
    //    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 1) {
    //        GetComments();
    //    }
    //});

    //function insertCommentInMarkup(comment) {
    //    var str = '<div class="comment-block" id="comment_' + comment.commentId + '">\
    //       <div class="well well-lg">\
    //           <div class="row">\
    //               <div class="col-md-6">\
    //                   <span class="glyphicon glyphicon-user"></span>' + comment.userName + '\
    //               </div>\
    //               <div class="col-md-6">\
    //                   <div class="text-right">\
    //                       ' + comment.dateTime;
    //    if (userName == comment.userName) {
    //        str += '<button id="' + comment.commentId + '" style="margin-left: 10px" type="button" class="delete-comment close">&times;</button>'
    //    }
    //    str += '\
    //                   </div>\
    //               </div>\
    //           </div>\
    //           <div class="">\
    //               ' + comment.comment + '\
    //           </div></div></div>';
    //    return str;
    //}

    function GetComments() {
        $.ajax({
            type: 'GET',
            url: '/api/Comments',
            data: { albumId: albumId, mark: 0 },
            dataType: 'json',
            success: function (data) {
                if (data != null) {
                    for (var i = 0; i < data.length; ++i) {
                        //$('#comments').append(insertCommentInMarkup(data[i]));
                        commentsModel.myObservableArray.push(data[i]);
                    }

                    //updateCommentsDeleteButton();
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
        placeholder: "Write your comment here ...",
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['color', ['color']],
            ['picture', ['link', 'picture', 'video']]
            //['misc', ['undo', 'redo']]
        ],
    });

    commentsHub.client.deleteComment = function (commentId) {
        // $('#' + commentId).closest('.comment-block').remove();
        $("#comment_" + commentId).remove();
    }

    commentsHub.client.updateLastComment = function (commentId) {
        $.ajax({
            type: 'GET',
            url: '/api/Comments',
            data: { "commentId": commentId },
            dataType: 'json',
            success: function (data) {
                if (data != null) {
                    $('#comments').prepend(insertCommentInMarkup(data));
                    updateCommentsDeleteButton();
                }
            },
            error: function () {
            }
        });
    }
});


function updateCommentsDeleteButton() {
    $('.delete-comment.close')
        .each(function (index) {
            $(this).unbind("click");
            $(this)
                .click(function (e) {
                    var btn = $(this);
                    var i_d = $(this).attr('id');
                    $.ajax({
                        method: 'DELETE',
                        url: '/api/Comments/' + $(this).attr('id'),
                        //data: { commentId: $(this).attr('id') },
                        //dataType: 'html',
                        success: function () {
                            btn.closest('.comment-block').remove();
                            commentsHub.server.deleteComment(btn.attr('id'));
                        },
                        error: function (e) {
                            alert(e.status);
                            alert(e.statusText);
                            console.log(e.responseText);
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
