﻿function pushNotify(icon, title, message, delay, type) {
    $.notify({
        delay: delay,
        icon: icon,
        title: title,
        message: message
    }, {
        offset: { x: 10, y: 60 },
        animate: {
            enter: 'animated tada',
            exit: 'animated fadeOutDownBig'
        },
        type: type ? type : 'info'
    });
}
