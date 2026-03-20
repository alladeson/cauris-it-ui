let datatable;
let choices = [];
let destockageForm;
let destockageItem;
let url_get_list_item = URL_LIST_ITEM;
let destockage = {
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
                            "url": url_get_list_item,
                            "method": "GET",
                        };
                    },
                    "dataSrc": "",
                    error: function(xhr, status, error) {
                        (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide')
                        GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des destockages");
                        $(".datatable").find('tbody td').html('<span class="text-danger">Echec de chargement</span>');
                    }
                },
                // "ajax": "/assets/js/custom/data/destockage.txt",
                columns: [
                    {
                        data: 'id',
                        "class": "",
                        "orderable": false,
                        "searchable": false,
                        "render": function(data, type, row, meta) {
                            return `` +
                                `<div class="form-check font-size-16">` +
                                `<input type="checkbox" class="form-check-input" id="destockagecheck${data}">` +
                                `<label class="form-check-label" for="destockagecheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { data: 'article.reference' },
                    { data: 'article.designation' },
                    { data: 'quantite' },
                    { data: 'motif' },
                    {
                        data: 'valid',
                        "render": function(data, type, row, meta) {
                            if (data)
                                return `<span class="text-success">Validé</span>`;
                            else
                                return `<span class="text-warning">En attente</span>`;
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
                                    ${!row.valid ?
                                    `<li>
                                        <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item validate-item" href="javascript:void(0);" data-item-id="${data}">Valider</a>
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
                destockage.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                destockage.saError(notitle, notext);
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
                destockage.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                destockage.saError(notitle, notext);
        });
    },
    saValidationParams: function(event, elId, title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
        if(event) event.preventDefault();
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
                destockage.submitValidationForm(elId, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                destockage.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        let form = $("div.add-new-modal").find('form');
        let data = destockage.dataFormat(form)
        let dataId = form.find("#item-id").val();
        if(GlobalScript.traceFormChange(dataId)) return;
        // Récupération de l'article
        let articleId = form.find("#article").val();
        let obj = { '__id__': dataId, '__artId__': articleId }
        // Formatage de URL de création et/ou de mise à jour
        let submitUrl = dataId ? GlobalScript.textMultipleReplace(URL_PUT_ITEM, obj) : GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
        GlobalScript.request(submitUrl, (dataId ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            datatable.ajax.reload();
            // destockage.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
            if (dataId) $("div.add-new-modal").modal('hide')
            // Réinitialisation du formulaire
            destockage.resetFormData(form);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
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
            destockage.setShowingTable(itemObj);
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
            // console.log(data)
            let itemObj = data;
            // Mise à jour de l'item
            destockageItem = data;
            //
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            GlobalScript.getForeignsData(URL_LIST_ARTICLE, ['articles', 'id', 'designation'], 1, itemObj.article.id);
            destockage.setformData($("div.add-new-modal").find('form'), itemObj);
            $(".add-new-modal").modal('show');
            GlobalScript.formChange($("div.add-new-modal").find('form'));
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la modification");
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // // console.log(id);
        GlobalScript.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
                // destockage.saSucces(oktitle, oktext);
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
            form.find("#quantite").val(item.quantite)
            // Les champs de sélection
            choices[1].setChoiceByValue(item.article ? item.article.id : 0);
            choices[2].setChoiceByValue(item.motif ? item.motif : 0);
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            let remise = form.find("#remise-check").is(":checked");
            data = {
                'id': GlobalScript.checkBlank(form.find("#item-id").val()),
                'quantite': GlobalScript.checkBlank(form.find("#quantite").val()),
                'motif': GlobalScript.checkBlank(form.find("#motif").val()),
            };
            return JSON.stringify(data);
        }
        return null;
    },
    newItemEvent: function(event) {
        event.preventDefault();
        // Mise à jour de l'item
        destockageItem = null;
        //
        $("div.add-new-modal").find('h5.modal-title').text('Nouvel ajout');
        let form = $("div.add-new-modal").find('form');
        form[0].reset();
        //
        form.find("#item-id").val("");
        // Récupération de l'id de l'article du filtre
        let articleId = parseInt($("#filtre-article").val());
        // Récupération des articles en définissant par défaut l'article du filtre s'il existe
        GlobalScript.getForeignsData(URL_LIST_ARTICLE, ['articles', 'id', 'designation'], 1, articleId);
        // Réinitialisation des champs de sélection de motif
        choices[2].setChoiceByValue(0);
    },
    reloadDatatable: function(event) {
        // Prevent event
        event.preventDefault();
        // Récupération de l'id de l'article du filtre
        let articleId = parseInt($("#filtre-article").val());
        // Si l'article du filtre existe, redéfinir l'url de liste des items
        if(articleId){
            url_get_list_item = URL_LIST_ITEM_PAR_ARTICLE.replace("__artId__", articleId);
        } else {
            url_get_list_item = URL_LIST_ITEM;
        }
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        let $showClasseTable = $("table.item-show-table");
        //Affichage générale
        $showClasseTable.find(".td-detail-reference").text(itemObj.article.reference);
        $showClasseTable
            .find(".td-detail-designation")
            .text(itemObj.article.designation);
        $showClasseTable.find(".td-detail-quantite").text(itemObj.quantite);
        $showClasseTable.find(".td-detail-motif").text(itemObj.motif);
    },
    validateItem: function (el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        destockage.saValidationParams(event, id, "Êtes-vous sûr de vouloir valider cet destockage ?", "Cette opération est irréversible !", "Oui, valider !", "Non, annuller !", "Supprimé !", "Destockage validé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    },
    submitValidationForm: function (elId, oktitle, oktext) {
        // Envoie de la requete de validation
        data = JSON.stringify({
            'id': GlobalScript.checkBlank(elId),
        });
        GlobalScript.request(URL_PUT_ITEM_VALIDER.replace("__id__", elId), "PUT", data)
            .then(function (data) {
                // Run this when your request was successful
                // console.log(data);
                alertify.success(oktext);
                datatable.ajax.reload();
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "sweet", "la validation");
            });
    },
    /**
     * Réinitialiser le formulaire après un ajout, ceci permet à l'utilisateur de faire plusieurs ajout sans fermer le formulaire
     * @param {Object} form Le formulaire d'ajout d'un article
     */
    resetFormData: function(form) {
        form.find("#item-id").val("")
        form.find("#quantite").val("")
        form.find("#motif").val("")
        choices[1].removeActiveItems();
        choices[2].removeActiveItems();
    },
};
$(document).ready(function() {
    destockage.listInitalizer();
    destockage.choicesJsInit();
    // Récupération du formulaire d'enregistrement
    destockageForm = $("div.add-new-modal").find('form');
    // Récupération des articles pour le filtre
    GlobalScript.getForeignsData(URL_LIST_ARTICLE, ['articles', 'id', 'designation'], 0, null);
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        destockage.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // destockage.removeItem($(this));
        destockage.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cet destockage ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "Destockage supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        destockage.showItem($(this));
    });

    //Validation record
    datatable.on('click', '.validate-item', function(e) {
        e.preventDefault();
        destockage.validateItem($(this));
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