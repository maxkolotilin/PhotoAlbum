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
        var commentHtml = $('#write-comment').summernote('code');
        if (commentHtml) {
            $.ajax({
                type: 'POST',
                url: '/api/Comments',
                data: {
                    comment: commentHtml,
                    id: albumId
                },
                success: function (comment) {
                    $('#write-comment').summernote('code', '');
                    commentsModel.comments.unshift(comment);
                    commentsHub.server.addComment(comment.commentId);
                },
                error: errorHandler
            });
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
    },
}

var photoModel = {
    photos: ko.observableArray(),
    isPhotosLoaded: ko.observable(false)
}

ko.applyBindings(photoModel, document.getElementById('photo_container'));
ko.applyBindings(commentsModel, document.getElementById('comments_block'));

var commentsHub = $.connection.commentsHub;

commentsHub.client.deleteComment = function (commentId) {
    commentsModel.comments.remove(function (comment) {
        return comment.commentId == commentId;
    });
}

commentsHub.client.updateLastComment = function (commentId) {
    $.ajax({
        type: 'GET',
        url: '/api/Comments',
        data: { commentId: commentId },
        dataType: 'json',
        success: function (comment) {
            if (comment != null) {
                commentsModel.comments.unshift(comment);
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

    $('#write-comment').summernote({
        minHeight: 100,
        placeholder: 'Write your comment here ...',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['color', ['color']],
            ['picture', ['link', 'picture']]
        ],
    });
    $('#write-comment').summernote('code', '');
    $('#send_button_block').show();

    $.connection.hub.start();
});
