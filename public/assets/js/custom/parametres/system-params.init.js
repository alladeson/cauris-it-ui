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
                itemSelectText: 'Appuyez pour sélectionner',
                position: "auto",
                removeItemButton: true,
                duplicateItemsAllowed: !1,
                shouldSort: false,
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
    submitFormDataNew: function() {
        var data = systemParamsWizard.dataFormat()
        console.log(data)
        GlobalScript.request(URL_PUT_ITEM, 'PUT', data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
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
            console.log(data)
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
            console.log(data)
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
        console.log(data);
        if (data) {
            $.each(JSON.parse(data), function(key, value) {
                if (!value && !($.inArray(key, ['createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'rcm', 'tokenTmp']) > -1)) {
                    console.log(key)
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
        console.log("sendMail = " + sendMail);
        // Url d'impression et nom du fichier
        var printPdfUrl = URL_PRINT_CONFIG_REPORT.replace("__status__", sendMail);
        var reportName = CONFIG_REPORT_NAME;
        // Lancement de l'impression du rapport et de son affichage
        GlobalScript.showPrintedFile(printPdfUrl, "GET", null, reportName, "l'impression du rapport", "alertify");
    }
};
$(document).ready(function() {
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