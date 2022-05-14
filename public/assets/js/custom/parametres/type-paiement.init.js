let datatable;
let choices;
let typePaiement = {
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
                // "ajax": "/assets/js/custom/data/categorie-article.txt",
                columns: [{
                        data: 'id',
                        "class": "",
                        "orderable": false,
                        "searchable": false,
                        "render": function(data, type, row, meta) {
                            return `` +
                                `<div class="form-check font-size-16">` +
                                `<input type="checkbox" class="form-check-input" id="typePaiementcheck${data}">` +
                                `<label class="form-check-label" for="typePaiementcheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { data: 'id' },
                    { data: 'type' },
                    { data: 'description' },
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
                                                </ul>
                                            </div>`;
                            return html;
                        }
                    }
                ],
            }),
            $(".dataTables_length select").addClass("form-select form-select-sm");
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
                typePaiement.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                typePaiement.saError(notitle, notext);
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
                typePaiement.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                typePaiement.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = typePaiement.dataFormat(form)
        console.log(data)
        GlobalScript.request((data.id ? URL_PUT_ITEM.replace("__id__", data.id) : URL_POST_ITEM), (data.id ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            datatable.ajax.reload();
            // typePaiement.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
                // $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            var itemObj = data;
            typePaiement.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage");
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        //var response = GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            var itemObj = data;
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            typePaiement.setformData($("div.add-new-modal").find('form'), itemObj);
            $(".add-new-modal").modal('show');
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la modification");
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // console.log(id);
        GlobalScript.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
                // typePaiement.saSucces(oktitle, oktext);
            alertify.success(oktext)
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la suppression");
        });
    },
    setformData: function(form, item) {
        if (form.length) {
            form.find("#item-id").val(item.id)
                //form.find("#reference").val(item.id)
            form.find("#libelle").val(item.libelle)
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            data = {
                'id': form.find("#item-id").val(),
                'libelle': form.find("#libelle").val(),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    newItemEvent: function(event) {
        event.preventDefault();
        $("div.add-new-modal").find('h5.modal-title').text('Nouvel ajout');
        var form = $("div.add-new-modal").find('form');
        form[0].reset();
        form.find("#item-id").val("");
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-type').text(itemObj.type);
        $showClasseTable.find('.td-description').text(itemObj.description);
    },
};
$(document).ready(function() {
    typePaiement.listInitalizer();
    // // Edit record
    // datatable.on('click', '.edit-item', function(e) {
    //     e.preventDefault();
    //     typePaiement.editItem($(this));
    // });

    // // Delete a record
    // datatable.on('click', '.remove-item', function(e) {
    //     e.preventDefault();
    //     // typePaiement.removeItem($(this));
    //     typePaiement.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cette catégorie d'articles ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimée !", "Catégorie d'articles supprimée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    // });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        typePaiement.showItem($(this));
    });

    //Show Action
    datatable.on('responsive-resize', function(e, datatable, columns) {
        e.preventDefault();
        var count = columns.reduce(function(a, b) {
            return b === false ? a + 1 : a;
        }, 0);
        var position = count ? "relative" : "absolute";
        datatable.on('click', 'button.dropdown-toggle', function(e) {
            e.preventDefault();
            $(".dropdown-menu-end").css("position", position);
        });
        console.log(count + ' column(s) are hidden');
    });
});