function errorHandler(e) {
    console.log(e.responseText);
    pushNotify('', '<strong>' + e.status + ': </strong>',
        e.status == 0 ? 'No Internet connection' : e.statusText, 5000, 'danger');
}
