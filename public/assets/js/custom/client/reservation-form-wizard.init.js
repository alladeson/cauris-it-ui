let datatable;
let choices = [];
let clients = [];
let chambres = [];
let save = true;
let reservationWizard = {
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
    saSuccesReservation: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        }).then(function(e) {
            e.value ? location.href = URL_FICHE_RESERVATION : '';
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
                reservationWizard.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                reservationWizard.saError(notitle, notext);
        });
    },
    submitFormDataClient: function(event) {
        event.preventDefault();
        var form = $("form#client-form")
        var data = reservationWizard.dataFormatClient(form)
        console.log(data)
        reservationWizard.request(URL_POST_CLIENT, 'POST', data).then(function(data) {
            // Run this when your request was successful
            var client = JSON.parse(data)
            console.log(client);
            // eservationWizard.saSucces("Succès !", "Enregistrement effectué avec succès.")
            $("form#reservation-form").find("#client-id").val(client.id)
            $("form#reservation-form").submit()
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            reservationWizard.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("form#reservation-form")
        var data = reservationWizard.dataFormat(form)
        var clientId = form.find("#client-id").val();
        reservationWizard.request(URL_POST_ITEM.replace("__idClient__", clientId), 'POST', data).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            reservationWizard.saSuccesReservation("Succès !", "Enregistrement effectué avec succès.")
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            reservationWizard.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        });
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
    dataFormat: function(form) {
        if (form.length) {
            var typeValue = choices[1].getValue();
            console.log(typeValue);
            return {
                // "id": null,
                "type": form.find("#type").val(),
                "typeRef": form.find("#reference-type").val() ? typeValue.label : '',
                "debut": form.find("#debut").val(),
                "fin": form.find("#fin").val(),
                "duree": form.find("#duree").val(),
                "prixUnitaire": form.find("#prix_u").val(),
                "chambre": {
                    "id": form.find("#reference-type").val() ? typeValue.value : '',
                },
            };
        }
        return null;
    },
    dataFormatClient: function(form) {
        if (form.length) {
            return {
                // 'id': null,
                "nom": form.find("#nom").val(),
                "prenom": form.find("#prenom").val(),
                "adresse": form.find("#adresse").val(),
                "email": form.find("#email").val(),
                "telephone": form.find("#telephone").val(),
            };
        }
        return null;
    },
    setRecapTable: function() {
        var $showClasseTable = $('table.item-show-table');
        var clientForm = $("form#client-form")
            // Client
        $showClasseTable.find('.td-nom').html(clientForm.find("#nom").val() ? clientForm.find("#nom").val() : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        $showClasseTable.find('.td-prenom').html(clientForm.find("#prenom").val() ? clientForm.find("#prenom").val() : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        $showClasseTable.find('.td-adresse').html(clientForm.find("#adresse").val() ? clientForm.find("#adresse").val() : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        $showClasseTable.find('.td-email').html(clientForm.find("#email").val() ? clientForm.find("#email").val() : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        $showClasseTable.find('.td-telephone').html(clientForm.find("#telephone").val() ? clientForm.find("#telephone").val() : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        // Réservation
        var rForm = $("form#reservation-form")
        var typeValue = choices[1].getValue();
        $showClasseTable.find('.td-type').html(rForm.find("#type").val() ? rForm.find("#type").val() : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        $showClasseTable.find('.td-typeRef').html(rForm.find("#reference-type").val() ? typeValue.label : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        $showClasseTable.find('.td-debut').html(rForm.find("#debut").val() ? GlobalScript.dateFormat(rForm.find("#debut").val()) : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        $showClasseTable.find('.td-fin').html(rForm.find("#fin").val() ? GlobalScript.dateFormat(rForm.find("#fin").val()) : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        $showClasseTable.find('.td-duree').html(rForm.find("#duree").val() ? rForm.find("#duree").val() : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        $showClasseTable.find('.td-prixUnitaire').html(rForm.find("#prix_u").val() ? rForm.find("#prix_u").val() : `<span class="text-danger badge badge-soft-danger font-size-14">Doit contenir une valeur</span>`);
        // $showClasseTable.find('.td-montant').html(itemObj.montant);
    },
    // Récupération de la liste des chambres ou des clients
    getForeignsData: function(url, dataname, choicePosition, itemId) {
        reservationWizard.request(url, 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJson = JSON.parse(data);
            console.log(dataJson);
            items = $.map(dataJson, function(obj) {
                obj.value = dataname == "chambres" ? obj.id : obj.id
                obj.label = dataname == "chambres" ? obj.numero : obj.identite
                return obj
            });
            choices[choicePosition].clearChoices();
            choices[choicePosition].setChoices(items, 'value', 'label');
            // choices[choicePosition].removeActiveItems();
            if (itemId) choices[choicePosition].setChoiceByValue(itemId);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? `Récupération de la liste des ${dataname} : Accès réfusé` : `Une erreur s'est produite lors de la récupération des ${dataname}`);
        });
    },
    // Récupération d'un objet depuis l'API
    getEntity: function(url, id, dataname = 'donnée') {
        waitMe_zone = $("form#reservation-form");
        GlobalScript.request(url.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJson = JSON.parse(data);
            console.log(dataJson);
            $("form#reservation-form").find("#prix_u").val(dataJson.montant ? dataJson.montant : 0);
            waitMe_zone = ''
            return dataJson;
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? `Récupération de ${dataname} : Accès réfusé` : `Une erreur s'est produite lors de la récupération de ${dataname}`);
        });
    },
    onTypeRefChange: function(event) {
        event.preventDefault();
        var form = $("form#reservation-form");
        var typeRefId = form.find("#reference-type").val()
        if (!typeRefId) {
            form.find("#prix_u").val(0);
        } else {
            reservationWizard.getEntity(URL_GET_CHAMBRE, typeRefId, "chambre");
        }
    },
    onSave: function(event) {
        event.preventDefault();
        var clientForm = $("form#client-form")
        var clientData = reservationWizard.dataFormatClient(clientForm)
        var rForm = $("form#reservation-form")
        var reservationData = reservationWizard.dataFormat(rForm)
        if (clientData) {
            $.each(clientData, function(key, value) {
                if (!value) {
                    reservationWizard.saError("Erreur !", "Impossible d'enregistrer pour manque d'informations")
                    save = false;
                } else {
                    save = true;
                }

                return save;
            })
        }
        if (save && reservationData) {
            $.each(reservationData, function(key, value) {
                if (!value || (key == "chambre" && !value.id)) {
                    reservationWizard.saError("Erreur !", "Impossible d'enregistrer pour manque d'informations")
                    save = false;
                } else {
                    save = true;
                }

                return save;
            })
        }

        if (save)
            reservationWizard.submitFormDataClient(event);

    }
};
$(document).ready(function() {

});
document.addEventListener("DOMContentLoaded", function() {
    reservationWizard.choicesJsInit();
    reservationWizard.getForeignsData(URL_LIST_CHAMBRE, 'chambres', 1, null);
});