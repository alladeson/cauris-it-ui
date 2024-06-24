let datatable;
let choices = [];
let save = true;
let systemParamsWizard = {
    choicesJsInit: function() {
        var e = document.querySelectorAll("[data-trigger]");
        for (i = 0; i < e.length; ++i) {
            var a = e[i];
            choices[i] = new Choices(a, {
                loadingText: 'Chargement...',
                noResultsText: 'Aucun résultat trouvé',
                noChoicesText: 'Pas de choix à effectuer',
                itemSelectText: '',
                position: "auto",
                removeItemButton: $.inArray(i, [0]) > -1 ? false : true,
                duplicateItemsAllowed: !1,
                shouldSort: false,
                searchEnabled: $.inArray(i, [0]) > -1 ? false : true,
            });
        }
    },
    saSucces: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        })
    },
    saSuccesSystemParams: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        }).then(function(e) {
            e.value ? location.href = "" : '';
        });
    },
    saError: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        })
    },
    saSetFormatFacture: function(title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
        Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: !0,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            confirmButtonClass: "btn btn-success mt-2",
            cancelButtonClass: "btn btn-danger ms-2 mt-2",
            buttonsStyling: !1,
        }).then(function(e) {
            e.value ?
                systemParamsWizard.setFormatFactureRequest(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                systemParamsWizard.saError(notitle, notext);
        });
    },
    submitFormDataNew: function() {
        var data = systemParamsWizard.dataFormat()
        // console.log(data)
        GlobalScript.request(URL_PUT_ITEM, 'PUT', data).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
                //datatable.ajax.reload();
                // categorieArticle.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
                //if (dataId) $("div.add-new-modal").modal('hide')
                //form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    submitFormData: function(event = null) {
        if (event) event.preventDefault();
        var data = systemParamsWizard.dataFormat()
        var societeForm = $("form#societe-form")
        let dataId = JSON.parse(data).id;
        GlobalScript.request(URL_PUT_ITEM.replace("__id__", dataId), 'PUT', data).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
            if (societeForm.find("input#logo").val()) systemParamsWizard.submitFormDataLogo(data);
            else systemParamsWizard.saSuccesSystemParams("Succès !", "Enregistrement effectué avec succès.")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    submitFormDataLogo: function(param) {
        var societeForm = $("form#societe-form")
        let formData = new FormData();
        let file = societeForm.find("input#logo")[0].files[0];
        formData.append("file", file);
        formData.append("fileName", "logo_" + param.id);
        formData.append("method", "PUT");
        formData.append("url", URL_PUT_SYSTEM_PARAMS_LOGO.replace("__id__", param.id));
        GlobalScript.requestFile(formData).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
            systemParamsWizard.saSuccesSystemParams("Succès !", "Enregistrement effectué avec succès.")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    dataFormat: function() {
        var societeForm = $("form#societe-form")
        var params = societeForm.data("params");
        if (societeForm.length) {
            params.name = GlobalScript.checkBlank(societeForm.find("#name").val());
            params.raisonSociale = GlobalScript.checkBlank(societeForm.find("#name").val());
            params.ifu = GlobalScript.checkBlank(societeForm.find("#ifu").val());
            params.rcm = GlobalScript.checkBlank(societeForm.find("#rcm").val());
            params.telephone = GlobalScript.checkBlank(societeForm.find("#telephone").val());
            params.email = GlobalScript.checkBlank(societeForm.find("#email").val());
            params.address = GlobalScript.checkBlank(societeForm.find("#address").val());
            params.pays = GlobalScript.checkBlank(societeForm.find("#pays").val());
            params.ville = GlobalScript.checkBlank(societeForm.find("#ville").val());
            params.tokenTmp = GlobalScript.checkBlank($.trim(societeForm.find("#tokenTmp").val()));
            return JSON.stringify(params);
        }
        return "";
    },
    onSave: function(event) {
        event.preventDefault();
        var societeForm = $("form#societe-form")
            // Vérification des infos importantes
        var data = systemParamsWizard.dataFormat();
        // Vérification du changement dans le formulaire
        if (GlobalScript.traceUserProfileAndParamsFormChange(JSON.parse(data).id)) return;
        // console.log(data);
        if (data) {
            $.each(JSON.parse(data), function(key, value) {
                if (!value && !($.inArray(key, ['createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'rcm', 'tokenTmp', 'gestionStock', 'stockEtFacture']) > -1)) {
                    // console.log(key)
                    systemParamsWizard.saError("Erreur !", "L'enregistrement ne peut aboutir pour manque d'informations")
                    save = false;
                    return save;
                } else {
                    save = true;
                }
            })
        }
        if (save) $("div.confirmModal").modal("show");
    },
    imageReset: function() {
        // $(this).parent().remove();
        // $(".imgAdd").show();
        $("div.imageUpPreview").find("input.img").val("");
        $("div.imageUpPreview").find("div.imagePreview").replaceWith(`<div class="imagePreview"></div>`);
        $("div.imageUpPreview").find("i.del").hide();
    },
    confirmPrintConfigReport: function(event = null) {
        if (event) event.preventDefault();
        $("div.configReportModal").modal("toggle");
    },
    printConfigReport: function(event = null) {
        if (event) event.preventDefault();
        var sendMail = $("div.configReportModal").find("form").find("input#sendMail").is(":checked");
        // console.log("sendMail = " + sendMail);
        // Url d'impression et nom du fichier
        var printPdfUrl = URL_PRINT_CONFIG_REPORT.replace("__status__", sendMail);
        var reportName = CONFIG_REPORT_NAME;
        // Mise à jour du titre du modal d'affichage
        $pdfWebviwerModal.find('h5.card-title').text("Rapport de configuration");
        // Lancement de l'impression du rapport et de son affichage
        GlobalScript.showPrintedFile(printPdfUrl, "GET", null, reportName, "l'impression du rapport", "alertify");
    },
    setFormatFacture: function(event = null) {
        if (event) event.preventDefault();
        systemParamsWizard.saSetFormatFacture("Êtes-vous sûr de vouloir changer le format de la facture ?", "Cette opération aura un impact global sur le système !", "Oui, changer !", "Non, annuler !", "Changé !", "Le format de la facture a été changé avec succès.", "Annulée !", "Opération annulée, rien n'a changé.");
    },
    setFormatFactureRequest: function(oktitle, oktext) {
        // Récupération de l'id de l'objet
        var format = $("#format-facture").val();
        // // console.log(format);
        GlobalScript.request(URL_PUT_SYSTEM_PARAMS_FORMAT_FACTURE.replace("__format__", format), 'PUT', null).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
            systemParamsWizard.saSuccesSystemParams(oktitle, oktext)
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la mise à jour du format de la facture");
        });
    },
};
$(document).ready(function() {
    // Initiation des champs de sélection
    systemParamsWizard.choicesJsInit();
    // Ecoute du changement du formulaire
    GlobalScript.formChange($("form#societe-form"));
    // Gestion de l'image
    $(document).on("click", "i.del", function() {
        systemParamsWizard.imageReset();
    });
    $(function() {
        $(document).on("change", ".uploadFile", function() {
            var uploadFile = $(this);
            var files = !!this.files ? this.files : [];
            if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

            if (/^image/.test(files[0].type)) { // only image file
                var reader = new FileReader(); // instance of the FileReader
                reader.readAsDataURL(files[0]); // read the local file

                reader.onloadend = function() { // set image data as background of div
                    //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                    uploadFile.closest(".imgUp").find('.imagePreview').css("background-image", "url(" + this.result + ")");
                }
                $("div.imageUpPreview").find("i.del").show();
            } else {
                systemParamsWizard.imageReset();
            }

        });
    });
});