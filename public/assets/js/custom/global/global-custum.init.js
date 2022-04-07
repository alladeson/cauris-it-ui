//Définition de la zone de loading
let waitMe_zone = '';

$(document).on({
    ajaxStart: function() {
        GlobalScript.run_waitMe((waitMe_zone.length ? waitMe_zone : $('body')), 1, 'win8')
    },
    ajaxStop: function() {
        (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide')
    },
});

// $(document).on(
//     "click", ".sidebar .sidebar-wrapper ul.nav li a, .navbar ul.navbar-nav li a",
//     function() {
//         var href = $(this).attr('href');
//         if (!href.startsWith('#') && href !== 'javascript:;') {
//             GlobalScript.run_waitMe($('body'), 1, 'bounce');
//         }
//     }
// );

let GlobalScript = {
    run_waitMe: function(el, num, effect, text) {
        text = (text && text != '') ? text : 'Veuillez patienter...';
        fontSize = '';
        switch (num) {
            case 1:
                maxSize = '';
                textPos = 'vertical';
                break;
            case 2:
                text = '';
                maxSize = 30;
                textPos = 'vertical';
                break;
            case 3:
                maxSize = 30;
                textPos = 'horizontal';
                fontSize = '18px';
                break;
        }
        el.waitMe({
            effect: effect,
            text: text,
            bg: 'rgba(255,255,255,0.7)',
            color: '#5156be',
            maxSize: maxSize,
            waitTime: -1,
            source: 'img.svg',
            textPos: textPos,
            fontSize: fontSize,
            onClose: function(el) {}
        });
    },
    dateFormat(dateValue, datetime = true) {
        var d = new Date(dateValue);
        var month = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc'];

        var date = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
        var time = d.toLocaleTimeString().toLowerCase();
        if (datetime)
            return date + ' à ' + time
        else
            return date
    },
    // Format month with label like 2022-04
    monthDateFormat(monthLabel) {
        var d = new Date(monthLabel);
        var months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc'];

        return months[d.getMonth()] + " " + d.getFullYear();
    },
    request: function(url, method, sendData) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: URL_GLOBAL_REQUEST,
                method: "POST",
                data: {
                    "url": url,
                    "method": method,
                    "data": sendData,
                },
                success: function(data) {
                    resolve(data) // Resolve promise and go to then()
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                },
            });
        });
    },
    /**
     * Smooth scrolling to a specific element 
     **/
    scrollTo: function(target) {
        if (target.length) {
            $("html, body").stop().animate({ scrollTop: target.offset().top }, 1500);
        }
    },
    /**
     * Smooth scrolling to the top of page !
     **/
    scrollToTop: function() {
        $("html, body").animate({ scrollTop: 0 }, 1500);
    }
}