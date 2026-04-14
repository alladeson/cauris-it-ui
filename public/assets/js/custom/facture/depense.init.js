let datatable;
let choices = [];
let depenseForm;
let depenseItem;
let url_get_list_item = URL_LIST_ITEM;
let statsPayload = {
    "debut": null,
    "fin": null,
};
let depense = {
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
                            "data": JSON.stringify(statsPayload),
                        };
                    },
                    "dataSrc": "",
                    error: function(xhr, status, error) {
                        (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide')
                        GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des depenses");
                        $(".datatable").find('tbody td').html('<span class="text-danger">Echec de chargement</span>');
                    }
                },
                // "ajax": "/assets/js/custom/data/depense.txt",
                columns: [{
                        data: 'id',
                        "class": "",
                        "orderable": false,
                        "searchable": false,
                        "render": function(data, type, row, meta) {
                            return `` +
                                `<div class="form-check font-size-16">` +
                                `<input type="checkbox" class="form-check-input" id="depensecheck${data}">` +
                                `<label class="form-check-label" for="depensecheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { data: 'nom' },
                    { data: 'montant'},                    
                    { 
                        data: 'datePaiement',
                        "render": function(data, type, row, meta) {
                            return data != null ? GlobalScript.dateFormat(data) : "-";
                        }
                    },
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
                depense.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                depense.saError(notitle, notext);
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
                depense.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                depense.saError(notitle, notext);
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
                depense.submitValidationForm(elId, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                depense.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        let form = $("div.add-new-modal").find('form');
        let data = depense.dataFormat(form)
        let dataId = form.find("#item-id").val();
        if(GlobalScript.traceFormChange(dataId)) return;
        // Formatage de URL de création et/ou de mise à jour
        let obj = { '__id__': dataId }
        let submitUrl = dataId ? GlobalScript.textMultipleReplace(URL_PUT_ITEM, obj) : GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
        GlobalScript.request(submitUrl, (dataId ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            datatable.ajax.reload();
            // depense.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
            if (dataId) $("div.add-new-modal").modal('hide')
            // Réinitialisation du formulaire
            depense.resetFormData(form);
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
            depense.setShowingTable(itemObj);
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
            depenseItem = data;
            //
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            depense.setformData($("div.add-new-modal").find('form'), itemObj);
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
                // depense.saSucces(oktitle, oktext);
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
            form.find("#nom").val(item.nom)
            form.find("#montant").val(item.montant)
            form.find("#date-paiement").val(item.datePaiement ? GlobalScript.dateFormatTolocalString(item.datePaiement) : "")
            form.find("#description").val(item.description)
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            var date_paiement = new Date(form.find("#date-paiement").val());
            data = {
                'id': GlobalScript.checkBlank(form.find("#item-id").val()),
                'nom': GlobalScript.checkBlank(form.find("#nom").val()),
                'montant': GlobalScript.checkBlank(form.find("#montant").val()),
                'datePaiement': GlobalScript.checkBlank((date_paiement.toISOString()).slice(0, 19)),
                'description': GlobalScript.checkBlank(form.find("#description").val())
            };
            return JSON.stringify(data);
        }
        return null;
    },
    newItemEvent: function(event) {
        event.preventDefault();
        // Mise à jour de l'item
        depenseItem = null;
        //
        $("div.add-new-modal").find('h5.modal-title').text('Nouvel ajout');
        let form = $("div.add-new-modal").find('form');
        depense.resetFormData(form);
        // form[0].reset();
        //
        // form.find("#item-id").val("");
    },
    reloadDatatable: function(event) {
        /*// Prevent event
        event.preventDefault();
        // Récupération de l'id de l'article du filtre
        let articleId = parseInt($("#filtre-article").val());
        // Si l'article du filtre existe, redéfinir l'url de liste des items
        if(articleId){
            url_get_list_item = URL_LIST_ITEM_PAR_ARTICLE.replace("__artId__", articleId);
        } else {
            url_get_list_item = URL_LIST_ITEM;
        }*/
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        let $showClasseTable = $("table.item-show-table");
        //Affichage générale
        $showClasseTable.find(".td-detail-nom").text(itemObj.nom);
        $showClasseTable.find(".td-detail-montant").text(itemObj.montant);
        $showClasseTable.find(".td-detail-date-paiement").text(itemObj.datePaiement ? GlobalScript.dateFormatTolocalString(itemObj.datePaiement) : "-");
        $showClasseTable.find(".td-detail-reference-facture").text(itemObj.referenceFacture ? itemObj.referenceFacture : "-");
        $showClasseTable.find(".td-detail-description").text(itemObj.description ? itemObj.description : "-");
    },
    validateItem: function (el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //
        let form = $("div.validation-modal").find('form');
        form[0].reset();
        form.attr("onsubmit", `depense.saValidationParams(event, ${id}, "Êtes-vous sûr de vouloir valider cette dépense ?", "Cette opération est irréversible !", "Oui, valider !", "Non, annuller !", "Supprimé !", "Dépense validée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.")`);
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
        form.find("#item-id").val("");
        form.find("#nom").val("");
        form.find("#montant").val("");
        form.find("#date-paiement").val(GlobalScript.getCurrentDateTime());
        form.find("#description").val("");
    },
};
$(document).ready(function() {
    depense.listInitalizer();
    // Récupération du formulaire d'enregistrement
    depenseForm = $("div.add-new-modal").find('form');
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        depense.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // depense.removeItem($(this));
        depense.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cet depense ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "Dépense supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        depense.showItem($(this));
    });

    //Validation record
    datatable.on('click', '.validate-item', function(e) {
        e.preventDefault();
        depense.validateItem($(this));
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
    // Set the default dateDebut to the start of the current day
    GlobalScript.setDateDebutDefaultValue();
    // Set the default dateFin to the end of the current day
    document.getElementById("date-fin").value = GlobalScript.getDateFinJour();
    // Récupération du formulaire du filtre
    filtreForm = $("form.filtre-form");
    // Lors de la soumission du formulaire de filtre, c'est-à-dire en cliquant sur le bouton de recherche
    filtreForm.submit(function (event) {
        event.preventDefault();
        // Si les dates ne sont pas renseignées, alors un avertissement est renvoyer et le code s'arrête là
        if (!filtreForm.find("input#date-debut").val() || !filtreForm.find("input#date-fin").val()) {
            alertify.warning("Veuillez bien renseigner les date de début et de fin svp. Merci !");
            return;
        }
        // Récupération des dates de début et de fin
        var debut = new Date(filtreForm.find("input#date-debut").val());
        var fin = new Date(filtreForm.find("input#date-fin").val());
        // Comparaison des dates, la date de fin doit être supérieure à la date de début
        if (fin.getTime() <= debut.getTime()) {
            alertify.error("La date de fin doit être supérieure à la date de début");
            return;
        }else {
            // statsPayload.debut = filtreForm.find("input#date-debut").val();
            // statsPayload.fin = filtreForm.find("input#date-fin").val();
            statsPayload.debut = (debut.toISOString()).slice(0, 19);
            statsPayload.fin = (fin.toISOString()).slice(0, 19);
            // console.log(statsPayload);
            datatable.ajax.reload();
            return;
        }
    });
});