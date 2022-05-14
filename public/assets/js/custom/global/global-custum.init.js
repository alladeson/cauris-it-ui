//Définition de la zone de loading
let waitMe_zone = '';

$(document).on({
    ajaxStart: function() {
        if (waitMe_zone != null)
            GlobalScript.run_waitMe((waitMe_zone.length ? waitMe_zone : $('body')), 1, 'stretch')
    },
    ajaxStop: function() {
        if (waitMe_zone != null)
            (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide')

        waitMe_zone = "";
    },
});

$(document).ready(function() {
    var rightbar = $("div.right-bar")
    rightbar.on("change", "input[name='layout-mode'], input[name='layout-width'], input[name='layout-position'], input[name='topbar-color'], input[name='sidebar-size'], input[name='sidebar-color']", function(event) {
        GlobalScript.layoutSettings(event);
    });
    rightbar.find("input[name='layout']").on('change', function(event) {
        GlobalScript.layoutSettings(event, true);
    });
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
                dataType: "json",
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
    requestLocal: function(url, method, sendData) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                method: method,
                dataType: "json",
                data: sendData,
                success: function(data) {
                    resolve(data) // Resolve promise and go to then()
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                },
            });
        });
    },
    requestFile: function(formData) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: URL_GLOBAL_REQUEST_FILE,
                method: "POST",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
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
    },
    // Récupération de la liste des objets en clé étrangère
    /**
     * 
     * @param {String} url le lien de récupération de la lise des objets 
     * @param {Array<String>} selectData Le tableau contenant les champ de l'objet à utiliser pour le champ de selection, en priori 2 : l'identifiant et le libelle. Ce tableau contient également le nom de l'entité
     * @param {Number} choicePosition la position du champ de sélection sur la vue
     * @param {Number} itemId L'identifiant de l'objet à sélectionner si existant
     */
    getForeignsData: function(url, selectData = [], choicePosition, itemId) {
        GlobalScript.request(url, 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJon = data;
            console.log(dataJon);
            choices[choicePosition].clearChoices();
            choices[choicePosition].setChoices(dataJon, selectData[1], selectData[2]);
            if (itemId) choices[choicePosition].setChoiceByValue(itemId);
            return true;
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération des " + selectData[0]);
            return false;
        });
    },
    /**
     * Remplacement de plusieurs caractères dans un texte
     * @param {String} text Le texte dans lequel le remplacement sera fait
     * @param {Objetct} obj Objet JSON contenant les caractères à remplacer et leur remplaçant : {"_x_": "y", "_z_": "w"}
     * @returns String Retourne le texte formaté
     */
    textMultipleReplace: function(text, obj) {
        for (var x in obj) {
            text = text.replace(new RegExp(x, 'g'), obj[x]);
        }
        return text;
    },
    saError: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        })
    },
    ajxRqtErrHandler: function(err, alert, errTopic) {
        console.log(err);
        // Meessage d'erreur par défaut
        var defaultErrMessage = "Une erreur s'est produite lors de " + errTopic + ". Si cela persiste, veuillez contacter votre administrateur ou votre fournisseur du SFE. Merci !";
        // Les erreur du serveur : backend (spring-boot)  ou frontend (symfony)
        if ($.inArray(err.status, [500, 502, 503, 504]) > -1)
            defaultErrMessage = "Une erreur s'est produite lors de " + errTopic + " : le serveur ne répond pas. Si cela persiste, veuillez contacter votre administrateur ou votre fournisseur du SFE. Merci !";
        // Essayons de transformer la réponse en objet json
        try {
            var responseText = JSON.parse(err.responseText);
            // Utilisateur non authentifié
            if (responseText.status == 401 && responseText.message.startsWith("Full authentication is required")) {
                defaultErrMessage = "Une erreur s'est produite lors de " + errTopic + " : Authentification requise.";
                return;
            }
            if (responseText.status != 500 && responseText.message)
                defaultErrMessage = "Une erreur s'est produite lors de " + errTopic + " : " + responseText.message;
        } catch (e) {
            // To do
        }
        if (alert == "sweet")
            GlobalScript.saError("Erreur !", defaultErrMessage);
        if (alert == "alertify")
            alertify.error(defaultErrMessage);
    },
    layoutSettings: function(event = null, layoutChange = false) {
        if (event) event.preventDefault();
        var layout = $("div#layout-wrapper").data('userLayout');
        // Le right bar element
        var rightbar = $("div.right-bar");
        // Formatage de données du layout
        data = {
            'id': null, // Si c'est pour la 1ère fois, le layout sera créé par le backend et mis à jour en session par Symfony
            'layout': rightbar.find("input[name='layout']:checked").val(),
            'mode': rightbar.find("input[name='layout-mode']:checked").val(),
            'width': rightbar.find("input[name='layout-width']:checked").val(),
            'position': rightbar.find("input[name='layout-position']:checked").val(),
            'topbarColor': rightbar.find("input[name='topbar-color']:checked").val(),
            'sidebarSize': rightbar.find("input[name='sidebar-size']:checked").val(),
            'sidebarColor': rightbar.find("input[name='sidebar-color']:checked").val(),
        };
        // Si le layout existe, donc c'est une mise à jour
        if (layout) {
            // Mise à jour de l'id du data, ce qui permet au backend de faire une mise à jour et non une création
            data.id = layout.id;
        }

        layout = data;
        // Envoie de la requête pour l'enregistrement des données du layout
        waitMe_zone = layoutChange ? "" : null;
        GlobalScript.requestLayoutSettings(JSON.stringify(layout)).then(function(data) {
            // Run this when your request was successful
            console.log("OK")
            layoutChange ? window.location.href = "" : "";
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err);
            // GlobalScript.ajxRqtErrHandler(err, "alertify", "la mise à jour des paramètre du layout");
        });
    },
    requestLayoutSettings: function(layout) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: URL_GLOBAL_LAYOUT_SETTINGS,
                method: "POST",
                dataType: "json",
                data: {
                    "layout": layout,
                },
                success: function(data) {
                    resolve(data) // Resolve promise and go to then()
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                },
            });
        });
    }
}