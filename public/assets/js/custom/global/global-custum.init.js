//Définition de la zone de loading
let waitMe_zone = "";
// Variable d'observation de changement dans les formulaire : utile pour gérer les mise à jour
let formChange = false;
// Définition des variable d'url d'impression et de téléchargment de la facture
let $pdfWebviwerModal = $("div.webviwer-invoice-modal");
let $pdf = "";
let $pdfDownload = "";
let downloadPdfBaseUrl = "/assets/downloads/";
let uploadPdfBaseUrl = "/assets/uploads/";
// Instanciation de l'objet d'état de l'affichage de la facture
const $initialState = {
    pdfDoc: null,
    currentPage: 1,
    pageCount: 0,
    // Le format de la facture est définie dans base.html.twig juste avant l'importation de global-custum.init.js
    zoom: formatFacture == 'A4' ? 1 : 3,
};

/**
 * Gestion d'affichage de waitMe pour les requêtes ajax de l'application
 * Si une requête ne nécessite pas de waitMe loader, mettre waitMe_zon à null
 */
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
/**
 * Gestion des élément de rigthbar pour la mise en page de l'écran
 */
$(document).ready(function() {
    let rightbar = $("div.right-bar")
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
//         let href = $(this).attr('href');
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
            bg: 'rgba(255,255,255,0.3)',
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
        let d = new Date(dateValue);
        let month = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc'];

        let date = d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
        let time = d.toLocaleTimeString().toLowerCase();
        if (datetime)
            return date + ' à ' + time
        else
            return date
    },
    dateFormatTolocalString: function(dateString=null) {
        // La date au format : 21/03/2024 21:34:38
        // Par défaut, c'est la date du jour
        let localStr = null;
        if(dateString==null)
            localStr = (new Date()).toLocaleString();
        else 
            localStr = (new Date(dateString)).toLocaleString();    
        // La date en tableau : [date, time] = ['21/03/2024', '21:34:38']
        let dateTimeArray = localStr.split(" ");
        // Reformattage de la date au format YYYY-MM-DD
        // 1. Conversion de la date en tableau : [DD, MM, YYYY] = [21, 03, 2024]
        let dateArray = dateTimeArray[0].split("/");
        // 2. Reformattage de la date : YYYY-MM-DD = 2024-03-21
        let dateStr = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
        // Reformattage de la dateTime au format yyyy-mm-ddThh:mm:ss
        let dateTimeStr = `${dateStr}T${dateTimeArray[1]}`;
        // Renvoie du format de la dateTime
        return dateTimeStr;
    },
    // Format month with label like 2022-04
    monthDateFormat(monthLabel) {
        let d = new Date(monthLabel);
        let months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

        return months[d.getMonth()] + " " + d.getFullYear();
    },
    // Format month with label like 2022-04
    statsMonthFormat(monthLabel) {
        let d = new Date(monthLabel);
        let months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juill', 'août', 'sept', 'oct', 'nov', 'déc'];
        currentYear = new Date().getFullYear();
        return $.trim(months[d.getMonth()] + " " + (currentYear == d.getFullYear() ? "" : (d.getFullYear() + "")).slice(2, 4));
    },
    /**
     * Returns a date set to the begining of the month
     * 
     * @param {Date} myDate 
     * @returns {Date}
     */
    beginningOfMonth: function(myDate) {
        let date = new Date(myDate);
        date.setDate(1)
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    },
    /**
     * Returns a date set to the end of the month
     * 
     * @param {Date} myDate 
     * @returns {Date}
     */
    endOfMonth: function(myDate) {
        let date = new Date(myDate);
        date.setDate(1); // Avoids edge cases on the 31st day of some months
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        return date;
    },
    /**
     * Format un nombre en representation française
     * @param {Number} number Le nombre à formatter
     * @param {Number} decimal Le nombre de chiffre après la virgule
     * @returns String The formatted number
     */
    numberFormat: function(number, decimal) {
        return $.number(number, decimal, ',', '.')
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
    requestGetFile: function(url, method, fileName, sendData) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: URL_GLOBAL_GET_FILE,
                method: "POST",
                data: {
                    "url": url,
                    "method": method,
                    "fileName": fileName,
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
    },
    // Récupération de la liste des objets en clé étrangère
    /**
     * 
     * @param {String} url le lien de récupération de la lise des objets 
     * @param {Array<String>} selectData Le tableau contenant les champ de l'objet à utiliser pour le champ de selection, en priori 2 : l'identifiant et le libelle. Ce tableau contient également le nom de l'entité
     * @param {Number} choicePosition la position du champ de sélection sur la vue
     * @param {Number} itemId L'identifiant de l'objet à sélectionner si existant
     */
    getForeignsData: function(url, selectData = [], choicePosition, itemId, preselect = true) {
        GlobalScript.request(url, 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJon = data;
            // console.log(dataJon);
            choices[choicePosition].clearChoices();
            if ($.inArray(selectData[0], ["catégories", "types de facture", "types de paiement", 5]) > -1 && preselect) {
                dataJon = $.map(data, function(obj, index) {
                    obj.value = obj.id
                    obj.label = obj.libelle
                    obj.selected = index ? false : true
                        // obj.disabled = index ? false : true
                    return obj
                });
            }
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
        for (let x in obj) {
            text = text.replace(new RegExp(x, 'g'), obj[x]);
        }
        return text;
    },
    formChange: function(form) {
        form.on('input change paste', ':input', (e) => {
            formChange = true;
            // console.log("change : " + e.type);
        });
    },
    traceFormChange: function(dataId) {
        if (dataId && !formChange) {
            alertify.warning("Vous n'avez rien changé. Veuillez cliquer sur fermer pour quitter");
            return true;
        }
        return false;
    },
    checkBlank: function(value) {
        if (value)
            return value;
        else
            return null;
    },
    traceUserProfileAndParamsFormChange: function(dataId) {
        if (dataId && !formChange) {
            alertify.warning("La mise à jour ne peut aboutir. Vous n'avez rien changé svp !");
            return true;
        }
        return false;
    },
    saError: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        })
    },

    /**
     * Gestion des erreur des requêtes ajax
     * @param {Objet} err L'objet error de la requête ajax
     * @param {String} alert Le type d'alerte à utiliser : Soit c'est Alertify ou c'est SweetAlert
     * @param {String} errTopic L'opération qui a suscité l'erreur
     */
    ajxRqtErrHandler: function(err, alert, errTopic) {
        // console.log(err);
        // Meessage d'erreur par défaut
        let defaultErrMessage = "Une erreur s'est produite lors de " + errTopic + ". Si cela persiste, veuillez contacter votre administrateur ou votre fournisseur du SFE. Merci !";
        // Les erreur du serveur : backend (spring-boot)  ou frontend (symfony)
        if ($.inArray(err.status, [500, 502, 503, 504]) > -1)
            defaultErrMessage = "Une erreur s'est produite lors de " + errTopic + " : le serveur ne répond pas. Si cela persiste, veuillez contacter votre administrateur ou votre fournisseur du SFE. Merci !";
        // Les erreur légitime du serveur : frontend (symfony)
        if ($.inArray(err.status, [200]) > -1)
            defaultErrMessage = "Une erreur s'est produite lors de " + errTopic + " : Votre session est expirée. Veuillez vous reconnecter svp. Merci !";
        // Essayons de transformer la réponse en objet json
        try {
            let responseText = JSON.parse(err.responseText);
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
    /**
     * Gestion global de l'apparence de l'application
     * @param {boolean} layoutChange Permet d'indiquer le changement de la disposition de l'écran : vertical ou Horizontal
     */
    layoutSettings: function(event = null, layoutChange = false) {
        if (event) event.preventDefault();
        let layout = $("div#layout-wrapper").data('userLayout');
        // Le right bar element
        let rightbar = $("div.right-bar");
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
            // console.log("OK")
            layoutChange ? window.location.href = "" : "";
            waitMe_zone = "";
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            waitMe_zone = "";
            // console.log(err);
            // GlobalScript.ajxRqtErrHandler(err, "alertify", "la mise à jour des paramètre du layout");
        });
    },
    /**
     * Envoie des requêtes de sauvegarde des paramètre de mise en page pour l'utilisateur
     * @param {Object} layout L'objet contenant les paramètres de mise en page de l'application pour un utilisateur
     * @returns Promise
     */
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
    },
    /**
     * Pour visionner la facture imprimée en pdf avant l'impression physique ou le téléchargement du pdf
     * @param {String} printPdfUrl L'url d'impression de la facture
     * @param {String} downloadPdfUrl L'url de téléchargement de la facture après son impression en pdf
     * @param {String} pdfName  Le nom du fichier pour le téléchargement
     */
    pdfwebviewer: function(printPdfUrl, dowloadPdfUrl, pdfName) {
        // Mise à jour des url d'impression et de téléchargement
        $pdf = printPdfUrl;
        $pdfDownload = dowloadPdfUrl;
        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/js/plugins/pdfjs/pdf.worker.min.js";
        // Lancement de waiteMe
        GlobalScript.run_waitMe($('body'), 1, 'stretch')
            // Lancement de l'impression de la facture
        pdfjsLib
            .getDocument($pdf)
            .promise.then((doc) => {
                // Une fois imprimée, la facture est récupérée pour la faire visionner
                $initialState.pdfDoc = doc;
                // console.log('pdfDocument', $initialState.pdfDoc);

                $('#page_count').html($initialState.pdfDoc.numPages);

                // Fonction qui rend l'affichage de la facture 
                GlobalScript.renderPage();
                // Affichage du modal contenant la facture, ce modal est inclus dans templates/admin/global-layout.html.twig
                $pdfWebviwerModal.modal("toggle");

                // Gestion des évènements essentiels et utils dans notre cas
                // Button events : Les touches de direction pour passer d'une page à l'autre
                $('#prev-page').click(GlobalScript.showPrevPage);
                $('#next-page').click(GlobalScript.showNextPage);
                // Zoom functionality : Les touches de zoom de l'affichage
                $('#zoom_in').on('click', () => {
                    if ($initialState.pdfDoc === null) return;
                    $initialState.zoom *= 3 / 2;

                    GlobalScript.renderPage();
                });

                $('#zoom_out').on('click', () => {
                    if ($initialState.pdfDoc === null) return;
                    $initialState.zoom *= 1 / 2;
                    GlobalScript.renderPage();
                });
                // La touche pour l'impression physique de la facture
                $('#pdf_printer').on('click', () => {
                    printJS({ printable: $pdfDownload, type: 'pdf', showModal: false });
                });
                // La touche pour le téléchargement de la facture en version pdf
                $("#pdf_download").click(function(event) {
                    event.preventDefault()
                    GlobalScript.saveFile(pdfName, $pdfDownload);
                });

                // Mise en pause de waitMe
                $('body').waitMe('hide')
            })
            .catch((err) => {
                alert(err.message);
            });
    },
    // Render the page.
    renderPage: function() {
        $initialState.pdfDoc
            // Load the first page.
            .getPage($initialState.currentPage)
            .then((page) => {
                const canvas = $('#canvas')[0];
                const $ctx = canvas.getContext('2d');
                const $viewport = page.getViewport({
                    scale: $initialState.zoom,
                });

                canvas.height = $viewport.height;
                canvas.width = $viewport.width;

                // Render the PDF page into the canvas context.
                const renderCtx = {
                    canvasContext: $ctx,
                    viewport: $viewport,
                };

                page.render(renderCtx);

                $('#page_num').html($initialState.currentPage);
            });
    },
    showPrevPage: function() {
        if ($initialState.pdfDoc === null || $initialState.currentPage <= 1)
            return;
        $initialState.currentPage--;

        // Render the current page.
        $('#current_page').val($initialState.currentPage);
        GlobalScript.renderPage();
    },
    showNextPage: function() {
        if (
            $initialState.pdfDoc === null ||
            $initialState.currentPage >=
            $initialState.pdfDoc._pdfInfo.numPages
        )
            return;

        $initialState.currentPage++;
        $('#current_page').val($initialState.currentPage);
        GlobalScript.renderPage();
    },
    saveFile: function(fileName, urlFile) {
        let a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);
        a.href = urlFile;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(urlFile);
        a.remove();
    },
    /**
     * Afficher la facture imprimer sur l'écran de l'application
     * @param {Object} facture L'objet de la facture à afficher
     */
    showPrintedInvoice: function(facture) {
        let printPdfUrl = URL_GLOBAL_IMPRIMER_FACTURE.replace("__id__", facture.id);
        let pdfName = "facture-" + facture.numero + ".pdf";
        // let dowloadPdfUrl = URL_GET_FILE.replace("__fileName__", pdfName);
        let dowloadPdfUrl = downloadPdfBaseUrl + pdfName;
        // GlobalScript.pdfwebviewer(printPdfUrl, dowloadPdfUrl, pdfName)
        // Envoie de la requête d'impression de la facture
        GlobalScript.requestGetFile(printPdfUrl, "GET", pdfName, null).then(function(data) {
                // Run this when your request was successful
                // console.log(data);
                // Mise à jour du titre du modal d'affichage de la facture
                $pdfWebviwerModal.find('h5.card-title').text("Facture générée");
                // Affichage de la facture
                GlobalScript.pdfwebviewer(dowloadPdfUrl, dowloadPdfUrl, pdfName)
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la génération de la facture");
            });

    },
    /** Fin de l'affichage de la facture **/

    /**
     * Afficher le bilan imprimé sur l'écran de l'application
     * @param {String} fileName Le nom du fichier pdf à afficher
     */
    showPrintedBilan: function(printPdfUrl, method, data, fileName) {
        // let printPdfUrl = URL_GET_FILE.replace("__fileName__", fileName);
        // let dowloadPdfUrl = URL_GET_FILE.replace("__fileName__", fileName);
        let dowloadPdfUrl = downloadPdfBaseUrl + fileName;
        // Envoie de la requête d'impression
        GlobalScript.requestGetFile(printPdfUrl, method, fileName, data).then(function(data) {
                // Run this when your request was successful
                // console.log(data);
                // Mise à jour du titre du modal d'affichage
                $pdfWebviwerModal.find('h5.card-title').text("Bilan périodique");
                // Affichage
                GlobalScript.pdfwebviewer(dowloadPdfUrl, dowloadPdfUrl, fileName)
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la génération du rapport du bilan");
            });
    },

    /**
     * Afficher le fichier pdf imprimé sur l'écran de l'application
     * @param {String} printPdfUrl Le lien d'impression du fichier pdf
     * @param {String} method La méthode de la requête d'impression
     * @param {String} data Le corps de la requête
     * @param {String} fileName Le nom du fichier pdf à afficher
     * @param {String} errorMessage Message d'erreur en cas d'erreur
     * @param {String} errorAlertType Le type d'alert pour le message d'erreur
     */
    showPrintedFile: function(printPdfUrl, method, data, fileName, errorMessage, errorAlertType) {
        // let printPdfUrl = URL_GET_FILE.replace("__fileName__", fileName);
        // let dowloadPdfUrl = URL_GET_FILE.replace("__fileName__", fileName);
        let dowloadPdfUrl = downloadPdfBaseUrl + fileName;
        // Envoie de la requête d'impression
        GlobalScript.requestGetFile(API_BASE_URL + printPdfUrl, method, fileName, data).then(function(data) {
                // Run this when your request was successful
                // console.log(data);
                // Affichage
                GlobalScript.pdfwebviewer(dowloadPdfUrl, dowloadPdfUrl, fileName)
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, errorAlertType, errorMessage);
            });
    }
}