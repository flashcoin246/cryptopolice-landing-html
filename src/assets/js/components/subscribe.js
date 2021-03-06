$(function () {
    "use strict";

    function markSubscribed() {
        Cookies.set('subscribed', '1', { expires: 3650 });
    }

    $('form[data-js-subscribe]').submit(function (event) {
        event.preventDefault();
        var $form = $(this);
        $.post({
            url: appApiHost("/subscribe", "v2.0"),
            data: appFormHelpers.getJson($form, ['Name', 'Email']),
            headers: appFormHelpers.captchaHeader($form)
        }).done(function () {
            showAppAlert('success', ['Please check you e-mail for confirmation link']);
            $('#subscribe_modal').remodal().close();
            $form[0].reset();
            markSubscribed();
        })
        .fail(jqXhrErrorHandler)
        .always(function () {
            grecaptcha.reset()
        })
    });

    var results = new RegExp('[\?&]subscribe=([^&#]*)').exec(window.location);
    if (results && results[1]) {
        $.post(appApiHost("/subscribe/confirm/" + results[1], "v1.0"))
            .done(function () {
                showAppAlert('success', ['Thank you, you are now subscribed.']);
                markSubscribed();
                history.replaceState(null, null, '/');
            }).fail(jqXhrErrorHandler);
    }
})