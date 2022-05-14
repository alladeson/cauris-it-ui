let datatable;
let choices = [];
let save = true;
let newSystemParamsWizard = {
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
            e.value ? location.href = "/auth/logout" : '';
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
    submitFormData: function(event = null) {
        if (event) event.preventDefault();
        var data = newSystemParamsWizard.dataFormat()
        GlobalScript.request(URL_POST_ITEM, 'POST', data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            newSystemParamsWizard.submitFormDataLogo(data);
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
        formData.append("method", "PUT");
        formData.append("url", URL_PUT_SYSTEM_PARAMS_LOGO.replace("__id__", param.id));
        GlobalScript.requestFile(formData).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            newSystemParamsWizard.saSuccesSystemParams("Succès !", "Enregistrement effectué avec succès. Pour continuer, vous devez vous connecter à nouveau. Cliquer sur OK pour continuer...")
            $("form#societe-form")[0].reset()
            $("form#emecef-form")[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    dataFormat: function() {
        var societeForm = $("form#societe-form")
        var emecefForm = $("form#emecef-form")
        if (societeForm.length && emecefForm.length) {
            data = {
                'name': societeForm.find("#name").val(),
                'raisonSociale': societeForm.find("#name").val(),
                'ifu': societeForm.find("#ifu").val(),
                'rcm': societeForm.find("#rcm").val(),
                'telephone': societeForm.find("#telephone").val(),
                'email': societeForm.find("#email").val(),
                'address': societeForm.find("#address").val(),
                'pays': societeForm.find("#pays").val(),
                'ville': societeForm.find("#ville").val(),
                'typeSystem': emecefForm.find("#type").val(),
                'nim': emecefForm.find("#nim").val(),
                'tokenTmp': $.trim(emecefForm.find("#token").val()),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    setRecapTable: function() {
        var $showClasseTable = $('table.item-show-table');
        var societeForm = $("form#societe-form")
        var errorText = "Doit contenir une valeur";
        var errorHtml = `<span class="text-danger badge badge-soft-danger font-size-14">${errorText}</span>`
            // Société
        $showClasseTable.find('.td-name').html(societeForm.find("#name").val() ? societeForm.find("#name").val() : errorHtml);
        $showClasseTable.find('.td-ifu').html(societeForm.find("#ifu").val() ? societeForm.find("#ifu").val() : errorHtml);
        $showClasseTable.find('.td-rcm').html(societeForm.find("#rcm").val() ? societeForm.find("#rcm").val() : "-");
        $showClasseTable.find('.td-telephone').html(societeForm.find("#telephone").val() ? societeForm.find("#telephone").val() : errorHtml);
        $showClasseTable.find('.td-email').html(societeForm.find("#email").val() ? societeForm.find("#email").val() : errorHtml);
        $showClasseTable.find('.td-address').html(societeForm.find("#address").val() ? societeForm.find("#address").val() : errorHtml);
        $showClasseTable.find('.td-pays').html(societeForm.find("#pays").val() ? societeForm.find("#pays").val() : errorHtml);
        $showClasseTable.find('.td-ville').html(societeForm.find("#ville").val() ? societeForm.find("#ville").val() : errorHtml);
        // e-MECeF
        var emecefForm = $("form#emecef-form")
        $showClasseTable.find('.td-type').html(emecefForm.find("#type").val() ? emecefForm.find("#type").val() : errorHtml);
        $showClasseTable.find('.td-nim').html(emecefForm.find("#nim").val() ? emecefForm.find("#nim").val() : errorHtml);
        $showClasseTable.find('.td-token').html(emecefForm.find("#token").val() ? `<span class="text-success badge badge-soft-success font-size-14">Fourni</span>` : errorHtml);
    },
    onSave: function(event) {
        event.preventDefault();
        var societeForm = $("form#societe-form")

        // Vérification des infos importantes
        var data = newSystemParamsWizard.dataFormat()
        console.log(data);
        if (data) {
            $.each(JSON.parse(data), function(key, value) {
                if (!value && key != "rcm") {
                    newSystemParamsWizard.saError("Erreur !", "L'enregistrement ne peut aboutir pour manque d'informations")
                    save = false;
                    return save;
                } else {
                    save = true;
                }
            })
        }
        // Vérification de la pressence du logo
        if (save && !(societeForm).find("input#logo").val()) {
            newSystemParamsWizard.saError("Erreur !", "L'enregistrement ne peut aboutir pour manque d'informations. Veuillez charger le logo");
            save = false;
            return;
        }
        if (save) $("div.confirmModal").modal("show");
    },
    imageReset: function() {
        // $(this).parent().remove();
        // $(".imgAdd").show();
        $("div.imageUpPreview").find("input.img").val("");
        $("div.imageUpPreview").find("div.imagePreview").replaceWith(`<div class="imagePreview"></div>`);
        $("div.imageUpPreview").find("i.del").hide();
    }
};
$(document).ready(function() {
    newSystemParamsWizard.choicesJsInit();

    // Gestion de l'image
    $(document).on("click", "i.del", function() {
        newSystemParamsWizard.imageReset();
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
                newSystemParamsWizard.imageReset();
            }

        });
    });
});