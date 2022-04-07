let datatable;
let choices = [];
let typeService = [];
let service = {
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
                            `<input type="checkbox" class="form-check-input" id="servicecheck${data}">` +
                            `<label class="form-check-label" for="servicecheck${data}"></label>` +
                            `</div>`;
                    }
                },
                { "data": "id" },
                {
                    data: 'type.libelle',
                    "render": function(data, type, row, meta) {
                        return `` +
                            `<div class="d-flex gap-2">` +
                            `<a href="#" class="badge badge-soft-primary font-size-11">${data}</a>` +
                            `</div>`;
                    }
                },                
                { "data": "designation" },
                { "data": "montant" },
                
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
                service.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                service.saError(notitle, notext);
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
                service.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                service.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = service.dataFormat(form)
        var typeId = form.find("#type").val();
        console.log(data)
        service.request((data.id ? (URL_PUT_ITEM.replace("__id__", data.id)).replace("__typeId__", typeId) : URL_POST_ITEM.replace("__typeId__", typeId)), (data.id ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            datatable.ajax.reload();
            service.saSucces("Succès !", "Enregistrement effectué avec succès.")
            $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            service.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        service.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            service.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            service.saError("Erreur !", "Une erreur s'est produite lors de l'affichage.")
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        //var response = service.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        service.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            service.setformData($("div.add-new-modal").find('form'), itemObj);
            $(".add-new-modal").modal('show');
            service.getTypeService(itemObj.type.id);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            service.saError("Erreur !", "Une erreur s'est produite lors de la modification.")
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // console.log(id);
        service.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            service.saSucces(oktitle, oktext);
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            service.saError("Erreur !", "Une erreur s'est produite lors de la suppression.")
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
            form.find("#reference").val(item.id)
            form.find("#designation").val(item.designation)
            form.find("#montant").val(item.montant)
            //form.find("#email").val(item.email)
            //form.find("#telephone").val(item.telephone)
            //form.find("#salaire").val(item.salaire ? item.salaire : '')
            choices[0].setChoiceByValue(item.type.id)
            //choices[1].setChoiceByValue(item.statut)
        }
        service.setformDataOnStatutChange();
    },
    dataFormat: function(form) {
        if (form.length) {
            return {
                'id': form.find("#item-id").val(),
                "reference": form.find("#reference").val(),
                "designation": form.find("#designation").val(),
                "montant": form.find("#montant").val(),
                //"email": form.find("#email").val(),
                //"telephone": form.find("#telephone").val(),
                //"statut": form.find("#statut").val(),
                //"salaire": form.find("#salaire").val(),
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
        service.getTypeService(null);
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-designation').text(itemObj.designation);
        $showClasseTable.find('.td-montant').text(itemObj.montant);
        //$showClasseTable.find('.td-email').text(itemObj.email ? itemObj.email : '');
        //$showClasseTable.find('.td-telephone').text(itemObj.telephone ? itemObj.telephone : '');
        $showClasseTable.find('.td-type').find('a').text(itemObj.type.libelle);
        //$showClasseTable.find('.td-statut').text(itemObj.statut ? itemObj.statut : '');
        //$showClasseTable.find('.td-salaire').find('a').text(itemObj.salaire ? itemObj.salaire : '');
    },
    getTypeService: function(itemId) {
        service.request(URL_LIST_TYPE_SERVICE, 'GET', null).then(function(data) {
            // Run this when your request was successful
            dataJon = JSON.parse(data);
            console.log(dataJon);
            typeService = $.map(dataJon, function(obj) {
                obj.value = obj.id
                obj.label = obj.libelle
                return obj
            });
            //typeService = [{ value: 1, label: 'Label One', disabled: true, selected: true }, ...typeService];
            choices[0].clearChoices();
            choices[0].setValue(typeService);
            // choices[0].removeActiveItems();
            if (itemId) choices[0].setChoiceByValue(itemId);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? "Récupération de la liste du type des personnel : Accès réfusé" : "Une erreur s'est produite lors de la récupération des type du personnel");
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
    service.listInitalizer();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        service.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // service.removeItem($(this));
        service.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer ce personnel ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "Personnel supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        service.showItem($(this));
    });
});
document.addEventListener("DOMContentLoaded", function() {
    service.choicesJsInit();
});