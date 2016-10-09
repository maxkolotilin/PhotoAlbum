function deletePhoto(id) {
    $.ajax({
        url: '/Photo/DeletePhoto',
        dataType: 'html',
        data: { 'photoId': id },
        type: 'DELETE',
        success: function (data) {
            $('.close').trigger('click');
            setTimeout(() => { $('div.' + id).remove() }, 250);
        },
        error: errorHandler
    });
}

var featherEditor = new Aviary.Feather({
    apiKey: 'c24143d191244ced89942d443a94c7ce',
    theme: 'dark', // Check out our new 'light' and 'dark' themes!
    tools: 'all',
    appendTo: '',
    onSave: function (imageID, newURL) {
        var images = document.getElementsByClassName(imageID);
        for (var i = 0; i < images.length; ++i) {
            images[i].src = newURL;
        }

        $.post({
            url: '/Albums/ReplaceImage',
            dataType: 'html',
            data: { aviaryUrl: newURL, id: imageID },
            success: function (data) { },
            error: errorHandler
        });
    },
    onError: function (errorObj) {
        alert(errorObj.message);
    }
});

function launchEditor(id, src) {
    featherEditor.launch({
        image: id,
        url: src
    });

    return false;
}
