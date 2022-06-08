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
let taxeSpecifique = null;
let factureAvoir = {
        listInitalizer: function() {
                // $(".datatable").DataTable({ responsive: !1 }),
                (datatable = $(".datatable").DataTable({
                            language: {
                                //"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                                url: "/assets/i18n/French.json",
                            },
                            ajax: {
                                type: "POST",
                                url: URL_GLOBAL_REQUEST,
                                data: function() {
                                    return (data = {
                                        url: FACTURE_ID ?
                                            URL_GET_ITEM.replace("__id__", FACTURE_ID) : URL_GET_FACTURE_CLIENT.replace(
                                                "__clientId__",
                                                client ? client.id : 0
                                            ),
                                        method: "GET",
                                    });
                                },
                                dataSrc: "details",
                                error: function(xhr, status, error) {
                                    (waitMe_zone.length ? waitMe_zone : $("body")).waitMe("hide");
                                    GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération de la facture");
                                    $(".datatable")
                                        .find("tbody td")
                                        .html('<span class="text-danger">Echec de chargement</span>');
                                },
                            },
                            // "ajax": "/assets/js/custom/data/facture.txt",
                            columns: [{
                                        data: "id",
                                        class: "",
                                        orderable: false,
                                        searchable: false,
                                        render: function(data, type, row, meta) {
                                            return (
                                                `` +
                                                `<div class="form-check font-size-16">` +
                                                `<input type="checkbox" class="form-check-input" id="detailFacturecheck${data}">` +
                                                `<label class="form-check-label" for="detailFacturecheck${data}"></label>` +
                                                `</div>`
                                            );
                                        },
                                    },
                                    { data: "id" },
                                    {
                                        data: "article",
                                        render: function(data, type, row, meta) {
                                            return data.designation;
                                        },
                                    },
                                    { data: "quantite" },
                                    {
                                        data: "taxe",
                                        render: function(data, type, row, meta) {
                                            return data.groupe + " (" + data.valeur + "%)";
                                        },
                                    },
                                    { data: "prixUnitaire" },
                                    {
                                        data: "montantHt",
                                        render: function(data, type, row, meta) {
                                            return data ? data : 0;
                                        },
                                    },
                                    {
                                        data: "montantTva",
                                        render: function(data, type, row, meta) {
                                            return data ? data : 0;
                                        },
                                    },
                                    {
                                        data: "montantTtc",
                                        render: function(data, type, row, meta) {
                                            return data ? data : 0;
                                        },
                                    },
                                    {
                                        data: "taxeSpecifique",
                                        render: function(data, type, row, meta) {
                                            return data ? data : "-";
                                        },
                                    },
                                    {
                                        data: "id",
                                        class: "",
                                        orderable: false,
                                        searchable: false,
                                        render: function(data, type, row, meta) {
                                                let html =
                                                    `<div class="dropdown">
                                <button class="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bx bx-dots-horizontal-rounded"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <a class="dropdown-item show-item" href="javascript:void(0);" data-item-id="${data}">Afficher</a>
                                    </li>
                                    ${!row.valid ?
                                        `<li>
                                        <a class="dropdown-item remove-item" href="javascript:void(0);" data-item-id="${data}">Supprimer</a>
                                        </li>`
                                        : "" }
                                </ul>
                            </div>`;
                        return html;
                        // <li>
                        //     <a class="dropdown-item validate-item" href="javascript:void(0)" data-item-id="${data}">Valider</a>
                        // </li>
                    },
                },
            ],
        })),
        $(".dataTables_length select").addClass("form-select form-select-sm");
    },
    choicesJsInit: function() {
        var e = document.querySelectorAll("[data-trigger]");
        for (i = 0; i < e.length; ++i) {
            var a = e[i];
            choices[i] = new Choices(a, {
                loadingText: "Chargement...",
                noResultsText: "Aucun résultat trouvé",
                noChoicesText: "Pas de choix à effectuer",
                itemSelectText: "Appuyez pour sélectionner",
                position: "bottom",
                removeItemButton: true,
                duplicateItemsAllowed: !1,
                shouldSort: false,
                searchEnabled: $.inArray(i, [0, 3, 4, 5]) > -1 ? false : true,
            });
        }
    },
    saSucces: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        });
    },
    saError: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        });
    },
    saParams: function(
        title,
        text,
        confirmButtonText,
        cancelButtonText,
        oktitle,
        oktext,
        notitle,
        notext
    ) {
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
                factureAvoir.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                factureAvoir.saError(notitle, notext);
        });
    },
    saRemoveParams: function(
        el,
        title,
        text,
        confirmButtonText,
        cancelButtonText,
        oktitle,
        oktext,
        notitle,
        notext
    ) {
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
                factureAvoir.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                factureAvoir.saError(notitle, notext);
        });
    },
    saValidateItemParams: function(
        el,
        title,
        text,
        confirmButtonText,
        cancelButtonText,
        oktitle,
        oktext,
        notitle,
        notext
    ) {
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
                factureAvoir.validateItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                factureAvoir.saError(notitle, notext);
        });
    },
    saValidateFactureParams: function(
        title,
        text,
        confirmButtonText,
        cancelButtonText,
        oktitle,
        oktext,
        notitle,
        notext
    ) {
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
                factureAvoir.validateFacture(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                factureAvoir.saError(notitle, notext);
        });
    },
    saSuccesFactureValider: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        }).then(function(e) {
            e.value ?
                GlobalScript.showPrintedInvoice(facture) : "";
                $("#validate-invoice-modal").modal("toggle");
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var data = factureAvoir.dataFormat(facturationForm);
        console.log(data);
        var articleId = facturationForm.find("#article").val();
        var obj = {
            __clientId__: client ? client.id : 0,
            __articleId__: articleId,
        };
        var submitUrl = GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
        // GlobalScript.request((data.id ? (URL_PUT_ITEM.replace("__id__", facture ? facture.id ? facture.id : 0 : 0)).replace("__detailId__", data.id) : URL_POST_ITEM.replace("__clientId__", client ? client.id : 0)), (data.id ? 'PUT' : 'POST'), data).then(function (data) {
        GlobalScript.request(submitUrl, "POST", data)
            .then(function(data) {
                // Run this when your request was successful
                facture = data;
                console.log(facture);
                datatable.ajax.reload();
                alertify.success("Ajout effectué avec succès.");
                // Mise à jour des articles (les servicies internes)
                factureAvoir.getForeignsData(
                    URL_LIST_ARTICLE, ["articles", "id", "designation"],
                    2,
                    null
                );
                choices[2].removeActiveItems();
                choices[3].removeActiveItems();
                factureAvoir.getArticle();
                facturationForm.find("#item-id").val("");
                //Affichage ou non des champs de remise
                factureAvoir.remiseInputsToggle();
                // Mise à jour du champ date du formulaire de la facture
                // facturationForm.find("#date").val(new Date().toISOString().slice(0, 16));
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "l'enregistrement");
            });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        //console.log(id);
        //var response = GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        GlobalScript.request(
                URL_GET_DETAIL_FACTURE.replace(
                    "__id__",
                    facture ? (facture.id ? facture.id : 0) : 0
                ).replace("__detailId__", detailId),
                "GET",
                null
            )
            .then(function(data) {
                // Run this when your request was successful
                GlobalScript.scrollToTop();
                var itemObj = data;
                console.log(itemObj);
                // Sauvegarde la taxe spécifique si existante sinon null
                taxeSpecifique = itemObj.ts ? itemObj.ts.tsUnitaire : null;
                factureAvoir.setformData(facturationForm, itemObj);
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la modification");;
            });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        //console.log(id);
        GlobalScript.request(
                URL_GET_DETAIL_FACTURE.replace(
                    "__id__",
                    facture ? (facture.id ? facture.id : 0) : 0
                ).replace("__detailId__", detailId),
                "GET",
                null
            )
            .then(function(data) {
                // Run this when your request was successful
                var itemObj = data;
                console.log(itemObj);
                // Sauvegarde la taxe spécifique si existante sinon null
                taxeSpecifique = itemObj.ts ? itemObj.ts.tsUnitaire : null;
                factureAvoir.setShowingTable(itemObj);
                $(".show-item-modal").modal("show");
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "l'affichage");
            });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        // console.log(id);
        GlobalScript.request(
                URL_DELETE_ITEM.replace(
                    "__id__",
                    facture ? (facture.id ? facture.id : 0) : 0
                ).replace("__detailId__", detailId),
                "DELETE",
                null
            )
            .then(function(data) {
                // Run this when your request was successful
                console.log(data);
                alertify.success(oktext);
                datatable.ajax.reload();
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la suppression");
            });
    },
    setformData: function(form, item) {
        if (form.length) {
            form.find("#item-id").val(item.id);
            // form.find("#date").val(((new Date()).toISOString()).slice(0, 16))
            form.find("#prix_u").val(item.prixUnitaire);
            form.find("#quantite").val(item.quantite);
            // form.find("#taxe-specifique").val(item.taxeSpecifique);
            form.find("#remise-check").prop("checked", item.remise ? true : false);
            form.find("#remise_prix_u").val(item.originalPrice);
            form.find("#remise_description").val(item.priceModification);
            choices[1].setChoiceByValue(client.id);
            choices[3].setChoiceByValue(item.taxe.id);
            choices[2].setChoiceByValue(item.article ? item.article.id : 0);
            factureAvoir.setMontant();
            // Affichage ou non des champs de la remise
            factureAvoir.remiseInputsToggle();
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            data = {
                id: form.find("#item-id").val(),
                quantite: form.find("#quantite").val(),
                unite: "U",
                prixUnitaire: form.find("#prix_u").val(),
                taxeSpecifique: form.find("#taxe-specifique").val(),
                remise: form.find("#remise-check").is(":checked"),
                originalPrice: form.find("#remise-check").is(":checked") ?
                    form.find("#remise_prix_u").val() : "",
                priceModification: form.find("#remise-check").is(":checked") ?
                    form.find("#remise_description").val() : "",
                taxeId: form.find("#taxe").val(),
                tfId: form.find("#type").val(),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    validationDataFormat: function(form) {
        if (form.length) {
            data = {
                aibId: form.find("#aib").val(),
                typePaiementId: form.find("#type-paiement").val(),
                montantRecu: form.find("#montant-recu").val(),
                montantPayer: form.find("#montant-payer").val(),
                montantRendu: form.find("#montant-rendu").val(),
                description: $.trim(form.find("#description").val()),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    validateItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        // console.log(id);
        GlobalScript.request(
                URL_VALIDER_DETAIL_FACTURE.replace(
                    "__id__",
                    facture ? (facture.id ? facture.id : 0) : 0
                ).replace("__detailId__", detailId),
                "PUT",
                null
            )
            .then(function(data) {
                // Run this when your request was successful
                console.log(data);
                alertify.success(oktext);
                datatable.ajax.reload();
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la validation");
            });
    },
    validateFacture: function(oktitle, oktext) {
        GlobalScript.request(
                URL_VALIDER_FACTURE_AVOIR.replace(
                    "__id__",
                    facture ? (facture.id ? facture.id : 0) : 0
                ),
                "PUT",
                null
            )
            .then(function(data) {
                // Run this when your request was successful
                facture = data;
                console.log(facture);
                alertify.success(oktext);
                datatable.ajax.reload();
                factureAvoir.saSuccesFactureValider(
                    "Validée !",
                    "Facture validée avec succès ! Cliquer sur 'OK' pour afficher la facture."
                );
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la validation");
            });
    },
    // Récupération de la liste des articles ou des clients
    getForeignsData: function(url, selectData = [], choicePosition, itemId) {
        GlobalScript.request(url, "GET", null)
            .then(function(data) {
                // Run this when your request was successful
                dataJon = data;
                console.log(dataJon);
                choices[choicePosition].clearChoices();
                choices[choicePosition].setChoices(
                    dataJon,
                    selectData[1],
                    selectData[2]
                );
                if (itemId) choices[choicePosition].setChoiceByValue(itemId);
                // Vérification si l'ID de la facture provient de l'URL
                if (FACTURE_ID && selectData[0] == "clients") {
                    // Récupération de la facture et recharge du tablau des lignes de la facture
                    factureAvoir.getFactureById(FACTURE_ID);
                }
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération des " + selectData[0]);
            });
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        // Remise à null de l'ID de facture venant de l'url de la page
        FACTURE_ID = null;
        var clientId = facturationForm.find("#client").val();
        console.log("client id : " + clientId);
        if (clientId) factureAvoir.getEntity(URL_GET_CLIENT, clientId, "client");
        else {
            client = null;
            datatable.ajax.reload();
        }
        factureAvoir.getEntity(
            URL_GET_FACTURE_CLIENT.replace("__clientId__", clientId ? clientId : 0),
            clientId,
            "facture"
        );
    },
    getArticle: function(event = null) {
        if (event) event.preventDefault();
        console.log("ici");
        var serviceId = facturationForm.find("#article").val();
        console.log(serviceId);
        if (serviceId)
            factureAvoir.getEntity(URL_GET_ARTICLE, serviceId, "l'article");
        else {
            article = null;
            factureAvoir.setFormOnArticleChange();
        }
    },
    setFormOnArticleChange: function() {
        console.log(article);
        facturationForm.find("#prix_u").val(article ? article.prix : null);
        facturationForm.find("#quantite").val(null);
        facturationForm.find("#montant").val(article ? article.prix : null);
        facturationForm
            .find("#taxe-specifique")
            .val(article ? article.taxeSpecifique : null);
        choices[3].setChoiceByValue(article ? article.taxe.id : "");
        // Gestion des remise
        facturationForm.find("#remise-check").prop("checked", false);
        facturationForm.find("#remise_prix_u").val(null);
        facturationForm.find("#remise_description").val(null);
    },
    setMontant: function(event = null) {
        if (event) event.preventDefault();
        var prixU = facturationForm.find("#prix_u").val();
        var quantite = facturationForm.find("#quantite").val();
        // Gestion du montant
        var montant = 0;
        if (prixU && quantite) montant = prixU * quantite;
        facturationForm.find("#montant").val(montant);
        // Gestion de la taxe spécifique
        var montantTs = taxeSpecifique ? (taxeSpecifique * quantite) : null;
        facturationForm.find("#taxe-specifique").val(montantTs);
    },
    getEntity: function(url, id, dataname = "donnée", reloadDatatable = false) {
        GlobalScript.request(url.replace("__id__", id), "GET", null)
            .then(function(data) {
                // Run this when your request was successful
                dataJson = data;
                console.log(dataJson);
                if (dataname == "client") {
                    client = dataJson;
                    datatable.ajax.reload();
                }
                if (dataname == "l'article") {
                    article = dataJson;
                    // Sauvegarde de la taxe spécique si existante sinon null
                    taxeSpecifique = article.taxeSpecifique;
                    factureAvoir.setFormOnArticleChange();
                }

                if (dataname == "facture") {
                    facture = dataJson;
                    // Mise à jour du type de la facture
                    if (facture.type) choices[0].setChoiceByValue(facture.type.id);
                }
                return dataJson;
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération de " + dataname);
            });
    },
    setShowingTable: function(itemObj) {

        //Affichage générale
        var $showClasseTable = $("table.item-show-table");
        $showClasseTable.find(".td-detail-reference").text(itemObj.id);
        $showClasseTable
            .find(".td-detail-designation")
            .text(itemObj.name);
        $showClasseTable.find(".td-detail-quantite").text(itemObj.quantite);
        $showClasseTable.find(".td-detail-prixUnitaire").text(itemObj.prixUnitaire);
        $showClasseTable.find(".td-detail-taxe").text(itemObj.taxe.string);

        // Affichage taxe spécifique et remise
        var $tsRemmiseShowTable = $("table.ts-remise-show-table");
        $tsRemmiseShowTable.find(".td-detail-ts").text(taxeSpecifique ? taxeSpecifique : "-");
        $tsRemmiseShowTable.find(".td-detail-remise").text(itemObj.remise ? "Oui" : "Non");
        $tsRemmiseShowTable.find(".td-detail-remise-taux").text(itemObj.remise ? itemObj.discount.taux + "%" : "-");
        $tsRemmiseShowTable.find(".td-detail-remise-prix-u").text(itemObj.remise ? itemObj.discount.originalPrice : "-");
        $tsRemmiseShowTable.find(".td-detail-remise-description").text(itemObj.remise ? itemObj.discount.priceModification : "-");
        if (!itemObj.remise) $tsRemmiseShowTable.find(".tr-detail-remise").hide();

        // Affichage des montants
        var $detailRecpMontantTable = $("table.detail-recap-montant-table");
        $detailRecpMontantTable
            .find(".td-detail-mht")
            .text(itemObj.montantHt ? itemObj.montantHt : "-");
        $detailRecpMontantTable
            .find(".td-detail-mtva")
            .text(itemObj.montantTva ? itemObj.montantTva : "-");
        $detailRecpMontantTable
            .find(".td-detail-tsHt")
            .text(itemObj.taxeSpecifique ? itemObj.taxeSpecifique : "-");
        $detailRecpMontantTable
            .find(".td-detail-tsTtc")
            .text(itemObj.tsTtc ? itemObj.tsTtc : "-");
        $detailRecpMontantTable
            .find(".td-detail-mttc")
            .text(itemObj.montantTtc ? itemObj.montantTtc : "-");

        // let html = ``;
        // if (itemObj.valid) html = `<span class="text-success">Validé</span>`;
        // else html = `<span class="text-warning">Non-Validé</span>`;
        // $showClasseTable.find(".td-detail-statut").html(html);
    },
    getFactureById: function(factureId) {
        GlobalScript.request(URL_GET_ITEM.replace("__id__", factureId), "GET", null)
            .then(function(data) {
                // Run this when your request was successful
                console.log(data);
                facture = data;
                client = facture.client;
                facturationForm.find("#type").val(facture.type.description);
                facturationForm.find("#client").val(client.name);
                facturationForm.find("#nombre-article").val(facture.details.length);
                if (facture.confirm) {
                    $("a.validate-facture").hide()
                    $("a.print-facture").show()
                } else {
                    $("a.validate-facture").show();
                    $("a.print-facture").hide();
                }
            })
            .catch(function(err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération de la facture");
            });
    },
    confirmInvoiceValidation: function(event) {
        event.preventDefault();
        factureAvoir.saValidateFactureParams(
            "Êtes-vous sûr de vouloir valider cette facture ?",
            "Cette opération est irréversible !",
            "Oui, valider !",
            "Non, annuler !",
            "Validée !",
            "Validation effectuée avec succès.",
            "annulée !",
            "Opération annulée, rien n'a changé."
        );
    },
    setValidationForm: function(event = null) {
        if (event) event.preventDefault();
        var montantRecu = factureValidationForm.find("#montant-recu").val();
        if (!montantRecu || montantRecu < facture.montantTtc) {
            alertify.error(
                "Le montant reçu doit être supérieur ou égal au montant T.T.C de la facture"
            );
            factureValidationForm.find("#montant-payer").val(null);
            factureValidationForm.find("#montant-rendu").val(null);
            return false;
        }
        var montantRendu = montantRecu - facture.montantTtc;

        factureValidationForm.find("#montant-recu").val(montantRecu);
        factureValidationForm.find("#montant-payer").val(facture.montantTtc);
        factureValidationForm.find("#montant-rendu").val(montantRendu);
    },
    setValidatonFormRecapTable: function() {
        // Tableau des données de validation
        var $validationDataFormTable = $("table.invoice-validation-data-table");
        $validationDataFormTable.find(".td-invoice-type-facture").text(facture.type ? facture.type.description : "-");
        $validationDataFormTable.find(".td-invoice-aib").text(facture.aib ? facture.montantAib : "-");
        $validationDataFormTable.find(".td-invoice-type-paiement").text(facture.reglement ? facture.reglement.typePaiement.description : "-");
        $validationDataFormTable.find(".td-invoice-mrecu").text(facture.reglement ? facture.reglement.montantRecu : "-");
        $validationDataFormTable.find(".td-invoice-mpayer").text(facture.reglement ? facture.reglement.montantPayer : "-");
        $validationDataFormTable.find(".td-invoice-mrendu").text(facture.reglement ? facture.reglement.montantRendu : "-");
        $validationDataFormTable.find(".td-invoice-description").text(facture.reglement ? facture.reglement.description : "-");

        // Tableau recap des montants
        var $validationFormRecpaTable = $("table.invoice-validation-table");
        $validationFormRecpaTable
            .find(".td-invoice-mht")
            .text(facture.montantHt ? facture.montantHt : "-");
        $validationFormRecpaTable
            .find(".td-invoice-mtva")
            .text(facture.montantTva ? facture.montantTva : "-");
        $validationFormRecpaTable
            .find(".td-invoice-tsHt")
            .text(facture.tsHt ? facture.tsHt : "-");
        $validationFormRecpaTable
            .find(".td-invoice-tsTtc")
            .text(facture.tsTtc ? facture.tsTtc : "-");
        $validationFormRecpaTable
            .find(".td-invoice-aib")
            .text(facture.montantAib ? facture.montantAib : "-");
        $validationFormRecpaTable
            .find(".td-invoice-mttc")
            .text(facture.montantTtc ? facture.montantTtc : "-");
        let html = ``;
        if (facture.valid) html = `<span class="text-success">Validé</span>`;
        else html = `<span class="text-warning">En attente de validation</span>`;
        $validationFormRecpaTable.find(".td-invoice-status").html(html);
    },
    setRecapTableOnAibChange: function(event = null) {
        if (event) event.preventDefault();
        var aibId = factureValidationForm.find("#aib").val();
        if (aibId) {
            GlobalScript.request(URL_GET_TAXE.replace("__id__", aibId), "GET", null)
                .then(function(data) {
                    // Run this when your request was successful
                    var aib = data;
                    console.log(aib);
                    // Mise à jour du montant aib
                    // Sauvegarde temporaire du montant ttc de la facture, cela servira dans le cas du changement de l'aib étant donné que c'est le seul champ affecté par le montant aib
                    if (!factureMontantTtc) factureMontantTtc = facture.montantTtc;
                    var montantAib = Math.round((facture.montantHt * aib.valeur) / 100);
                    var montantTtc = factureMontantTtc + montantAib;
                    facture.montantAib = montantAib;
                    facture.montantTtc = montantTtc;
                    factureAvoir.setValidatonFormRecapTable();
                })
                .catch(function(err) {
                    // Run this when promise was rejected via reject()
                    GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération de l'aib");
                });
        }
    },
    remiseInputsToggle: function(event = null) {
        if (event) event.preventDefault();
        var remise = facturationForm.find("#remise-check").is(":checked");
        if (remise) {
            facturationForm.find("div#remiseInputsToggle").show();
            facturationForm.find("#remise_prix_u").attr("required", "required");
            facturationForm.find("#remise_description").attr("required", "required");
        } else {
            facturationForm.find("div#remiseInputsToggle").hide();
            facturationForm.find("#remise_prix_u").removeAttr("required");
            facturationForm.find("#remise_description").removeAttr("required");
        }
    }
};
$(document).ready(function() {
    factureAvoir.listInitalizer();

    //Show record
    datatable.on("click", ".show-item", function(e) {
        e.preventDefault();
        factureAvoir.showItem($(this));
    });

    // Delete a record
    datatable.on("click", ".remove-item", function (e) {
        e.preventDefault();
        //facturation.removeItem($(this));
        factureAvoir.saRemoveParams(
            $(this),
            "Êtes-vous sûr de vouloir supprimer cette ligne de facture ?",
            "Cette opération est irréversible !",
            "Oui, supprimer !",
            "Non, annuler !",
            "Supprimée !",
            "Suppression effectuée avec succès.",
            "annulée !",
            "Opération annulée, rien n'a changé."
        );
    });

    //Validate record
    // datatable.on("click", ".validate-item", function(e) {
    //     e.preventDefault();
    //     // factureAvoir.validateItem($(this));
    //     factureAvoir.saValidateItemParams(
    //         $(this),
    //         "Êtes-vous sûr de vouloir valider cette ligne de facture ?",
    //         "Cette opération est irréversible !",
    //         "Oui, valider !",
    //         "Non, annuler !",
    //         "Validée !",
    //         "Validation effectuée avec succès.",
    //         "annulée !",
    //         "Opération annulée, rien n'a changé."
    //     );
    // });

    //Validate facture
    $("a.validate-facture").click(function(e) {
        e.preventDefault();
        console.log("ici");
        if (facture && facture.valid) {
            alertify.warning("Cette facture est déjà validée");
        } else if (facture && facture.details) {
            factureAvoir.setValidatonFormRecapTable();
            $("#validate-invoice-modal").modal("toggle");
        } else {
            alertify.warning(
                "Cette facture est vide"
            );
            // Scroller la page vers le haut
            GlobalScript.scrollToTop();
        }
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
    //Validate facture
    $("a.print-facture").click(function(e) {
        e.preventDefault();
        GlobalScript.showPrintedInvoice(facture);
    });
});
document.addEventListener("DOMContentLoaded", function() {
    // factureAvoir.choicesJsInit();
    facturationForm = $("div#facturationForm").find("form");
    if (FACTURE_ID) {
        // Récupération de la facture et recharge du tablau des lignes de la facture
        factureAvoir.getFactureById(FACTURE_ID);
    }
    // factureValidationForm = $("div#validate-invoice-modal").find("form");
    //Gestion des champs de remise
    // factureAvoir.remiseInputsToggle();
    // Mise à jour du champ date du formulaire de la facture
    // facturationForm.find("#date").val(((new Date()).toISOString()).slice(0, 16))
});