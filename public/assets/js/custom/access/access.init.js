let datatable;
let choices = [];
let filtreForm = null;
let DEFAULT_URL_LIST = URL_LIST_ACCESS_BY_USER_GROUP.replace("__groupeId__", AUTH_USER_GROUP_ID);
let access = {
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
                            "url": DEFAULT_URL_LIST,
                            "method": "GET",
                        };
                    },
                    "dataSrc": "",
                    error: function(xhr, status, error) {
                        (waitMe_zone ? waitMe_zone : $('body')).waitMe('hide')
                        GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des accès");
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
                                `<input type="checkbox" class="form-check-input" id="accesscheck${data}">` +
                                `<label class="form-check-label" for="accesscheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { data: 'id' },
                    {
                        data: 'group.name',
                    },
                    {
                        data: 'feature.name',
                    },
                    {
                        data: 'readable',
                        render: function(data, type, row, meta) {
                            return data ? "Oui" : "Non";
                        }
                    },
                    {
                        data: 'writable',
                        render: function(data, type, row, meta) {
                            return data ? "Oui" : "Non";
                        }
                    },
                    {
                        data: 'deletable',
                        render: function(data, type, row, meta) {
                            return data ? "Oui" : "Non";
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
                position: "bottom",
                removeItemButton: true,
                duplicateItemsAllowed: !1,
                shouldSort: false,
                searchEnabled: $.inArray(i, [0, 1]) > -1 ? false : true,
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
                access.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                access.saError(notitle, notext);
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
                access.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                access.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = access.dataFormat(form)
        var dataId = form.find("#item-id").val();
        var groupeId = form.find("#groupe").val();
        var featureId = form.find("#feature").val();
        // Vérification du changment dans le formulaire
        if (GlobalScript.traceFormChange(dataId)) return;
        console.log(data);
        // var url = dataId ? URL_PUT_ITEM.replace("__id__", dataId) : URL_POST_ITEM;
        var obj = { "__groupeId__": groupeId, "__featureId__": featureId };
        var url = GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
        // var method = dataId ? 'PUT' : 'POST';
        var method = 'POST';
        GlobalScript.request(url, method, data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            datatable.ajax.reload();
            // access.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
            if (dataId) $("div.add-new-modal").modal('hide')
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
            access.setShowingTable(itemObj);
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
            access.setformData($("div.add-new-modal").find('form'), itemObj);
            $(".add-new-modal").modal('show');
            // Récupération des groupes d'utilisateur
            GlobalScript.getForeignsData(URL_LIST_USER_GROUP, ["groupes d'utilisateurs", "id", "name"], 1, data.group.id);
            // Récupération des fonctionnalités
            GlobalScript.getForeignsData(URL_LIST_FEATURES, ["fonctionnalités", "id", "name"], 2, data.feature.id);
            // Écoute de changement dans le formulaire
            GlobalScript.formChange($("div.add-new-modal").find('form'));
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
                // access.saSucces(oktitle, oktext);
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
            form.find("#readable").prop("checked", item.readable ? true : false)
            form.find("#writable").prop("checked", item.writable ? true : false)
            form.find("#deletable").prop("checked", item.deletable ? true : false)
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            data = {
                'id': form.find("#item-id").val(),
                'readable': form.find("#readable").is(":checked"),
                'writable': form.find("#writable").is(":checked"),
                'deletable': form.find("#deletable").is(":checked"),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    newItemEvent: function(event) {
        event.preventDefault();
        var groupeId = filtreForm.find("#user-groupe").val();
        if (!groupeId) {
            alertify.warning("Veuillez sélectionner un groupe d'utilisateur svp !")
            return;
        }
        $("div.add-new-modal").find('h5.modal-title').text('Nouvel ajout');
        var form = $("div.add-new-modal").find('form');
        form[0].reset();
        form.find("#item-id").val("");
        $("div.add-new-modal").modal("toggle");
        // Récupération des groupes d'utilisateur
        GlobalScript.getForeignsData(URL_LIST_USER_GROUP, ["groupes d'utilisateurs", "id", "name"], 1, parseFloat(groupeId));
        // Récupération des fonctionnalités
        GlobalScript.getForeignsData(URL_LIST_FEATURES, ["fonctionnalités", "id", "name"], 2, null);
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-userGroup').text(itemObj.group.name);
        $showClasseTable.find('.td-feature').text(itemObj.feature.name);
        $showClasseTable.find('.td-readable').text(itemObj.readable ? "Oui" : "Non");
        $showClasseTable.find('.td-writable').text(itemObj.writable ? "Oui" : "Non");
        $showClasseTable.find('.td-deletable').text(itemObj.deletable ? "Oui" : "Non");
    },
};
$(document).ready(function() {
    access.listInitalizer();
    access.choicesJsInit();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        formChange = false;
        access.editItem($(this));
    });

    // // Delete a record
    // datatable.on('click', '.remove-item', function(e) {
    //     e.preventDefault();
    //     // access.removeItem($(this));
    //     access.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer ce access ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "Client supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    // });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        access.showItem($(this));
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

    // Récupération des groupes d'utilisateur pour la liste
    GlobalScript.getForeignsData(
        URL_LIST_USER_GROUP, ["groupes d'utilisateurs", "id", "name"],
        0,
        null
    );

    // Récupération du formulaire du filtre
    filtreForm = $("form.filtre-form");
    // Gestion des évènements liées au filtre de la liste des factures
    // Si "Toutes" est coché, alors décocher le checkbox Tous
    filtreForm.find("input#getAll").change(function(event) {
        event.preventDefault();
        if ($(this).is(":checked"))
            choices[0].removeActiveItems();
    });
    // Si une des boutons radios de date est cochée, alors décocher "Toutes"
    filtreForm.find("select[name='user-groupe']").change(function(event) {
        event.preventDefault();
        if ($(this).val())
            filtreForm.find("input#getAll").prop("checked", false);
    });
    // Lors de la soumission du formulaire de filtre, c'est-à-dire en cliquant sur le bouton de recherche
    filtreForm.submit(function(event) {
        event.preventDefault();
        // Récupération du groupe d'utilisateur
        var groupId = filtreForm.find("#user-groupe").val();
        if (groupId) {
            DEFAULT_URL_LIST = URL_LIST_ACCESS_BY_USER_GROUP.replace("__groupeId__", groupId);
        } else if (filtreForm.find("input#getAll").is(":checked")) {
            DEFAULT_URL_LIST = URL_LIST_ITEM;
        } else {
            DEFAULT_URL_LIST = URL_LIST_ACCESS_BY_USER_GROUP.replace("__groupeId__", AUTH_USER_GROUP_ID);
        }
        datatable.ajax.reload();
    });

    $("div.add-new-modal").find('form').on("click", ".submit-button", function(event) {
        event.preventDefault();
        if (!$("div.add-new-modal").find('form').find("#groupe").val()) {
            alertify.warning("Veuillez sélectionner un groupe d'utilisateur svp !")
            return;
        }
        if (!$("div.add-new-modal").find('form').find("#feature").val()) {
            alertify.warning("Veuillez sélectionner une fonctionnalité svp !")
            return;
        }
        access.submitFormData(event);
    })

});