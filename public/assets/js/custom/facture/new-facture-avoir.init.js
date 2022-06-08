let datatable;
let choices = [];
let facturationForm;
let facture;
let newFactureAvoir = {
    choicesJsInit: function() {
        var e = document.querySelectorAll("[data-trigger]");
        for (i = 0; i < e.length; ++i) {
            var a = e[i];
            choices[i] = new Choices(a, {
                loadingText: "Chargement...",
                noResultsText: "Aucun résultat trouvé",
                noChoicesText: "Pas de choix à effectuer",
                itemSelectText: "Appuyez pour sélectionner",
                position: "bottom",
                removeItemButton: true,
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
        });
    },
    saError: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        });
    },
    saNewFactureAvoirParams: function(
        title,
        text,
        confirmButtonText,
        cancelButtonText,
        oktitle,
        oktext,
        notitle,
        notext
    ) {
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
                newFactureAvoir.createFactureAvoir(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                newFactureAvoir.saError(notitle, notext);
        });
    },
    saSuccesShowFA: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        }).then(function(e) {
            e.value ?
                location.href = URL_DETAIL_FACTURE_AVOIR.replace("__id__", facture.id) : "";
        });
    },
    createFactureAvoir: function(oktitle, oktext) {
        var typeId = facturationForm.find("#type").val()
        console.log(typeId);
        // var fvId = factureValidationForm.find("#fv_ref").val();
        console.log(facture.id);
        var obj = { __typeId__: typeId, __fvId__: facture.id };
        var submitUrl = GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
        GlobalScript.request(submitUrl, "POST", null).then(function(data) {
                // Run this when your request was successful
                console.log(data);
                facture = data;
                newFactureAvoir.saSuccesShowFA("Validée !", "Facture d'avoir créée avec succès ! Cliquer sur 'OK' pour afficher les détails.");
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la création de la facture d'avoir");
            });
    },
    // Récupération de la liste des articles ou des clients
    getForeignsData: function(url, selectData, choicePosition, itemId) {
        GlobalScript.request(url, "GET", null)
            .then(function(data) {
                // Run this when your request was successful
                dataJon = data;
                console.log(dataJon);
                choices[choicePosition].clearChoices();
                choices[choicePosition].setChoices(
                    dataJon,
                    selectData[1],
                    selectData[2]
                );
                if (itemId) choices[choicePosition].setChoiceByValue(itemId);
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération des " + selectData[0]);
            });
    },
    getFacture: function(event) {
        event.preventDefault();
        var reference = facturationForm.find("#fv_ref").val();
        var term = Inputmask.unmask(reference, { mask: "****-****-****-****-****-****" });
        console.log(reference);
        waitMe_zone = facturationForm;
        GlobalScript.request(URL_GET_FACTURE_BY_REF.replace("__ref__", term), "GET", null)
            .then(function(data) {
                // Run this when your request was successful
                facture = data;
                console.log(data);
                newFactureAvoir.confirmInvoiceCreation(event);
                waitMe_zone = facturationForm;
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                if (err.status == 404)
                    alertify.error("Impossible de récupérer la facture de ventre avec ce code. Veuillez renseigner le bon code MECeF/DGI !");
                else
                    GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération de la facture");
            });
    },
    confirmInvoiceCreation: function(event) {
        event.preventDefault();
        newFactureAvoir.saNewFactureAvoirParams(
            "Êtes-vous sûr de vouloir créer la facture d'avoir ?",
            "Cette opération peut-être irreversible !",
            "Oui, créer !",
            "Non, annuller !",
            "Créée !",
            "Facture d'avoir créée avec succès.",
            "annulée !",
            "Opération annulée, rien n'a changé."
        );
    },
};
$(document).ready(function() {
    newFactureAvoir.choicesJsInit();
    facturationForm = $("div#facturationForm").find("form");
    // Récupératon des types de facture
    newFactureAvoir.getForeignsData(
        URL_LIST_TYPE_FACTURE_AVOIR, ["types de facture", "id", "description"],
        0,
        null
    );
    // Remettre à null la valeur du code MECeF/DGI si le type de la facture change
    facturationForm.find("#type").change(function(event) {
        event.preventDefault();
        facturationForm.find("#fv_ref").val(null);
    })

    // Gestion de l'autocompletion
    $("#fv_ref").autocomplete({
        source: function(request, response) {
            var typeId = facturationForm.find("#type").val();
            console.log("type : " + typeId)
            var term = Inputmask.unmask(request.term, { mask: "****-****-****-****-****-****" });
            console.log("search : " + term)
            if (!typeId) {
                alertify.warning("Veuillez choisir un type de facture et reprenez svp !")
                return;
            }
            waitMe_zone = null
            return GlobalScript.request(URL_LIST_FACTURE_AUTOCOMPLETE.replace("__typeId__", typeId) + "?search=" + term, 'GET', null).then(function(data) {
                // Run this when your request was successful
                console.log(data)
                items = data;
                response(data);
                waitMe_zone = ""
            }).catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la recherche du code correspondant");
            });
        },
        autofocus: true,
        minLength: 2,
        delay: 100,
    });
    // Input mask pour le code MECef/DGI
    facturationForm.find("#fv_ref").inputmask({
        mask: "****-****-****-****-****-****",
        casing: "upper",
    });
});