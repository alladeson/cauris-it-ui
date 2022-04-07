let datatable;
let choices = [];
let chambre = [];
let personnel = [];
let objet;
let entretien = {
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
                                `<input type="checkbox" class="form-check-input" id="chambrecheck${data}">` +
                                `<label class="form-check-label" for="chambrecheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { "data": "id" },
                    {
                        data: 'date',
                        "render": function(data, type, row, meta) {
                            return GlobalScript.dateFormat(data);
                        }
                    },
                    { "data": "chambre.numero" },
                    {
                        data: 'id',
                        "render": function(data, type, row, meta) {
                            let text = ``;
                            row.personnels.forEach(element => {
                                text += `${element.nom + " " + element.prenom}`;
                            });
                            return text;
                        }
                    },
                    { "data": "status" },
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
        objet = new Choices("#objet", {
            paste: !1,
            duplicateItemsAllowed: !1,
            editItems: !0,
            addItemText: (value) => {
                return `Appuyez sur Entrée pour ajouter <b>"${value}"</b>`;
            },
            maxItemText: (maxItemCount) => {
                return `Seules les valeurs ${maxItemCount} peuvent être ajoutées`;
            },
            removeItemButton: true,
        });
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
                entretien.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                entretien.saError(notitle, notext);
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
                entretien.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                entretien.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = entretien.dataFormat(form)
        var chambreId = form.find("#chambre").val();
        var personnelId = form.find("#personnel").val();
        console.log(data)
        entretien.request((data.id ? (URL_PUT_ITEM.replace("__id__", data.id)).replace("__chambreId__", chambreId).replace("__personnelId__", personnelId) : URL_POST_ITEM.replace("__chambreId__", chambreId).replace("__personnelId__", personnelId)), (data.id ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            datatable.ajax.reload();
            entretien.saSucces("Succès !", "Enregistrement effectué avec succès.")
            $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            entretien.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        entretien.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            entretien.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            entretien.saError("Erreur !", "Une erreur s'est produite lors de l'affichage.")
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        //var response = entretien.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        entretien.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            entretien.setformData($("div.add-new-modal").find('form'), itemObj);
            $(".add-new-modal").modal('show');
            entretien.getChambre(itemObj.chambre.id);
            entretien.getPersonnel(itemObj.personnels[0].id);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            entretien.saError("Erreur !", "Une erreur s'est produite lors de la modification.")
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // console.log(id);
        entretien.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            entretien.saSucces(oktitle, oktext);
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            entretien.saError("Erreur !", "Une erreur s'est produite lors de la suppression.")
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
            form.find("#date").val(item.date.substr(0, 16))
            form.find("#objet").val(item.objet)
                // form.find("#adresse").val(item.adresse)
                // form.find("#email").val(item.email)
                //form.find("#telephone").val(item.telephone)
                //form.find("#salaire").val(item.salaire ? item.salaire : '')
            objet.clearStore()
            objet.setValue([item.objet])
            choices[0].setChoiceByValue(item.chambre.id)
            choices[1].setChoiceByValue(item.personnels.id)
                //choices[0].setChoiceByValue(item.statut)
        }
        entretien.setformDataOnStatutChange();
    },
    dataFormat: function(form) {
        if (form.length) {
            return {
                'id': form.find("#item-id").val(),
                "date": form.find("#date").val(),
                "objet": form.find("#objet").val(),
                // "adresse": form.find("#adresse").val(),
                // "email": form.find("#email").val(),
                // "telephone": form.find("#telephone").val(),
                // "statut": form.find("#statut").val(),
                // "salaire": form.find("#salaire").val(),
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
        entretien.getChambre(null);
        entretien.getPersonnel(null);
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-objet').find('a').text(itemObj.objet);
        $showClasseTable.find('.td-date').text(GlobalScript.dateFormat(itemObj.date));
        $showClasseTable.find('.td-chambre').text(itemObj.chambre.numero);
        $showClasseTable.find('.td-personnel').text(itemObj.personnels[0].identite);
        $showClasseTable.find('.td-commentaire').text(itemObj.commentaire ? itemObj.commentaire : 'Néant');
    },
    getChambre: function(itemId) {
        entretien.request(URL_LIST_CHAMBRE, 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJon = JSON.parse(data);
            console.log(dataJon);
            chambre = $.map(dataJon, function(obj) {
                obj.value = obj.id
                obj.label = obj.numero
                return obj
            });
            //postePersonnel = [{ value: 1, label: 'Label One', disabled: true, selected: true }, ...postePersonnel];
            choices[0].clearChoices();
            choices[0].setChoices(chambre);
            // choices[0].removeActiveItems();
            if (itemId) choices[0].setChoiceByValue(itemId);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? "Récupération de la liste du poste des personnel : Accès réfusé" : "Une erreur s'est produite lors de la récupération des poste du personnel");
        });
    },

    getPersonnel: function(itemId) {
        entretien.request(URL_LIST_PERSONNEL, 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJon = JSON.parse(data);
            console.log(dataJon);
            personnel = $.map(dataJon, function(obj) {
                obj.value = obj.id
                obj.label = obj.nom
                return obj
            });
            //postePersonnel = [{ value: 1, label: 'Label One', disabled: true, selected: true }, ...postePersonnel];
            choices[1].clearChoices();
            choices[1].setChoices(personnel, 'id', 'identite');
            // choices[1].removeActiveItems();
            if (itemId) choices[1].setChoiceByValue(itemId);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? "Récupération de la liste du poste des personnel : Accès réfusé" : "Une erreur s'est produite lors de la récupération des poste du personnel");
        });
    },


    setformDataOnStatutChange: function() {
        var form = $("div.add-new-modal").find('form');
        if (form.find("#statut").val() == "Permanent") {
            form.find("div.statut").show();
        } else {
            form.find("div.statut").hide();
        }
    },
};
$(document).ready(function() {
    entretien.listInitalizer();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        entretien.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // entretien.removeItem($(this));
        entretien.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer ce personnel ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "Personnel supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        entretien.showItem($(this));
    });
});
document.addEventListener("DOMContentLoaded", function() {
    entretien.choicesJsInit();
});