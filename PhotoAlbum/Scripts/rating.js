// required global variables: albumId, userId
// optional: starSize

var rateModel;

function RateModel(rating) {
    if (rating.id !== 0) {
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
                rateModel.notifyMessage, 3500);
            if (rateModel.method === 'POST') {
                rateModel.method = 'PUT';
                rateModel.notifyMessage = 'Your rating was updated';
                rateModel.rating = data;
            }
        },
        error: errorHandler
    });
}

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
                starWidth: window.starSize || 50,
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
