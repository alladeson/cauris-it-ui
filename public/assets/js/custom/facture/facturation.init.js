let datatable;
let choices = [];
let facturationForm;
let factureValidationForm;
let facture;
let client;
let clients;
let articles;
let article;
let factureMontantTtc = 0;
let facturation = {
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
                                        "url": FACTURE_ID ? URL_GET_ITEM.replace("__id__", FACTURE_ID) : URL_GET_FACTURE_CLIENT.replace("__clientId__", client ? client.id : 0),
                                        "method": "GET",
                                    };
                                },
                                "dataSrc": "details",
                                error: function(xhr, status, error) {
                                    (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide')
                                    alertify.error(xhr.status == 403 ? "Accès réfusé" : xhr.status == 404 ? "Aucune facture trouvée" : "Une erreur s'est produite lors de la connexion au serveur");
                                    $(".datatable").find('tbody td').html('<span class="text-danger">Echec de chargement</span>');
                                },
                            },
                            // "ajax": "/assets/js/custom/data/facture.txt",
                            columns: [{
                                        data: 'id',
                                        "class": "",
                                        "orderable": false,
                                        "searchable": false,
                                        "render": function(data, type, row, meta) {
                                            return `` +
                                                `<div class="form-check font-size-16">` +
                                                `<input type="checkbox" class="form-check-input" id="detailFacturecheck${data}">` +
                                                `<label class="form-check-label" for="detailFacturecheck${data}"></label>` +
                                                `</div>`;
                                        }
                                    },
                                    { data: 'id' },
                                    {
                                        data: 'article',
                                        "render": function(data, type, row, meta) {
                                            return data.designation;
                                        }
                                    },
                                    { data: 'quantite' },
                                    {
                                        data: 'taxe',
                                        "render": function(data, type, row, meta) {
                                            return data.groupe + " (" + data.valeur + "%)";
                                        }
                                    },
                                    { data: 'prixUnitaire' },
                                    {
                                        data: 'montantHt',
                                        "render": function(data, type, row, meta) {
                                            return data ? data : 0;
                                        }
                                    },
                                    {
                                        data: 'montantTva',
                                        "render": function(data, type, row, meta) {
                                            return data ? data : 0;
                                        }
                                    },
                                    {
                                        data: 'montantTtc',
                                        "render": function(data, type, row, meta) {
                                            return data ? data : 0;
                                        }
                                    },
                                    {
                                        data: 'taxeSpecifique',
                                        "render": function(data, type, row, meta) {
                                            return data ? data : "-";
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
                                                </li>` +
                                                    `${!row.valid ?
                            `${!row.reservation ?
                                `<li>
                                                    <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier</a>
                                                </li>`: ``}` +

                            `<li>
                                                        <a class="dropdown-item validate-item" href="javascript:void(0)" data-item-id="${data}">Valider</a>
                                                    </li>
                                                 
                                                <li>
                                                    <a class="dropdown-item remove-item" href="javascript:void(0);" data-item-id="${data}">Supprimer</a>
                                                </li>`: ''}` +
                        `</ul>
                                        </div>`;
                    return html;
                }
            }
            ],
        }),
            $(".dataTables_length select").addClass("form-select form-select-sm");
    },
    choicesJsInit: function () {
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
    saSucces: function (title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        })
    },
    saError: function (title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        })
    },
    saParams: function (title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
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
        }).then(function (e) {
            e.value ?
                facturation.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                facturation.saError(notitle, notext);
        });
    },
    saRemoveParams: function (el, title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
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
        }).then(function (e) {
            e.value ?
                facturation.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                facturation.saError(notitle, notext);
        });
    },
    saValidateItemParams: function (el, title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
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
        }).then(function (e) {
            e.value ?
                facturation.validateItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                facturation.saError(notitle, notext);
        });
    },
    saValidateFactureParams: function (title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
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
        }).then(function (e) {
            e.value ?
                facturation.validateFacture(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                facturation.saError(notitle, notext);
        });
    },
    saSuccesFactureValider: function (title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        }).then(function (e) {
            e.value ? window.open(URL_IMPRIMER_FACTURE.replace("__id__", facture.id), "_blank") : "";
            // location.href = URL_IMPRIMER_FACTURE.replace("__id__", facture.id) : "";
        });
    },
    submitFormData: function (event) {
        event.preventDefault();
        var data = facturation.dataFormat(facturationForm)
        console.log(data)
        var articleId = facturationForm.find("#article").val();
        var obj = { '__clientId__': client ? client.id : 0, '__articleId__': articleId }
        var submitUrl = GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
        // GlobalScript.request((data.id ? (URL_PUT_ITEM.replace("__id__", facture ? facture.id ? facture.id : 0 : 0)).replace("__detailId__", data.id) : URL_POST_ITEM.replace("__clientId__", client ? client.id : 0)), (data.id ? 'PUT' : 'POST'), data).then(function (data) {
        GlobalScript.request(submitUrl, 'POST', data).then(function (data) {
            // Run this when your request was successful
            facture = data
            console.log(facture)
            datatable.ajax.reload();
            alertify.success("Enregistrement effectué avec succès.");
            // Mise à jour des articles (les servicies internes)
            facturation.getForeignsData(URL_LIST_ARTICLE, ['articles', 'id', 'designation'], 2, null);
            choices[2].removeActiveItems();
            choices[3].removeActiveItems();
            facturation.getArticle();
            facturationForm.find("#item-id").val('');
            // Mise à jour du champ date du formulaire de la facture
            facturationForm.find("#date").val(((new Date()).toISOString()).slice(0, 16))
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error("Une erreur s'est produite lors de l'enregistrement.")
        });
    },
    editItem: function (el) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        //console.log(id);
        //var response = GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        GlobalScript.request((URL_GET_DETAIL_FACTURE.replace("__id__", facture ? facture.id ? facture.id : 0 : 0)).replace("__detailId__", detailId), 'GET', null).then(function (data) {
            // Run this when your request was successful
            GlobalScript.scrollToTop();
            var itemObj = data;
            console.log(itemObj);
            facturation.setformData(facturationForm, itemObj);
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error("Une erreur s'est produite lors de la modification.")
        });
    },
    showItem: function (el) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        //console.log(id);
        GlobalScript.request((URL_GET_DETAIL_FACTURE.replace("__id__", facture ? facture.id ? facture.id : 0 : 0)).replace("__detailId__", detailId), 'GET', null).then(function (data) {
            // Run this when your request was successful
            var itemObj = data;
            console.log(itemObj)
            facturation.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error("Une erreur s'est produite lors de l'affichage.")
        });
    },
    removeItem: function (el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        // console.log(id);
        GlobalScript.request((URL_DELETE_ITEM.replace("__id__", facture ? facture.id ? facture.id : 0 : 0)).replace("__detailId__", detailId), 'DELETE', null).then(function (data) {
            // Run this when your request was successful
            console.log(data)
            alertify.success(oktext);
            datatable.ajax.reload();
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error("Une erreur s'est produite lors de la suppression.")
        });
    },
    setformData: function (form, item) {
        if (form.length) {
            form.find("#item-id").val(item.id)
            // form.find("#date").val(((new Date()).toISOString()).slice(0, 16))
            form.find("#prix_u").val(item.prixUnitaire)
            form.find("#quantite").val(item.quantite)
            form.find("#taxe-specifique").val(item.taxeSpecifique)
            form.find("#remise-check").prop('checked', item.remise ? true : false);
            form.find("#remise-prix_u").val(item.originalPrice)
            form.find("#remise-description").val(item.priceModification)
            choices[1].setChoiceByValue(client.id)
            choices[3].setChoiceByValue(item.taxe.id);
            choices[2].setChoiceByValue(item.article ? item.article.id : 0)
            facturation.setMontant();
        }
    },
    dataFormat: function (form) {
        if (form.length) {
            data = {
                'id': form.find("#item-id").val(),
                "quantite": form.find("#quantite").val(),
                "unite": "U",
                "prixUnitaire": form.find("#prix_u").val(),
                "taxeSpecifique": form.find("#taxe-specifique").val(),
                "remise": form.find("#remise-check").is(':checked'),
                "originalPrice": form.find("#remise-check").is(':checked') ? form.find("#remise_prix_u").val() : "",
                "priceModification": form.find("#remise-check").is(':checked') ? form.find("#remise_description").val() : "",
                "taxeId": form.find("#taxe").val(),
                "tfId": form.find("#type").val(),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    validationDataFormat: function (form) {
        if (form.length) {
            data = {
                "aibId": form.find("#aib").val(),
                "typePaiementId": form.find("#type-paiement").val(),
                "montantRecu": form.find("#montant-recu").val(),
                "montantPayer": form.find("#montant-payer").val(),
                "montantRendu": form.find("#montant-rendu").val(),
                "description": $.trim(form.find("#description").val()),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    validateItem: function (el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        // console.log(id);
        GlobalScript.request((URL_VALIDER_DETAIL_FACTURE.replace("__id__", facture ? facture.id ? facture.id : 0 : 0)).replace("__detailId__", detailId), 'PUT', null).then(function (data) {
            // Run this when your request was successful
            console.log(data)
            alertify.success(oktext);
            datatable.ajax.reload();
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error("Une erreur s'est produite lors de la validation.")
        });
    },
    validateFacture: function (oktitle, oktext) {
        var data = facturation.validationDataFormat(factureValidationForm)
        console.log(data)
        GlobalScript.request(URL_VALIDER_FACTURE.replace("__id__", facture ? facture.id ? facture.id : 0 : 0), 'PUT', data).then(function (data) {
            // Run this when your request was successful
            facture = data
            console.log(facture)
            alertify.success(oktext);
            datatable.ajax.reload();
            facturation.saSuccesFactureValider("Validée !", "Facture validée avec succès ! Cliquer sur 'OK' pour afficher la facture.");
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error("Une erreur s'est produite lors de la validation.")
        });
    },
    // Récupération de la liste des articles ou des clients
    getForeignsData: function (url, selectData = [], choicePosition, itemId) {
        GlobalScript.request(url, 'GET', null).then(function (data) {
            // Run this when your request was successful
            dataJon = data;
            console.log(dataJon);
            choices[choicePosition].clearChoices();
            choices[choicePosition].setChoices(dataJon, selectData[1], selectData[2]);
            if (itemId) choices[choicePosition].setChoiceByValue(itemId);
            // Vérification si l'ID de la facture provient de l'URL
            if (FACTURE_ID && selectData[0] == "clients") {
                // Récupération de la facture et recharge du tablau des lignes de la facture
                facturation.getFactureById(FACTURE_ID)
            }
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? `Récupération de la liste des ${selectData[0]} : Accès réfusé` : `Une erreur s'est produite lors de la récupération des ${selectData[0]}`);
        });
    },
    reloadDatatable: function (event) {
        event.preventDefault();
        // Remise à null de l'ID de facture venant de l'url de la page
        FACTURE_ID = null
        var clientId = facturationForm.find("#client").val();
        console.log('client id : ' + clientId);
        if (clientId)
            facturation.getEntity(URL_GET_CLIENT, clientId, 'client')
        else {
            client = null;
            datatable.ajax.reload();
        }
        facturation.getEntity(URL_GET_FACTURE_CLIENT.replace("__clientId__", clientId ? clientId : 0), clientId, 'facture')
    },
    getArticle: function (event = null) {
        if (event) event.preventDefault();
        console.log('ici')
        var serviceId = facturationForm.find("#article").val();
        console.log(serviceId)
        if (serviceId)
            facturation.getEntity(URL_GET_ARTICLE, serviceId, "l'article")
        else {
            article = null
            facturation.setFormOnArticleChange()
        }
    },
    setFormOnArticleChange: function () {
        console.log(article)
        facturationForm.find("#prix_u").val(article ? article.prix : 0)
        facturationForm.find("#quantite").val(1)
        facturationForm.find("#montant").val(article ? article.prix : 0)
        facturationForm.find("#taxe-specifique").val(article ? article.taxeSpecifique : 0)
        choices[3].setChoiceByValue(article?.taxe.id);
    },
    setMontant: function (event = null) {
        if (event) event.preventDefault();
        var prixU = facturationForm.find("#prix_u").val();
        var quantite = facturationForm.find("#quantite").val();
        var montant;
        if (prixU && quantite)
            montant = prixU * quantite;
        else
            montant = 0;
        facturationForm.find("#montant").val(montant)
    },
    getEntity: function (url, id, dataname = 'donnée', reloadDatatable = false) {
        GlobalScript.request(url.replace("__id__", id), 'GET', null).then(function (data) {
            // Run this when your request was successful
            dataJson = data;
            console.log(dataJson);
            if (dataname == 'client') {
                client = dataJson
                datatable.ajax.reload();
            }
            if (dataname == "l'article") {
                article = dataJson
                facturation.setFormOnArticleChange()
            }

            if (dataname == "facture") {
                facture = dataJson
                // Mise à jour du type de la facture
                if (facture.type) choices[0].setChoiceByValue(facture.type.id);
            }
            return dataJson;
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? `Récupération de ${dataname} : Accès réfusé` : `Une erreur s'est produite lors de la récupération de ${dataname}`);
        });
    },
    setShowingTable: function (itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-designation').text(itemObj.reservation ? "Réservation" : itemObj.designation);
        $showClasseTable.find('.td-quantite').text(itemObj.quantite);
        $showClasseTable.find('.td-prixUnitaire').text(itemObj.prix);
        $showClasseTable.find('.td-taxe').text(itemObj.taxe + "%");
        $showClasseTable.find('.td-montantHt').text(itemObj.montantHt);
        $showClasseTable.find('.td-montantTva').text(itemObj.montantTva);
        $showClasseTable.find('.td-montantTtc').text(itemObj.montantTtc);
        let html = ``;
        if (itemObj.valid)
            html = `<span class="text-success">Validé</span>`;
        else
            html = `<span class="text-warning">Non-Validé</span>`;
        $showClasseTable.find('.td-statut').html(html);
    },
    getFactureById: function (factureId) {
        GlobalScript.request(URL_GET_ITEM.replace("__id__", factureId), 'GET', null).then(function (data) {
            // Run this when your request was successful
            dataJson = data;
            console.log(dataJson);
            facture = dataJson
            client = facture.client
            choices[0].setChoiceByValue(facture.type.id)
            choices[1].setChoiceByValue(client.id)
            datatable.ajax.reload()
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            alertify.error(err.status == 403 ? `Récupération de la liste de la facture : Accès réfusé` : `Une erreur s'est produite lors de la récupération de la facture`);
        });
    },
    confirmInvoiceValidation: function (event) {
        event.preventDefault();
        facturation.saValidateFactureParams("Êtes-vous sûr de vouloir valider cette facture ?", "Cette opération est irréversible !", "Oui, valider !", "Non, annuller !", "Validée !", "Validation effectuée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    },
    setValidationForm: function (event = null) {
        if (event) event.preventDefault();
        var montantRecu = factureValidationForm.find("#montant-recu").val();
        if (!montantRecu || montantRecu < facture.montantTtc) {
            alertify.error("Le montant reçu doit être supérieur ou égal au montant T.T.C de la facture");
            factureValidationForm.find("#montant-payer").val(0)
            factureValidationForm.find("#montant-rendu").val(0)
            return false;
        }
        var montantRendu = montantRecu - facture.montantTtc;

        factureValidationForm.find("#montant-recu").val(montantRecu)
        factureValidationForm.find("#montant-payer").val(facture.montantTtc)
        factureValidationForm.find("#montant-rendu").val(montantRendu)
    },
    setValidatonFormRecapTable: function () {
        var $validationFormRecpaTable = $('table.invoice-validation-table');
        $validationFormRecpaTable.find('.td-invoice-mht').text(facture.montantHt ? facture.montantHt : "-");
        $validationFormRecpaTable.find('.td-invoice-mtva').text(facture.montantTva ? facture.montantTva : "-");
        $validationFormRecpaTable.find('.td-invoice-tsHt').text(facture.tsHt ? facture.tsHt : "-");
        $validationFormRecpaTable.find('.td-invoice-tsTtc').text(facture.tsTtc ? facture.tsTtc : "-");
        $validationFormRecpaTable.find('.td-invoice-aib').text(facture.montantAib ? facture.montantAib : "-");
        $validationFormRecpaTable.find('.td-invoice-mttc').text(facture.montantTtc ? facture.montantTtc : "-");
        let html = ``;
        if (facture.valid)
            html = `<span class="text-success">Validé</span>`;
        else
            html = `<span class="text-warning">En attente de validation</span>`;
        $validationFormRecpaTable.find('.td-invoice-status').html(html);
    },
    setRecapTableOnAibChange: function (event = null) {
        if (event) event.preventDefault();
        var aibId = factureValidationForm.find("#aib").val();
        if (aibId) {
            GlobalScript.request(URL_GET_TAXE.replace("__id__", aibId), 'GET', null).then(function (data) {
                // Run this when your request was successful
                var aib = data;
                console.log(aib);
                // Mise à jour du montant aib
                if (!factureMontantTtc)
                    factureMontantTtc = facture.montantTtc;
                var montantAib = Math.round((facture.montantHt * aib.valeur) / 100);
                var montantTtc = factureMontantTtc + montantAib;
                facture.montantAib = montantAib;
                facture.montantTtc = montantTtc;
                facturation.setValidatonFormRecapTable();
            }).catch(function (err) {
                // Run this when promise was rejected via reject()
                console.log(err)
                alertify.error(`Une erreur s'est produite lors de la récupération de l'aib`);
            });
        }
    }
};
$(document).ready(function () {
    facturation.listInitalizer();
    // Edit record
    datatable.on('click', '.edit-item', function (e) {
        e.preventDefault();
        facturation.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function (e) {
        e.preventDefault();
        //facturation.removeItem($(this));
        facturation.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cette ligne de facture ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimée !", "Suppression effectuée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function (e) {
        e.preventDefault();
        facturation.showItem($(this));
    });

    //Validate record
    datatable.on('click', '.validate-item', function (e) {
        e.preventDefault();
        // facturation.validateItem($(this));
        facturation.saValidateItemParams($(this), "Êtes-vous sûr de vouloir valider cette ligne de facture ?", "Cette opération est irréversible !", "Oui, valider !", "Non, annuller !", "Validée !", "Validation effectuée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Validate facture
    $("a.validate-facture").click(function (e) {
        e.preventDefault();
        console.log('ici')
        if (facture && facture.valid) {
            alertify.warning("Cette facture est déjà validée")
        } else if (facture && facture.details) {
            facturation.setValidatonFormRecapTable();
            facturation.getForeignsData(URL_LIST_TAXE_AIB, ['taux aib', 'id', 'string'], 4, null);
            facturation.getForeignsData(URL_LIST_TYPE_PAIEMENT, ['types de paiement', 'id', 'description'], 5, null);
            $("#validate-invoice-modal").modal('toggle');
        } else {
            alertify.warning("Veuillez ajouter un article à la facture en remplissant le formulaire de facturation")
            // Scroller la page vers le haut
            GlobalScript.scrollToTop();
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    facturation.choicesJsInit();
    facturationForm = $("div#facturationForm").find("form");
    factureValidationForm = $("div#validate-invoice-modal").find("form");
    facturation.getForeignsData(URL_LIST_TYPE_FACTURE, ['types de facture', 'id', 'description'], 0, null);
    facturation.getForeignsData(URL_LIST_CLIENT, ['clients', 'id', 'name'], 1, null);
    facturation.getForeignsData(URL_LIST_ARTICLE, ['articles', 'id', 'designation'], 2, null);
    facturation.getForeignsData(URL_LIST_TAXE, ['taxes', 'id', 'string'], 3, null);
    // Mise à jour du champ date du formulaire de la facture
    // facturationForm.find("#date").val(((new Date()).toISOString()).slice(0, 16))
});