

var rateModel;

function RateModel(rating) {
    if (rating.id != 0) {
        this.method = 'PUT';
        this.notifyMessage = 'Your rating was updated';
    } else {
        this.method = 'POST';
        this.notifyMessage = 'New rating was accepted';
        rating.albumId = albumId;
        rating.applicationUserId = userId;
    }
    this.rating = rating;
};

function rateController(id, rating) {
    rateModel.rating.rate = rating;
    $.ajax({
        type: rateModel.method,
        url: '/api/Ratings',
        data: rateModel.rating,
        success: function (data) {
            pushNotify('fa fa-star', '<strong> ' + rating + ' stars!</strong>',
                rateModel.notifyMessage, 3000);
            if (rateModel.method === 'POST') {
                rateModel.method = 'PUT';
                rateModel.notifyMessage = 'Your rating was updated';
                rateModel.rating = data;
            }
        },
        error: errorHandler
    });
}

// init ratebox
$(function () {
    $.get({
        url: '/api/Ratings',
        data: {
            albumId: albumId,
            userId: userId
        },
        success: function (rating) {
            rateModel = new RateModel(rating);
            $('div.ratebox').attr('data-rating', rating.rate);

            $('.ratebox').raterater({
                submitFunction: 'rateController',
                allowChange: true,
                starWidth: 50,
                spaceWidth: 5,
                numStars: 5,
                step: 0.5
            });
        },
        complete: function () {
            $('#rating_spinner').hide();
            $('#rating_block').show();
        },
        error: errorHandler
    });
});


var commentsModel = {
    myObservableArray: ko.observableArray(),
    isCommentsLoaded: ko.observable(false),
    removeButton: function (comment) {
        $.ajax({
            method: 'DELETE',
            url: '/api/Comments/' + comment.commentId,
            success: function () {
                commentsModel.myObservableArray.remove(comment);
                commentsHub.server.deleteComment(comment.commentId);;
            },
            error: errorHandler
        });
    },
    sendButton: function () {
        var commentHtml = $('#write-comment').summernote('code');
        $('#write-comment').summernote('code', '');
        if (commentHtml) {
            $.ajax({
                type: 'POST',
                url: '/api/Comments',
                data: {
                    comment: commentHtml,
                    id: albumId
                },
                success: function (comment) {
                    commentsModel.myObservableArray.unshift(comment);
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
ko.applyBindings(commentsModel, document.getElementById('comments_block'));

var commentsHub = $.connection.commentsHub;

$(function () {
    $.ajax({
        type: 'GET',
        url: '/api/Comments',
        data: { albumId: albumId, mark: 0 },
        dataType: 'json',
        success: function (comments) {
            $('#comments').show();
            ko.utils.arrayPushAll(commentsModel.myObservableArray, comments);
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

    commentsHub.client.deleteComment = function (commentId) {
        commentsModel.myObservableArray.remove(function (comment) {
            return comment.commentId == commentId;
        });
    }

    commentsHub.client.updateLastComment = function (commentId) {
        $.ajax({
            type: 'GET',
            url: '/api/Comments',
            data: { "commentId": commentId },
            dataType: 'json',
            success: function (comment) {
                if (comment != null) {
                    commentsModel.myObservableArray.unshift(comment);
                }
            },
            error: errorHandler
        });
    }
});

var photoModel = {
    photos: ko.observableArray(),
    isPhotosLoaded: ko.observable(false)
}
ko.applyBindings(photoModel, document.getElementById('photo_container'));

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
});
