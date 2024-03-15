let datatable;
let choices = [];
let approvisionnementForm;
let approvisionnementItem;
let url_get_list_item = URL_LIST_ITEM;
let approvisionnement = {
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
                        GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des approvisionnements");
                        $(".datatable").find('tbody td').html('<span class="text-danger">Echec de chargement</span>');
                    }
                },
                // "ajax": "/assets/js/custom/data/approvisionnement.txt",
                columns: [{
                        data: 'id',
                        "class": "",
                        "orderable": false,
                        "searchable": false,
                        "render": function(data, type, row, meta) {
                            return `` +
                                `<div class="form-check font-size-16">` +
                                `<input type="checkbox" class="form-check-input" id="approvisionnementcheck${data}">` +
                                `<label class="form-check-label" for="approvisionnementcheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { data: 'article.reference' },
                    { data: 'article.designation' },
                    { 
                        data: 'prixUht',
                        "render": function(data, type, row, meta) {
                            return !row.remise ? data : row.discount.originalPrice;
                        }
                    },
                    { data: 'quantite' },
                    { 
                        data: 'discount',
                        "render": function(data, type, row, meta) {
                            return row.remise ? data.taux + "%" : "0,00%";
                        }
                    },
                    { 
                        data: 'taxe',
                        "render": function(data, type, row, meta) {
                            return data.valeur + "%";
                        }
                    },
                    { data: 'montantHt' },
                    // { data: 'montantTtc' },
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
                approvisionnement.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                approvisionnement.saError(notitle, notext);
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
                approvisionnement.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                approvisionnement.saError(notitle, notext);
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
                approvisionnement.submitValidationForm(elId, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                approvisionnement.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = approvisionnement.dataFormat(form)
        let dataId = form.find("#item-id").val();
        if(GlobalScript.traceFormChange(dataId)) return;
        // Récupération de l'article
        var articleId = form.find("#article").val();
        var obj = { '__id__': dataId, '__artId__': articleId }
        // Formatage de URL de création et/ou de mise à jour
        var submitUrl = dataId ? GlobalScript.textMultipleReplace(URL_PUT_ITEM, obj) : GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
        GlobalScript.request(submitUrl, (dataId ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            datatable.ajax.reload();
            // approvisionnement.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
            if (dataId) $("div.add-new-modal").modal('hide')
            // Réinitialisation du formulaire
            approvisionnement.resetFormData(form);
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
            var itemObj = data;
            approvisionnement.setShowingTable(itemObj);
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
        //var response = GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
            var itemObj = data;
            // Mise à jour de l'item
            approvisionnementItem = data;
            //
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            GlobalScript.getForeignsData(URL_LIST_ARTICLE, ['articles', 'id', 'designation'], 1, itemObj.article.id);
            GlobalScript.getForeignsData(URL_LIST_TAXE, ['taxes', 'id', 'string'], 2, itemObj.taxe.id);
            approvisionnement.setformData($("div.add-new-modal").find('form'), itemObj);
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
                // approvisionnement.saSucces(oktitle, oktext);
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
            form.find("#prix").val(item.prixUht)
            // Gestsion de la remise
            form.find("#remise-check").prop("checked", item.remise ? true : false);
            form.find("#remise_taux").val(item.discount ? item.discount.taux : "");
            form.find("#remise_prix_u").val(item.discount ? item.discount.originalPrice : "");
            form.find("#remise_description").val(item.discount ? item.discount.priceModification : "");
            //Gestion des champs de remise
            approvisionnement.remiseInputsToggle();
            // Les champs de sélection
            choices[1].setChoiceByValue(item.article ? item.article.id : 0);
            choices[2].setChoiceByValue(item.taxe ? item.taxe.id : 0);
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            var remise = form.find("#remise-check").is(":checked");
            data = {
                'id': GlobalScript.checkBlank(form.find("#item-id").val()),
                'quantite': GlobalScript.checkBlank(form.find("#quantite").val()),
                'prixUht': GlobalScript.checkBlank(form.find("#prix").val()),
                taxeId: GlobalScript.checkBlank(form.find("#taxe").val()),
                remise: remise,
                taux: remise ? form.find("#remise_taux").val() : null,
                originalPrice: remise ? form.find("#remise_prix_u").val() : null,
                priceModification: remise ? form.find("#remise_description").val() : null,
            };
            return JSON.stringify(data);
        }
        return null;
    },
    newItemEvent: function(event) {
        event.preventDefault();
        // Mise à jour de l'item
        approvisionnementItem = null;
        //
        $("div.add-new-modal").find('h5.modal-title').text('Nouvel ajout');
        var form = $("div.add-new-modal").find('form');
        form[0].reset();
        //Gestion des champs de remise
        approvisionnement.remiseInputsToggle();
        //
        form.find("#item-id").val("");
        // Récupération de l'id de l'article du filtre
        let articleId = parseInt($("#filtre-article").val());
        // Récupération des articles en définissant par défaut l'article du filtre s'il existe
        GlobalScript.getForeignsData(URL_LIST_ARTICLE, ['articles', 'id', 'designation'], 1, articleId);
        // Récupération des taxes
        GlobalScript.getForeignsData(URL_LIST_TAXE, ['taxes', 'id', 'string'], 2, null);
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
        var $showClasseTable = $("table.item-show-table");
        //Affichage générale
        $showClasseTable.find(".td-detail-reference").text(itemObj.article.reference);
        $showClasseTable
            .find(".td-detail-designation")
            .text(itemObj.article.designation);
        $showClasseTable.find(".td-detail-quantite").text(itemObj.quantite);
        $showClasseTable.find(".td-detail-taxe").text(itemObj.taxe.string);

         // Affichage des montants
         var $detailRecpMontantTable = $("table.detail-recap-montant-table");
         $detailRecpMontantTable
             .find(".td-detail-prixUnitaire")
             .text(itemObj.prixUht);
         $detailRecpMontantTable
             .find(".td-detail-mht")
             .text(itemObj.montantHt ? itemObj.montantHt : "-");
         $detailRecpMontantTable
             .find(".td-detail-mtva")
             .text(itemObj.montantTva ? itemObj.montantTva : "-");
         $detailRecpMontantTable
             .find(".td-detail-mttc")
             .text(itemObj.montantTtc ? itemObj.montantTtc : "-");

        // Affichage taxe spécifique et remise
        var $tsRemmiseShowTable = $("table.ts-remise-show-table");
        $tsRemmiseShowTable.find(".td-detail-remise").text(itemObj.remise ? "Oui" : "Non");
        $tsRemmiseShowTable.find(".td-detail-remise-taux").text(itemObj.remise ? itemObj.discount.taux + "%" : "-");
        $tsRemmiseShowTable.find(".td-detail-remise-prix-u").text(itemObj.remise ? itemObj.discount.originalPrice : "-");
        $tsRemmiseShowTable.find(".td-detail-remise-description").text(itemObj.remise ? itemObj.discount.priceModification : "-");
        if (!itemObj.remise) $tsRemmiseShowTable.find(".tr-detail-remise").hide();

    },
    validateItem: function (el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //
        var form = $("div.validation-modal").find('form');
        form[0].reset();
        form.attr("onsubmit", `approvisionnement.saValidationParams(event, ${id}, "Êtes-vous sûr de vouloir valider cet approvisionnement ?", "Cette opération est irréversible !", "Oui, valider !", "Non, annuller !", "Supprimé !", "Approvisionnement validé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.")`);
        $("div.validation-modal").modal("show")
    },
    submitValidationForm: function (elId, oktitle, oktext) {
        // Récupération de l'id de l'objet
        // let id = el.data("item-id");
        // Récupération du formulaire de validation
        form = $("div.validation-modal").find("form");
        // Formatage du corps de la requête 
        data = JSON.stringify({
            'referenceFacture': GlobalScript.checkBlank(form.find("#reference-facture").val()),
        });
        // // console.log(id);
        GlobalScript.request(URL_PUT_ITEM_VALIDER.replace("__id__", elId), "PUT", data)
            .then(function (data) {
                // Run this when your request was successful
                // console.log(data);
                alertify.success(oktext);
                datatable.ajax.reload();
                // 
                form[0].reset();
                $("div.validation-modal").modal("hide");
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
        form.find("#prix").val("")
        choices[1].removeActiveItems();
        choices[2].removeActiveItems();
        // Réinitialisation de la remise
        approvisionnementForm.find("#remise-check").prop("checked", false)
        //Affichage ou non des champs de remise
        approvisionnement.remiseInputsToggle();
    },
    /* Gestion des remise */
    remiseInputsToggle: function (event = null) {
        if (event) event.preventDefault();
        let remise = approvisionnementForm.find("#remise-check").is(":checked");
        let originalPrice = approvisionnementForm.find("#prix").val();
        originalPrice = !approvisionnementItem ? originalPrice : approvisionnementItem.remise ? approvisionnementItem.discount.originalPrice : originalPrice;
        if (remise) {
            if (!approvisionnementItem && !originalPrice) {
                alertify.warning(
                    "Veuillez renseigner le prix unitaire hors taxe svp !"
                );
                approvisionnementForm.find("#remise-check").prop("checked", false)
            } else {
                approvisionnementForm.find("div#remiseInputsToggle").show();
                approvisionnementForm.find("#remise_taux").attr("required", "required");
                approvisionnementForm.find("#remise_prix_u").attr("required", "required");
                approvisionnementForm.find("#remise_description").attr("required", "required");
                // Mise à jour automatique du prix original de l'article
                approvisionnementForm.find("#remise_prix_u").val(originalPrice);
                // Mise à jour des du formulaire pour la remise
                approvisionnement.setRemiseFormOnPricesChange();
            }
        } else {
            approvisionnementForm.find("div#remiseInputsToggle").hide();
            approvisionnementForm.find("#remise_taux").removeAttr("required");
            approvisionnementForm.find("#remise_prix_u").removeAttr("required");
            approvisionnementForm.find("#remise_description").removeAttr("required");
            approvisionnementForm.find("#remise_taux").val(null);
            approvisionnementForm.find("#remise_prix_u").val(null);
            approvisionnementForm.find("#remise_description").val(null);
        }
    },
    setRemiseFormOnPricesChange: function (event = null) {
        if (event) event.preventDefault()
        var remise = approvisionnementForm.find("#remise-check").is(":checked");
        if (remise) {
            var prixUnitaire = parseInt(approvisionnementForm.find("#prix").val());
            var prixOriginale = parseInt(approvisionnementForm.find("#remise_prix_u").val());
            var taux = ((prixOriginale && prixUnitaire) && prixUnitaire < prixOriginale) ? Math.round(((prixOriginale - prixUnitaire) * 100) / prixOriginale) : 0;
            approvisionnementForm.find("#remise_taux").val(taux);
            approvisionnementForm.find("#remise_description").val("Une remise de " + taux + "%");
        } else {
            approvisionnement.remiseInputsToggle();
        }
    },
    setRemiseFormOnTauxChange: function (event = null) {
        if (event) event.preventDefault()
        var remise = approvisionnementForm.find("#remise-check").is(":checked");
        if (remise) {
            var prixOriginale = parseInt(approvisionnementForm.find("#remise_prix_u").val());
            var taux = parseInt(approvisionnementForm.find("#remise_taux").val());
            var prixUnitaire = prixOriginale ? (prixOriginale - Math.round((prixOriginale * taux) / 100)) : 0;
            approvisionnementForm.find("#prix").val(prixUnitaire);
            approvisionnementForm.find("#remise_description").val("Une remise de " + taux + "%");
        } else {
            approvisionnement.remiseInputsToggle();
        }
    },
};
$(document).ready(function() {
    approvisionnement.listInitalizer();
    approvisionnement.choicesJsInit();
    // Récupération du formulaire d'enregistrement
    approvisionnementForm = $("div.add-new-modal").find('form');
    // Récupération des articles pour le filtre
    GlobalScript.getForeignsData(URL_LIST_ARTICLE, ['articles', 'id', 'designation'], 0, null);
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        approvisionnement.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // approvisionnement.removeItem($(this));
        approvisionnement.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cet approvisionnement ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "Approvisionnement supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        approvisionnement.showItem($(this));
    });

    //Validation record
    datatable.on('click', '.validate-item', function(e) {
        e.preventDefault();
        approvisionnement.validateItem($(this));
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
        // console.log(count + ' column(s) are hidden');
    });
});