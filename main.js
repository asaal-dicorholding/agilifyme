
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'de', layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT}, 'google_translate_element');
}

const AVAILABLE_LANGUAGES = ["en", "fr", "es"];
let domain = '.agilify.me';

document.addEventListener("DOMContentLoaded", init);

function init() {

    const languageCookie = readCookie("googtrans")?.split('/')[2];
    if (window.location.href.includes('agilifyme.webflow.io')) domain = '.webflow.io';

    if (!languageCookie) {

        const browserLang = navigator.language || navigator.userLanguage; 
        // for languages like "en-uk"
        const browserLangSplit = browserLang.split('-')[0];

        if (browserLangSplit !== "de") {
            if (AVAILABLE_LANGUAGES.indexOf(browserLangSplit) > -1) {
                setCookie("googtrans", `/de/${browserLangSplit}`, "Session", "/", domain);
                setCookie("googtrans", `/de/${browserLangSplit}`, "Session", "/");
            } else {
                // default language is english if browser language is not available as translation
                setCookie("googtrans", '/de/en', "Session", "/", domain);
                setCookie("googtrans", '/de/en', "Session", "/");
            }
        } else {
            // remove cookies if german is browser language
            setCookie("googtrans", "", 0, "/", domain);
            setCookie("googtrans", "", 0, "/");
            // set url for german video 
            const url = 'https://www.youtube-nocookie.com/embed/aFyo9i6ZHsM';
            document.getElementById('video_iframe').src = url;

        }
    }
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function triggerHtmlEvent(element, eventName) {
    var event;
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
        element.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventType = eventName;
        element.fireEvent('on' + event.eventType, event);
    }
}

jQuery('.lang-select').click(function() {

    let domain = '.agilify.me';
    if (window.location.href.includes('agilifyme.webflow.io')) domain = '.webflow.io';

    var theLang = jQuery(this).attr('data-lang');
    jQuery('.goog-te-combo').val(theLang);

    if (theLang === 'de') {
        setCookie("googtrans", "", 0, "/", domain);
        setCookie("googtrans", "", 0, "/");
        const url = 'https://www.youtube-nocookie.com/embed/aFyo9i6ZHsM';
        document.getElementById('video_iframe').src = url;
    } else {
        const url = 'https://www.youtube-nocookie.com/embed/qBN5rknnWgc';
        document.getElementById('video_iframe').src = url;
    }
    window.location = jQuery(this).attr('href');
    location.reload();
});

function setCookie(b, h, c, f, e) {
    var a;

    if (c === 0) {
        a = ""
    } else {
        var g = new Date();
        g.setTime(g.getTime() + (c * 24 * 60 * 60 * 1000));
        a = "expires=" + g.toGMTString() + "; "
    }
    var e = (typeof e === "undefined") ? "" : "; domain=" + e;
    document.cookie = b + "=" + h + "; " + a + "path=" + f + e
}

$('.custom-button').on('click', function (evt) {
    $('.target-tab-link').triggerHandler('click');
});