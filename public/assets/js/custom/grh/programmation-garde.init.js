let datatable;
let choices = [];
let postePersonnels = [];
let Personnels = [];
let programmationGarde = {
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
                                `<input type="checkbox" class="form-check-input" id="gardecheck${data}">` +
                                `<label class="form-check-label" for="gardecheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    {
                        data: 'date',
                        "render": function(data, type, row, meta) {
                            return GlobalScript.dateFormat(data, false);
                        }
                    },
                    {
                        data: 'debut',
                        "render": function(data, type, row, meta) {
                            return 'de ' + row.debut.substr(0, 5) + ' à ' + row.fin.substr(0, 5);
                        }
                    },
                    {
                        data: 'id',
                        "render": function(data, type, row, meta) {
                            let html = `<div class="d-flex gap-2">`;
                            row.postePersonnels.forEach(element => {
                                html += `<a href="javascript:void(0);" class="badge badge-soft-primary">${element.libelle}</a>`;
                            });
                            return html += `</div>`;
                        }
                    },
                    {
                        data: 'id',
                        "render": function(data, type, row, meta) {
                            let html = `<div class="d-flex gap-2">`;
                            row.personnels.forEach(element => {
                                html += `<a href="javascript:void(0);" class="text-body">${element.nom + " " + element.prenom}</a>`;
                            });
                            return html += `</div>`;
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
                programmationGarde.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                programmationGarde.saError(notitle, notext);
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
                programmationGarde.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                programmationGarde.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = programmationGarde.dataFormat(form)
        var posteId = form.find("#poste").val();
        console.log(data)
        programmationGarde.request((data.id ? URL_PUT_ITEM.replace("__id__", data.id) : URL_POST_ITEM), (data.id ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            datatable.ajax.reload();
            programmationGarde.saSucces("Succès !", "Enregistrement effectué avec succès.")
            $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            programmationGarde.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        programmationGarde.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            programmationGarde.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            programmationGarde.saError("Erreur !", "Une erreur s'est produite lors de l'affichage.")
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        //var response = programmationGarde.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        programmationGarde.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            programmationGarde.setformData($("div.add-new-modal").find('form'), itemObj);
            $(".add-new-modal").modal('show');
            programmationGarde.getPostePersonnels(itemObj.postePersonnels.map(item => item.id));
            programmationGarde.getPersonnels(itemObj.personnels.map(item => item.id));
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            programmationGarde.saError("Erreur !", "Une erreur s'est produite lors de la modification.")
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // console.log(id);
        programmationGarde.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            programmationGarde.saSucces(oktitle, oktext);
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            programmationGarde.saError("Erreur !", "Une erreur s'est produite lors de la suppression.")
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
            form.find("#date").val(item.date.substr(0, 10))
            form.find("#heure-debut").val(item.debut ? item.debut.substr(0, 5) : '')
            form.find("#heure-fin").val(item.fin ? item.fin.substr(0, 5) : '')
            choices[0].setChoiceByValue(item.postePersonnels.map(item => item.id))
            choices[1].setChoiceByValue(item.personnels.map(item => item.id))
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            return {
                'id': form.find("#item-id").val(),
                "date": form.find("#date").val(),
                "debut": form.find("#heure-debut").val() + ':00',
                "fin": form.find("#heure-fin").val() + ':00',
                "personnels": form.find("#personnel").val(),
                "postePersonnels": form.find("#position").val(),
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
        programmationGarde.getPostePersonnels(null);
        programmationGarde.getPersonnels(null);
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-date').text(GlobalScript.dateFormat(itemObj.date, false));
        $showClasseTable.find('.td-horaire').text('De ' + itemObj.debut.substr(0, 5) + ' à ' + itemObj.fin.substr(0, 5));
        var perso = "";
        itemObj.personnels.forEach(element => {
            perso += element.identite + ' ';
        });
        $showClasseTable.find('.td-personnel').text(perso);
        var html = ``;
        itemObj.postePersonnels.forEach(element => {
            html += `<a href="javascript:void(0);" class="badge badge-soft-primary">${element.libelle}</a>`;
        });
        console.log(html)
        $showClasseTable.find('.td-poste').html(html);
    },
    getPostePersonnels: function(itemsId) {
        programmationGarde.request(URL_LIST_POSTE_PERSONNEL, 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJon = JSON.parse(data);
            console.log(itemsId);
            postePersonnels = $.map(dataJon, function(obj) {
                obj.value = obj.id
                obj.label = obj.libelle
                return obj
            });
            //postePersonnels = [{ value: 1, label: 'Label One', disabled: true, selected: true }, ...postePersonnels];
            choices[0].clearChoices();
            choices[0].setChoices(postePersonnels, 'id', 'libelle');
            // choices[0].removeActiveItems();
            if (itemsId) choices[0].setChoiceByValue(itemsId);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? "Récupération de la liste du poste des personnel : Accès réfusé" : "Une erreur s'est produite lors de la récupération des poste du personnel");
        });
    },
    getPersonnels: function(itemsId) {
        programmationGarde.request(URL_LIST_PERSONNEL, 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJon = JSON.parse(data);
            console.log(itemsId);
            personnels = $.map(dataJon, function(obj) {
                obj.value = obj.id
                obj.label = (obj.nom + ' ' + obj.prenom)
                return obj
            });
            //personnels = [{ value: 1, label: 'Label One', disabled: true, selected: true }, ...personnels];
            choices[1].clearChoices();
            choices[1].setChoices(personnels, 'id', 'identite');
            // choices[1].removeActiveItems();
            if (itemsId) choices[1].setChoiceByValue(itemsId);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? "Récupération de la liste des personnels : Accès réfusé" : "Une erreur s'est produite lors de la récupération des personnels");
        });
    },
};
$(document).ready(function() {
    programmationGarde.listInitalizer();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        programmationGarde.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // programmationGarde.removeItem($(this));
        programmationGarde.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cette programmation ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimée !", "Programmation supprimée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        programmationGarde.showItem($(this));
    });
});
document.addEventListener("DOMContentLoaded", function() {
    programmationGarde.choicesJsInit();
});