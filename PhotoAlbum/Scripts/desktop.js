var commentsHub = $.connection.commentsHub;

commentsHub.client.deleteComment = function (commentId) {
    removeCommentById(commentId);
    var userName = $('#comment_' + commentId).find('.user-name').html();
    pushNotify('fa fa-remove', '',
        ' Comment from <strong>' + userName + '</strong> was removed', 5000);
}

commentsHub.client.getLastComment = function (commentId) {
    $.ajax({
        type: 'GET',
        url: '/Albums/GetComment',
        data: { commentId: commentId },
        success: function (comment) {
            if (comment != null) {
                prependComment(comment);
                setDeleteHandler();
                var userName = $('#comments .comment-panel:first').find('.user-name').html();
                pushNotify('fa fa-pencil', '',
                    ' New comment from <strong>' + userName + '</strong>', 5000);
            }
        },
        error: errorHandler
    });
}

function fadeIn(element) {
    element.addClass('fadeInLeft');
    element.css('animation-duration', '.6s');
}

function fadeOut(element) {
    element.addClass('fadeOutRight');
    element.css('animation-duration', '.6s');
}

function removeCommentById(commentId) {
    var comment = $('#comment_' + commentId);
    fadeOut(comment);
    setTimeout(() => comment.remove(), 600);
}

function prependComment(commentMarkup) {
    $('#comments').prepend(commentMarkup);
    fadeIn($('#comments .comment-panel:first'));
}

function setDeleteHandler() {
    $('.delete-comment').each(function () {
        var deleteButton = $(this);
        deleteButton.click(function (e) {
            var buttonId = deleteButton.attr('id');
            $.ajax({
                type: 'DELETE',
                url: '/Albums/DeleteComment',
                data: { id: buttonId },
                success: function () {
                    removeCommentById(buttonId);
                    commentsHub.server.deleteComment(buttonId);
                },
                error: errorHandler
            });
        });
        deleteButton.removeClass('delete-comment');
    });
}

function writeCommentSuccessCallback(comment) {
    if (comment !== null && comment !== '') {
        prependComment(comment);
        commentsHub.server.addComment($('.delete-comment.close').first().attr('id'));
        setDeleteHandler();
        $('#comment_editor').summernote('code', '');
    } else {
        pushNotify('fa fa-warning', '',
            ' Empty comments is not allowed', 5000, 'danger');
    }
}

$(function () {
    $('#send-comment').click(function () {
        var commentHtml = $('#comment_editor').summernote('code');
        $('#comment_html').val(commentHtml);
    });

    $.ajax({
        type: 'GET',
        url: '/Albums/GetComments',
        data: { albumId: $('#album_id').val() },
        success: function (data) {
            $('#comments').append(data);
            $('#comments .comment-panel').each(function () {
                fadeIn($(this));
            });
            setDeleteHandler();
        },
        complete: function () {
            $('#comments_spinner').hide();
        },
        error: errorHandler
    });

    $('#comment_editor').summernote({
        minHeight: 100,
        placeholder: 'Write your comment here ...',
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'hr']],
            ['view', ['codeview']],
            ['help', ['help']]
        ]
    });
    $('#comment_editor').summernote('code', '');
    $('#editor_block').show();
    $('#editor_spinner').hide();

    $.connection.hub.start();
});
