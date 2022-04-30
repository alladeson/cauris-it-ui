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
            e.value ? location.href = "/dashboard" : '';
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
    saRemoveParams: function(el, title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
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
                systemParamsWizard.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                systemParamsWizard.saError(notitle, notext);
        });
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
    submitFormDataNew: function() {
        var data = systemParamsWizard.dataFormat()
        console.log(data)
        systemParamsWizard.request(URL_POST_ITEM, 'POST', data).then(function(data) {
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
        GlobalScript.request(URL_POST_ITEM, 'POST', data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            systemParamsWizard.saSuccesSystemParams("Succès !", "Enregistrement effectué avec succès.")
            $("form#societe-form")[0].reset()
            $("form#emecef-form")[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            systemParamsWizard.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
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
        var data = systemParamsWizard.dataFormat()
        console.log(data);
        if (data) {
            $.each(JSON.parse(data), function(key, value) {
                if (!value && key != "rcm") {
                    console.log("valeur manquante : " + key)
                    systemParamsWizard.saError("Erreur !", "L'enregistrement ne peut aboutir pour manque d'informations")
                    save = false;
                    return save;
                } else {
                    save = true;
                }
            })
        }
        if (save) systemParamsWizard.submitFormData();
    }
};
$(document).ready(function() {
    systemParamsWizard.choicesJsInit();
});