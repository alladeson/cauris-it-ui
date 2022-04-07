let datatable;
let choices = [];
let clients = [];
let chambres = [];
let reservation = {
    listInitalizer: function() {
        // $(".datatable").DataTable({ responsive: !1 }),
        datatable = $(".datatable").DataTable({
                "language": {
                    //"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                    "url": "/assets/i18n/French.json"
                },
                "ajax": {
                    "type": "POST",
                    "url": URL_GLOBAL_REQUEST,
                    data: function() {
                        return data = {
                            "url": URL_LIST_ITEM,
                            "method": "GET",
                        };
                    },
                    "dataSrc": "",
                    error: function(xhr, status, error) {
                        (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide')
                        alertify.error(status == 403 ? "Accès réfusé" : "Une erreur s'est produite lors de la connexion au serveur");
                        $(".datatable").find('tbody td').html('<span class="text-danger">Echec de chargement</span>');
                    }
                },
                columns: [{
                        data: 'id',
                        "class": "",
                        "orderable": false,
                        "searchable": false,
                        "render": function(data, type, row, meta) {
                            return `` +
                                `<div class="form-check font-size-16">` +
                                `<input type="checkbox" class="form-check-input" id="reservationcheck${data}">` +
                                `<label class="form-check-label" for="reservationcheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { data: 'id' },
                    { data: 'client.identite' },
                    {
                        data: 'type',
                        "render": function(data, type, row, meta) {
                            return `${data  + ' (' + row.typeRef + ')'}`;
                        }
                    },
                    {
                        data: 'debut',
                        "render": function(data, type, row, meta) {
                            return GlobalScript.dateFormat(data);
                        }
                    },
                    {
                        data: 'fin',
                        "render": function(data, type, row, meta) {
                            return GlobalScript.dateFormat(data);
                        }
                    },
                    { data: 'montant' },
                    {
                        data: 'status',
                        "render": function(data, type, row, meta) {
                            if (data)
                                return `<span class="text-success">Confirmée</span>`;
                            else
                                return `<span class="text-warning">En attente de confirmation</span>`;
                        }
                    },
                    {
                        "data": "id",
                        "class": "",
                        "orderable": false,
                        "searchable": false,
                        "render": function(data, type, row, meta) {
                            let html = `<div class="dropdown">
                                            <button class="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="bx bx-dots-horizontal-rounded"></i>
                                            </button>
                                            <ul class="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <a class="dropdown-item show-item" href="javascript:void(0);" data-item-id="${data}">Afficher</a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier</a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item remove-item" href="javascript:void(0);" data-item-id="${data}">Supprimer</a>
                                                </li>
                                            </ul>
                                        </div>`;
                            return html;
                        }
                    }
                ],
            }),
            $(".dataTables_length select").addClass("form-select form-select-sm");
    },
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
    saError: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        })
    },
    saParams: function(title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
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
                reservation.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                reservation.saError(notitle, notext);
        });
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
                reservation.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                reservation.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = reservation.dataFormat(form)
        var clientId = form.find("#client").val();
        console.log(data)
        reservation.request((data.id ? (URL_PUT_ITEM.replace("__id__", data.id)).replace("__idClient__", clientId) : URL_POST_ITEM.replace("__idClient__", clientId)), (data.id ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            datatable.ajax.reload();
            reservation.saSucces("Succès !", "Enregistrement effectué avec succès.")
            $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            reservation.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        reservation.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            reservation.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            reservation.saError("Erreur !", "Une erreur s'est produite lors de l'affichage.")
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        //var response = reservation.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        reservation.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            reservation.setformData($("div.add-new-modal").find('form'), itemObj);
            $(".add-new-modal").modal('show');
            reservation.getForeignsData(URL_LIST_CLIENT, 'clients', 0, itemObj.client.id);
            reservation.getForeignsData(URL_LIST_CHAMBRE, 'chambres', 2, itemObj.typeRef);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            reservation.saError("Erreur !", "Une erreur s'est produite lors de la modification.")
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // console.log(id);
        reservation.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            reservation.saSucces(oktitle, oktext);
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            reservation.saError("Erreur !", "Une erreur s'est produite lors de la suppression.")
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
    setformData: function(form, item) {
        if (form.length) {
            form.find("#item-id").val(item.id)
            form.find("#debut").val(item.debut ? item.debut.substr(0, 16) : '')
            form.find("#fin").val(item.fin ? item.fin.substr(0, 16) : '')
            form.find("#duree").val(item.duree)
            form.find("#prix_u").val(item.prixUnitaire)
            form.find("#montant").val(item.montant)
            choices[0].setChoiceByValue(item.client.id)
            choices[1].setChoiceByValue(item.type)
            choices[2].setChoiceByValue(item.typeRef)
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            return {
                "id": form.find("#item-id").val(),
                "type": form.find("#type").val(),
                "typeRef": form.find("#reference-type").val(),
                "debut": form.find("#debut").val(),
                "fin": form.find("#fiin").val(),
                "duree": form.find("#duree").val(),
                "prixUnitaire": form.find("#prix_u").val(),
            };
        }
        return null;
    },
    newItemEvent: function(event) {
        event.preventDefault();
        $("div.add-new-modal").find('h5.modal-title').text('Nouvel ajout');
        var form = $("div.add-new-modal").find('form');
        form[0].reset();
        form.find("#item-id").val("");
        reservation.getForeignsData(URL_LIST_CLIENT, 'clients', 0, null);
        reservation.getForeignsData(URL_LIST_CHAMBRE, 'chambres', 2, null);
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-client').text(itemObj.client.identite);
        $showClasseTable.find('.td-type').text(itemObj.type);
        $showClasseTable.find('.td-typeRef').text(itemObj.typeRef);
        $showClasseTable.find('.td-debut').text(GlobalScript.dateFormat(itemObj.debut));
        $showClasseTable.find('.td-fin').text(GlobalScript.dateFormat(itemObj.fin));
        $showClasseTable.find('.td-duree').text(itemObj.duree);
        $showClasseTable.find('.td-prixUnitaire').text(itemObj.prixUnitaire);
        $showClasseTable.find('.td-montant').text(itemObj.montant);
        let html = ``;
        if (itemObj.status)
            html = `<span class="text-success">Confirmée</span>`;
        else
            html = `<span class="text-warning">En attente de confirmation</span>`;
        $showClasseTable.find('.td-statut').html(html);
    },
    // Récupération de la liste des chambres ou des clients
    getForeignsData: function(url, dataname, choicePosition, itemId) {
        reservation.request(url, 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJon = JSON.parse(data);
            console.log(dataJon);
            personnels = $.map(dataJon, function(obj) {
                obj.value = dataname == "chambres" ? obj.numero : obj.id
                obj.label = dataname == "chambres" ? obj.numero : obj.identite
                return obj
            });
            //personnels = [{ value: 1, label: 'Label One', disabled: true, selected: true }, ...personnels];
            choices[choicePosition].clearChoices();
            choices[choicePosition].setChoices(personnels, 'value', 'label');
            // choices[choicePosition].removeActiveItems();
            if (itemId) choices[choicePosition].setChoiceByValue(itemId);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? `Récupération de la liste des ${dataname} : Accès réfusé` : `Une erreur s'est produite lors de la récupération des ${dataname}`);
        });
    },
};
$(document).ready(function() {
    reservation.listInitalizer();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        reservation.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // reservation.removeItem($(this));
        reservation.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cette programmation ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimée !", "Programmation supprimée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        reservation.showItem($(this));
    });
});
document.addEventListener("DOMContentLoaded", function() {
    reservation.choicesJsInit();
});