// required global variables: albumId, userId 

var commentsModel = {
    comments: ko.observableArray(),
    isCommentsLoaded: ko.observable(false),
    removeButton: function (comment) {
        $.ajax({
            method: 'DELETE',
            url: '/api/Comments/' + comment.commentId,
            success: function () {
                commentsModel.comments.remove(comment);
                commentsHub.server.deleteComment(comment.commentId);;
            },
            error: errorHandler
        });
    },
    sendButton: function () {
        var commentHtml = $('#write_comment').summernote('code');
        if (commentHtml) {
            $.ajax({
                type: 'POST',
                url: '/api/Comments',
                data: {
                    comment: commentHtml,
                    id: albumId
                },
                success: function (comment) {
                    $('#write_comment').summernote('code', '');
                    commentsModel.comments.unshift(comment);
                    commentsHub.server.addComment(comment.commentId);
                },
                error: errorHandler
            });
        } else {
            pushNotify('fa fa-warning', '',
                ' Empty comments is not allowed', 5000, 'danger');
        }
    },
    fadeIn: function (element) {
        $(element).addClass('fadeInLeft');
        $(element).css('animation-duration', '.6s');
    },
    fadeOut: function (element) {
        $(element).addClass('fadeOutRight');
        $(element).css('animation-duration', '.6s');
        $('body').css('overflow', 'hidden');
        
        setTimeout(() => { $(element).remove(); $('body').css('overflow', ''); }, 600);
    }
}

var photoModel = {
    photos: ko.observableArray(),
    isPhotosLoaded: ko.observable(false)
}

ko.applyBindings(photoModel, document.getElementById('photo_container'));
ko.applyBindings(commentsModel, document.getElementById('comments_block'));

var commentsHub = $.connection.commentsHub;

commentsHub.client.deleteComment = function (commentId) {
    var comment = ko.utils.arrayFirst(commentsModel.comments(),
        (c) => c.commentId == commentId)
    pushNotify('fa fa-remove', '',
        ' Comment from <strong>' + comment.userName + '</strong> was removed', 5000);
    commentsModel.comments.remove(comment);
}

commentsHub.client.getLastComment = function (commentId) {
    $.ajax({
        type: 'GET',
        url: '/api/Comments',
        data: { commentId: commentId },
        dataType: 'json',
        success: function (comment) {
            if (comment != null) {
                commentsModel.comments.unshift(comment);
                pushNotify('fa fa-pencil', '',
                    ' New comment from <strong>' + comment.userName + '</strong>', 5000);
            }
        },
        error: errorHandler
    });
}

$(function () {
    $.get({
        url: '/api/Photos',
        data: { albumId: albumId },
        success: function (photos) {
            ko.utils.arrayPushAll(photoModel.photos, photos);
        },
        complete: function () {
            photoModel.isPhotosLoaded(true);
        },
        error: errorHandler
    });

    $.get({
        url: '/api/Comments',
        data: { albumId: albumId, mark: 0 },
        success: function (comments) {
            $('#comments').show();
            ko.utils.arrayPushAll(commentsModel.comments, comments);
        },
        complete: function () {
            commentsModel.isCommentsLoaded(true);
        },
        error: errorHandler
    });

    $('#write_comment').summernote({
        minHeight: 100,
        placeholder: 'Write your comment here ...',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['color', ['color']],
            ['picture', ['link', 'picture']]
        ],
    });
    $('#write_comment').summernote('code', '');   // remove spinner
    $('#send_button_block').show();

    $.connection.hub.start();
});
