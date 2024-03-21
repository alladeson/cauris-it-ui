let choices = [];
let url_get_list_item = URL_LIST_ITEM;
let cmdFournisseur = {
    listInitalizer: function() {
        datatable = $(".datatable").DataTable({
                "language": {
                    "url": "/assets/i18n/French.json"
                },
                "ajax": {
                    "type": "POST",
                    "url": URL_GLOBAL_REQUEST,
                    data: function() {
                        return data = {
                            "url": url_get_list_item,
                            "method": "GET",
                        };
                    },
                    "dataSrc": "",
                    error: function(xhr, status, error) {
                        (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide')
                        GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des ordres d'achat");
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
                                `<input type="checkbox" class="form-check-input" id="cmdFournisseurcheck${data}">` +
                                `<label class="form-check-label" for="cmdFournisseurcheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { 
                        data: 'numero',
                        render: function(data, type, row, meta) {
                            return `#${data}`;
                        }
                    },
                    { 
                        data: 'dateCreation',
                        render: function(data, type, row, meta) {
                            return data ? GlobalScript.dateFormat(data) : "-";
                        }
                    },
                    { data: 'fournisseur.name' },
                    { data: 'montantTtc' },
                    {
                        data: 'valid',
                        "render": function(data, type, row, meta) {
                            if (data)
                                return `<div class="badge badge-soft-success font-size-12">Validé</div>`;
                            else
                                return `<div class="badge badge-soft-warning font-size-12">En attente</div>`;
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
                                    ${row.details.length ?
                                        `<li>
                                        <a class="dropdown-item show-item" href="${URL_ITEM_DETAIL.replace('0', data)}" data-item-id="${data}">Voir Détail</a>
                                    </li>`
                                    : "" }
                                    ${!row.valid ?
                                    `<li>
                                        <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier et/ou Valider</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item remove-item" href="javascript:void(0);" data-item-id="${data}">Supprimer</a>
                                    </li>`
                                    : "" }
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
        let e = document.querySelectorAll("[data-trigger]");
        for (i = 0; i < e.length; ++i) {
            let a = e[i];
            choices[i] = new Choices(a, {
                loadingText: 'Chargement...',
                noResultsText: 'Aucun résultat trouvé',
                noChoicesText: 'Pas de choix à effectuer',
                itemSelectText: 'Appuyez pour sélectionner',
                position: "bottom",
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
                cmdFournisseur.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                cmdFournisseur.saError(notitle, notext);
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
                cmdFournisseur.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                cmdFournisseur.saError(notitle, notext);
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //// console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            let itemObj = data;
            cmdFournisseur.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            console.log(err);
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage");
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //// console.log(id);
        //let response = GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            location.href = URL_GLOBAL_UPDATE_CMD_FOURNISSEUR.replace("__id__", data.id);
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage de l'interface de modification");
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // // console.log(id);
        GlobalScript.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
                // cmdFournisseur.saSucces(oktitle, oktext);
            alertify.success(oktext)
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la suppression");
        });
    },
    reloadDatatable: function(event) {
        // Prevent event
        event.preventDefault();
        // Récupération de l'id du fournisseur du filtre
        let fId = parseInt($("#filtre-fournisseur").val());
        // Si le fournisseur du filtre existe, redéfinir l'url de liste des items
        if(fId){
            url_get_list_item = URL_LIST_ITEM_BY_FOURNISSEUR.replace("__fId__", fId);
        } else {
            url_get_list_item = URL_LIST_ITEM;
        }
        datatable.ajax.reload();
    },
};
$(document).ready(function() {
    cmdFournisseur.listInitalizer();
    flatpickr(".datepicker-range",{mode:"range",altInput:!0,wrap:!0});
    cmdFournisseur.choicesJsInit();
    // Récupération des fournisseurs pour le filtre
    GlobalScript.getForeignsData(URL_LIST_FOURNISSEUR, ['fournisseur', 'id', 'name'], 0, null);
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        cmdFournisseur.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // cmdFournisseur.removeItem($(this));
        cmdFournisseur.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cet ordre d'achat ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "Ordre d'achat supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        // e.preventDefault();
        GlobalScript.run_waitMe($('body'), 1, 'stretch');
        setTimeout(()=>{
            $('body').waitMe('hide');
        }, 10000)
    });

    //Show Action
    datatable.on('responsive-resize', function(e, datatable, columns) {
        e.preventDefault();
        let count = columns.reduce(function(a, b) {
            return b === false ? a + 1 : a;
        }, 0);
        let position = count ? "relative" : "absolute";
        datatable.on('click', 'button.dropdown-toggle', function(e) {
            e.preventDefault();
            $(".dropdown-menu-end").css("position", position);
        });
        // console.log(count + ' column(s) are hidden');
    });
});