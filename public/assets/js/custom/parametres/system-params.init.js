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
            console.log(err)
            categorieArticle.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        });
    },
    submitFormData: function() {
        var data = systemParamsWizard.dataFormat()
        var societeForm = $("form#societe-form")
        GlobalScript.request(URL_PUT_ITEM.replace("__id__", JSON.parse(data).id), 'PUT', data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            if (societeForm.find("input#logo").val()) systemParamsWizard.submitFormDataLogo(data);
            else systemParamsWizard.saSuccesSystemParams("Succès !", "Enregistrement effectué avec succès.")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            systemParamsWizard.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
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
            systemParamsWizard.saSuccesSystemParams("Succès !", "Enregistrement effectué avec succès.")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            systemParamsWizard.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        });
    },
    dataFormat: function() {
        var societeForm = $("form#societe-form")
        var params = societeForm.data("params");
        if (societeForm.length) {
            params.name = societeForm.find("#name").val();
            params.raisonSociale = societeForm.find("#name").val();
            params.ifu = societeForm.find("#ifu").val();
            params.rcm = societeForm.find("#rcm").val();
            params.telephone = societeForm.find("#telephone").val();
            params.email = societeForm.find("#email").val();
            params.address = societeForm.find("#address").val();
            params.pays = societeForm.find("#pays").val();
            params.ville = societeForm.find("#ville").val();
            return JSON.stringify(params);
        }
        return "";
    },
    onSave: function(event) {
        event.preventDefault();
        var societeForm = $("form#societe-form")

        // Vérification des infos importantes
        var data = systemParamsWizard.dataFormat()
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
        // Vérification de la pressence du logo
        // if (save && !(societeForm).find("input#logo").val()) {
        //     systemParamsWizard.saError("Erreur !", "L'enregistrement ne peut aboutir pour manque d'informations. Veuillez charger le logo");
        //     save = false;
        //     return;
        // }
        if (save) systemParamsWizard.submitFormData();
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