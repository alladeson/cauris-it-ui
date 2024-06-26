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
let factureReglement = null;
let taxeSpecifique = null;
let originalPrice = null;
let typeFactureId = 0;
let itemNumber = 0;
let facturation = {
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
                                    // Récupération du type de la facture choisi par l'utilisateur
                                    typeFactureId = facturationForm.find("#type").val();
                                    // Attention, le type de la facture peut-être null au chargement de la page,
                                    // dans ce cas, attribuer zéro (0) comme valeur
                                    typeFactureId = typeFactureId ? typeFactureId : 0;
                                    // Mise à jour de l'url de récupération de la facture du client
                                    // Ceci est utile quand aucune facture n'est en cours pour le client
                                    url_facture_client = URL_GET_FACTURE_CLIENT.replace(
                                        "__clientId__",
                                        client ? client.id : 0
                                    ).replace("__typeId__", typeFactureId)                                    
                                    //Récupération de la facture
                                    // console.log(`Url de récupération de la facture : ${url_facture_client}`);
                                    return (data = {
                                        // Si le client à déjà une facture en cours, alors le système la récupère, 
                                        // Sinon, le système récupère la nouvelle facture du client qui peut-être null selon
                                        // que l'utilisateur ait déjà ajouté un article pour le client ou pas.
                                        url: FACTURE_ID ?
                                            URL_GET_ITEM.replace("__id__", FACTURE_ID) : url_facture_client,
                                        method: "GET",
                                    });
                                },
                                dataSrc: "details",
                                error: function(xhr, status, error) {
                                    (waitMe_zone.length ? waitMe_zone : $("body")).waitMe("hide");
                                    if (xhr.status)
                                        GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération de la facture");
                                    xhr.status ? $(".datatable")
                                        .find("tbody td")
                                        .html('<span class="text-danger">Echec de chargement</span>') : "";
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
                                    { data: "id",
                                        render: function(data, type, row, meta) {
                                            return ++itemNumber;
                                        },
                                    },
                                    // { data: "article",
                                    //     render: function(data, type, row, meta) {
                                    //         return data.reference ? data.reference : '-';
                                    //     },
                                    // },
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
                                                                    <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier</a>
                                                                </li> 
                                                                <li>
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
    choicesJsInit: function () {
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
    saSucces: function (title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        });
    },
    saError: function (title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        });
    },
    saParams: function (
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
        }).then(function (e) {
            e.value
                ? facturation.saSucces(oktitle, oktext)
                : e.dismiss === Swal.DismissReason.cancel &&
                facturation.saError(notitle, notext);
        });
    },
    saRemoveParams: function (
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
        }).then(function (e) {
            e.value
                ? facturation.removeItem(el, oktitle, oktext)
                : e.dismiss === Swal.DismissReason.cancel &&
                facturation.saError(notitle, notext);
        });
    },
    saValidateItemParams: function (
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
        }).then(function (e) {
            e.value
                ? facturation.validateItem(el, oktitle, oktext)
                : e.dismiss === Swal.DismissReason.cancel &&
                facturation.saError(notitle, notext);
        });
    },
    saValidateFactureParams: function (
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
        }).then(function (e) {
            e.value
                ? facturation.validateFacture(oktitle, oktext)
                : e.dismiss === Swal.DismissReason.cancel &&
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
            e.value ?  GlobalScript.showPrintedInvoice(facture) : "";
            $("#validate-invoice-modal").modal("toggle");
        });
    },
    submitFormData: function (event) {
        event.preventDefault();
        var data = facturation.dataFormat(facturationForm);
        // Vérification du changment dans le formulaire
        let dataId = facturationForm.find("#item-id").val();
        if (GlobalScript.traceUserProfileAndParamsFormChange(dataId)) return;
        //
        // console.log(data);
        var articleId = facturationForm.find("#article").val();
        var obj = {
            __clientId__: client ? client.id : 0,
            __articleId__: articleId,
        };
        var submitUrl = GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
        // GlobalScript.request((data.id ? (URL_PUT_ITEM.replace("__id__", facture ? facture.id ? facture.id : 0 : 0)).replace("__detailId__", data.id) : URL_POST_ITEM.replace("__clientId__", client ? client.id : 0)), (data.id ? 'PUT' : 'POST'), data).then(function (data) {
        GlobalScript.request(submitUrl, "POST", data)
            .then(function (data) {
                // Run this when your request was successful
                facture = data;
                // Récupération de règlement de la facture : utilise pour mettre à jour le formulaire de la validation
                factureReglement = facture.reglement;
                // Récupération du montant TTC de la facture
                factureMontantTtc = facture.montantTtc;
                // Le montant ttc réel est le montant ttc sans aib : utile lors de la mises à jour du formulaire de validation
                if (facture.aib) factureMontantTtc = facture.montantTtc - facture.montantAib;
                //
                // console.log(facture);
                itemNumber = 0;
                datatable.ajax.reload();
                alertify.success("Ajout effectué avec succès.");
                // Mise à jour des articles (les services internes)
                facturation.getForeignsData(
                    URL_LIST_ARTICLE,
                    ["articles", "id", "designation"],
                    2,
                    null
                );
                choices[2].removeActiveItems();
                choices[3].removeActiveItems();
                facturation.getArticle();
                facturationForm.find("#item-id").val(null);
                //Affichage ou non des champs de la taxe spécifique
                facturation.tsInputsToggle();
                //Affichage ou non des champs de remise
                facturation.remiseInputsToggle();
                // Mise à jour du champ date du formulaire de la facture
                // facturationForm.find("#date").val(new Date().toISOString().slice(0, 16));
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "l'enregistrement");
            });
    },
    editItem: function (el) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        // console.log(id);
        //var response = GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        GlobalScript.request(
            URL_GET_DETAIL_FACTURE.replace(
                "__id__",
                facture ? (facture.id ? facture.id : 0) : 0
            ).replace("__detailId__", detailId),
            "GET",
            null
        )
            .then(function (data) {
                // Run this when your request was successful
                GlobalScript.scrollToTop();
                var itemObj = data;
                // console.log(itemObj);
                // Mise à jour de l'article 
                article = data.article;
                // Sauvegarde la taxe spécifique si existante sinon null
                taxeSpecifique = itemObj.ts ? itemObj.ts.tsUnitaire : null;
                //Mise à jour du prix originale de l'article
                originalPrice = itemObj.remise ? itemObj.discount.originalPrice : itemObj.prixUnitaire;
                // Mise à jour du formulaire de facturation
                facturation.setformData(facturationForm, itemObj);
                // Écoute de changement dans le formulaire
                GlobalScript.formChange(facturationForm);
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la modification");
            });
    },
    showItem: function (el) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        // console.log(id);
        GlobalScript.request(
            URL_GET_DETAIL_FACTURE.replace(
                "__id__",
                facture ? (facture.id ? facture.id : 0) : 0
            ).replace("__detailId__", detailId),
            "GET",
            null
        )
            .then(function (data) {
                // Run this when your request was successful
                var itemObj = data;
                // console.log(itemObj);
                // Sauvegarde la taxe spécifique si existante sinon null
                taxeSpecifique = itemObj.ts ? itemObj.ts.tsUnitaire : null;
                facturation.setShowingTable(itemObj);
                $(".show-item-modal").modal("show");
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "l'affichage");
            });
    },
    removeItem: function (el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        // // console.log(id);
        GlobalScript.request(
            URL_DELETE_ITEM.replace(
                "__id__",
                facture ? (facture.id ? facture.id : 0) : 0
            ).replace("__detailId__", detailId),
            "DELETE",
            null
        )
            .then(function (data) {
                // Run this when your request was successful
                // console.log(data);
                alertify.success(oktext);
                itemNumber = 0;
                datatable.ajax.reload();
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la suppression");
            });
    },
    setformData: function (form, item) {
        if (form.length) {
            form.find("#item-id").val(item.id);
            // form.find("#date").val(((new Date()).toISOString()).slice(0, 16))
            form.find("#prix_u").val(item.prixUnitaire);
            form.find("#quantite").val(item.quantite);
            // form.find("#taxe-specifique").val(item.taxeSpecifique);
            // Gestion de la taxe spécifique (le montant est mise à jour dans fonction setMontant())
            form.find("#ts-check").prop("checked", item.taxeSpecifique ? true : false);
            form.find("div.taxe-specifique #ts-name")
                .val(item.taxeSpecifique ? item.ts.name : null)
            // Gestsion de la remise
            form.find("#remise-check").prop("checked", item.remise ? true : false);
            form.find("#remise_taux").val(item.discount ? item.discount.taux : "");
            form.find("#remise_prix_u").val(item.discount ? item.discount.originalPrice : "");
            form.find("#remise_description").val(item.discount ? item.discount.priceModification : "");
            //
            choices[1].setChoiceByValue(client.id);
            choices[3].setChoiceByValue(item.taxe.id);
            choices[2].setChoiceByValue(item.article ? item.article.id : 0);
            facturation.setMontant();
            // Affichage ou non des champs de la taxe spécifique
            facturation.tsInputsToggle();
            // Affichage ou non des champs de la remise
            facturation.remiseInputsToggle();
        }
    },
    dataFormat: function (form) {
        if (form.length) {
            var ts = form.find("#ts-check").is(":checked");
            var remise = form.find("#remise-check").is(":checked");
            data = {
                id: form.find("#item-id").val(),
                quantite: form.find("#quantite").val(),
                unite: "U",
                prixUnitaire: form.find("#prix_u").val(),
                taxeSpecifique: ts ? form.find("#taxe-specifique").val() : null,
                tsName: ts ? form.find("#ts-name").val() : null,
                remise: remise,
                taux: remise ? form.find("#remise_taux").val() : null,
                originalPrice: remise ? form.find("#remise_prix_u").val() : null,
                priceModification: remise ? form.find("#remise_description").val() : null,
                taxeId: form.find("#taxe").val(),
                tfId: form.find("#type").val(),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    validationDataFormat: function (form) {
        if (form.length) {
            data = {
                aibId: form.find("#aib").val(),
                typePaiementId: form.find("#type-paiement").val(),
                montantRecu: Math.round(parseFloat(form.find("#montant-recu").val())),
                montantPayer: Math.round(parseFloat(form.find("#montant-payer").val())),
                montantRendu: Math.round(parseFloat(form.find("#montant-recu").val())) - Math.round(parseFloat(form.find("#montant-payer").val())),
                description:  GlobalScript.checkBlank($.trim(form.find("#description").val())),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    validateItem: function (el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        // // console.log(id);
        GlobalScript.request(
            URL_VALIDER_DETAIL_FACTURE.replace(
                "__id__",
                facture ? (facture.id ? facture.id : 0) : 0
            ).replace("__detailId__", detailId),
            "PUT",
            null
        )
            .then(function (data) {
                // Run this when your request was successful
                // console.log(data);
                alertify.success(oktext);
                itemNumber = 0;
                datatable.ajax.reload();
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "sweet", "la validation");
            });
    },
    validateFacture: function (oktitle, oktext) {
        var data = facturation.validationDataFormat(factureValidationForm);
        // console.log(data);
        GlobalScript.request(
            URL_VALIDER_FACTURE.replace(
                "__id__",
                facture ? (facture.id ? facture.id : 0) : 0
            ),
            "PUT",
            data
        )
            .then(function (data) {
                // Run this when your request was successful
                facture = data;
                // Récupération de règlement de la facture : utilise pour mettre à jour le formulaire de la validation
                factureReglement = facture.reglement;
                // Récupération du montant TTC de la facture
                factureMontantTtc = facture.montantTtc;
                // Le montant ttc réel est le montant ttc sans aib : utile lors de la mises à jour du formulaire de validation
                if (facture.aib) factureMontantTtc = facture.montantTtc - facture.montantAib;
                //
                // console.log(facture);
                alertify.success(oktext);
                itemNumber = 0;
                datatable.ajax.reload();
                facturation.saSuccesFactureValider(
                    "Validée !",
                    "Facture validée avec succès ! Cliquer sur 'OK' pour générer la facture."
                );
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "sweet", "la validation");
            });
    },
    // Récupération de la liste des articles ou des clients
    getForeignsData: function (url, selectData = [], choicePosition, itemId) {
        GlobalScript.request(url, "GET", null)
            .then(function (data) {
                // Run this when your request was successful
                dataJon = data;
                choices[choicePosition].clearChoices();
                if ($.inArray(selectData[0], ["catégories", "types de facture", "types de paiement", 5]) > -1) {
                    dataJon = $.map(data, function(obj, index) {
                        obj.value = obj.id
                        obj.label = obj.libelle
                        obj.selected = index ? false : true
                            // obj.disabled = index ? false : true
                        return obj
                    });
                }
                choices[choicePosition].setChoices(
                    dataJon,
                    selectData[1],
                    selectData[2]
                );
                if (itemId) choices[choicePosition].setChoiceByValue(itemId);
                // Vérification si l'ID de la facture provient de l'URL
                if (FACTURE_ID && selectData[0] == "clients") {
                    // Récupération de la facture et recharge du tablau des lignes de la facture
                    facturation.getFactureById(FACTURE_ID);
                }
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération des " + selectData[0]);
            });
    },
    reloadDatatable: function (event) {
        event.preventDefault();
        // Vérification de la sélection du type de la facture suite à la sélection du client
        if (!facturationForm.find("#type").val()) {
            alertify.warning("Veuillez sélectionner un type de facture svp !");
            return;
        }
        // Remise à null de l'ID de facture venant de l'url de la page
        FACTURE_ID = null;
        // Récupération de l'id du type de la facture
        typeFactureId = facturationForm.find("#type").val();
        // Récupération de l'id du client
        var clientId = facturationForm.find("#client").val();
        // console.log("client id : " + clientId);
        if (clientId) facturation.getEntity(URL_GET_CLIENT, clientId, "client");
        else {
            client = null;
            itemNumber = 0;
            datatable.ajax.reload();
        }
        facturation.getEntity(
            URL_GET_FACTURE_CLIENT.replace("__clientId__", clientId ? clientId : 0).replace("__typeId__", typeFactureId),
            clientId,
            "facture"
        );
    },
    getArticle: function (event = null) {
        if (event) event.preventDefault();
        var articleId = facturationForm.find("#article").val();
        if (articleId)
            facturation.getEntity(URL_GET_ARTICLE, articleId, "l'article");
        else {
            article = null;
            facturation.setFormOnArticleChange();
        }
    },
    setFormOnArticleChange: function () {
        facturationForm.find("#prix_u").val(article ? article.prix : null);
        facturationForm.find("#quantite").val(article ? 1 : null);
        facturationForm.find("#montant").val(article ? article.prix : null);
        // Gestion de la taxe spécifique
        facturationForm.find("#ts-check").prop("checked", article && article.taxeSpecifique ? true : false);
        facturationForm
            .find("#taxe-specifique")
            .val(article ? article.taxeSpecifique : null);
        // Affichage ou non des champs de la taxe spécifique
        facturation.tsInputsToggle();
        // Gestion du nom de la taxe spécifique
        facturationForm.find("div.taxe-specifique #ts-name")
            .val(article && article.taxeSpecifique ? article.tsName : "")
        choices[3].setChoiceByValue(article?.taxe.id);
        // Gestion des remise
        facturationForm.find("#remise-check").prop("checked", false);
        // Affichage ou non des champs de la remise
        facturation.remiseInputsToggle();
    },
    setMontant: function (event = null) {
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
    getEntity: function (url, id, dataname = "donnée", reloadDatatable = false) {
        GlobalScript.request(url.replace("__id__", id), "GET", null)
            .then(function (data) {
                // Run this when your request was successful
                dataJson = data;
                // console.log(dataJson);
                if (dataname == "client") {
                    client = dataJson;
                    itemNumber = 0;
                    datatable.ajax.reload();
                }
                if (dataname == "l'article") {
                    article = dataJson;
                    // Sauvegarde de la taxe spécique si existante sinon null
                    taxeSpecifique = article.taxeSpecifique;
                    originalPrice = article.prix;
                    facturation.setFormOnArticleChange();
                }

                if (dataname == "facture") {
                    facture = dataJson;
                    // Mise à jour du type de la facture
                    if (facture.type) choices[0].setChoiceByValue(facture.type.id);
                    // Récupération de règlement de la facture : utilise pour mettre à jour le formulaire de la validation
                    factureReglement = facture.reglement;
                    // Récupération du montant TTC de la facture
                    factureMontantTtc = facture.montantTtc;
                // Le montant ttc réel est le montant ttc sans aib : utile lors de la mises à jour du formulaire de validation
                    if (facture.aib) factureMontantTtc = facture.montantTtc - facture.montantAib;
                }
                return dataJson;
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération de " + dataname);
            });
    },
    setShowingTable: function (itemObj) {

        //Affichage générale
        var $showClasseTable = $("table.item-show-table");
        $showClasseTable.find(".td-detail-reference").text(itemObj.article.reference ?? '-');
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
    getFactureById: function (factureId) {
        GlobalScript.request(URL_GET_ITEM.replace("__id__", factureId), "GET", null)
            .then(function (data) {
                // Run this when your request was successful
                // console.log(data);
                facture = data;
                client = facture.client;
                choices[0].setChoiceByValue(facture.type.id);
                choices[1].setChoiceByValue(client.id);
                itemNumber = 0;
                datatable.ajax.reload();
                // Récupération de règlement de la facture : utilise pour mettre à jour le formulaire de la validation
                factureReglement = facture.reglement;
                // Récupération du montant TTC de la facture
                factureMontantTtc = facture.montantTtc;
                // Le montant ttc réel est le montant ttc sans aib : utile lors de la mises à jour du formulaire de validation
                if (facture.aib) factureMontantTtc = facture.montantTtc - facture.montantAib;
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération de la facture");
            });
    },
    confirmInvoiceValidation: function (event) {
        event.preventDefault();
        facturation.saValidateFactureParams(
            "Êtes-vous sûr de vouloir valider cette facture ?",
            "Cette opération est irréversible !",
            "Oui, valider !",
            "Non, annuller !",
            "Validée !",
            "Validation effectuée avec succès.",
            "Annullée !",
            "Opération annullée, rien n'a changé."
        );
    },
    setValidationForm: function (event = null) {
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
    setValidatonFormRecapTable: function () {
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

        // Mise à jour du formulaire de validation  en fonction de la valeur du règlement de la facture
        if (factureReglement) {
            factureValidationForm.find("#montant-recu").val(factureReglement.montantRecu);
            factureValidationForm.find("#montant-payer").val(factureReglement.montantPayer);
            factureValidationForm.find("#montant-rendu").val(factureReglement.montantRendu);
            factureValidationForm.find("#description").val(factureReglement.description);
        }
    },
    setRecapTableOnAibChange: function (event = null) {
        if (event) event.preventDefault();
        var aibId = factureValidationForm.find("#aib").val();
        if (aibId) {
            GlobalScript.request(URL_GET_TAXE.replace("__id__", aibId), "GET", null)
                .then(function (data) {
                    // Run this when your request was successful
                    var aib = data;
                    // console.log(aib);
                    // Mise à jour de l'aib de la facture
                    facture.aib = data;
                    // Mise à jour du montant aib
                    // Sauvegarde temporaire du montant ttc de la facture, cela servira dans le cas du changement de l'aib étant donné que c'est le seul champ affecté par le montant aib
                    if (!factureMontantTtc) factureMontantTtc = facture.montantTtc;
                    /**
                     * Le montant de l'Aib est arrondi par defaut si sa partie decimale est < 5 (je veux dire le chiffre après la virgule),
                     * et par excès si la partie décimale est > 5
                     * Si la partie décimale est égle à 0.5, ambiguïté dans le calcul, il faudrait  attendre la reponse du serveur de la DGI pour prendre une décisison
                     * Le code qui suit resoud cette approche que nous avons constacté lors des tests sur les factures générées par le serveur de la DGI
                     */
                    // Calcule du montant aib
                    var montantAib = (facture.montantHtAib * aib.valeur) / 100;
                    // Récupération de la partie décimale
                    var decimal = montantAib - Math.trunc(montantAib);
                    // Si La partie decimale est null ou inférieure ou égale à 0.5, prendre la partie
                    // entière du montant l'aib
                    if (decimal < 0.5 )
                        facture.montantAib = Math.trunc(montantAib);
                    // Sinon si le decimal est égale à 0.5, ambiguïté dans le calcul, il faudrait
		            // attendre la reponse du serveur de la DGI pour prendre une décisison
                    else if(decimal == 0.5)
                        facture.montantAib = montantAib;
                    // Sinon, prendre la partie entière du montant de l'aib + 1
                    else
                        facture.montantAib = Math.trunc(montantAib) + 1;

                    // Mise à jour du montant ttc de la facture en y ajoutant le montantAib;
                    facture.montantTtc = factureMontantTtc + facture.montantAib;
                    // Mise à jour du tableau récapitulatif pour la validation de la facture
                    facturation.setValidatonFormRecapTable();
                })
                .catch(function (err) {
                    // Run this when promise was rejected via reject()
                    GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération de l'aib");
                });
        } else {
            // Mise à null de l'aib et de son mantant
            facture.aib = null;
            facture.montantAib = null;
            // Réinialisation du montant ttc de la facture
            facture.montantTtc = factureMontantTtc;
            // Mise à jour du tableau récapitulatif pour la validation de la facture
            facturation.setValidatonFormRecapTable();
        }
    },
    customMessageOnFactureationFormSubmit: function (event = null) {
        if (event) event.preventDefault();
        if (!facturationForm.find("#type").val()) {
            alertify.warning("Veuillez sélectionner un type de facture svp !");
            return;
        }
        if (!facturationForm.find("#client").val()) {
            alertify.warning("Veuillez sélectionner un client svp !");
            return;
        }
        if (!facturationForm.find("#article").val()) {
            alertify.warning("Veuillez sélectionner un article svp !");
            return;
        }
        if (!facturationForm.find("#taxe").val()) {
            alertify.warning("Veuillez sélectionner une taxe svp !");
            return;
        }
        else {
            facturation.submitFormData(event);
        }
    },
    customMessageOnValidationFormSubmit: function (event = null) {
        if (event) event.preventDefault();
         // Vérification du choix du type de paiement
        if (!factureValidationForm.find("#type-paiement").val()) {
            alertify.warning("Veuillez sélectionner un type de paiement svp !");
            return;
        } else if (parseFloat(factureValidationForm.find("#montant-payer").val()) != parseFloat(facture.montantTtc)) {
            alertify.warning("Veuillez mettre à jour les montant du règlement de la facture svp !");
            return;
        }
        else {
            facturation.confirmInvoiceValidation(event);
        }
    },
    remiseInputsToggle: function (event = null) {
        if (event) event.preventDefault();
        var remise = facturationForm.find("#remise-check").is(":checked");
        if (remise) {
            if (!article) {
                alertify.warning(
                    "Veuillez sélectionner un article svp !"
                );
                facturationForm.find("#remise-check").prop("checked", false)
            } else {
                facturationForm.find("div#remiseInputsToggle").show();
                facturationForm.find("#remise_taux").attr("required", "required");
                facturationForm.find("#remise_prix_u").attr("required", "required");
                facturationForm.find("#remise_description").attr("required", "required");
                // Mise à jour automatique du prix original de l'article
                facturationForm.find("#remise_prix_u").val(originalPrice);
                // Mise à jour des du formulaire pour la remise
                facturation.setRemiseFormOnPricesChange();
            }
        } else {
            facturationForm.find("div#remiseInputsToggle").hide();
            facturationForm.find("#remise_taux").removeAttr("required");
            facturationForm.find("#remise_prix_u").removeAttr("required");
            facturationForm.find("#remise_description").removeAttr("required");
            facturationForm.find("#remise_taux").val(null);
            facturationForm.find("#remise_prix_u").val(null);
            facturationForm.find("#remise_description").val(null);
        }
    },
    tsInputsToggle: function (event = null) {
        if (event) event.preventDefault();
        var ts = facturationForm.find("#ts-check").is(":checked");
        if (ts) {
            if (!article) {
                alertify.warning(
                    "Veuillez sélectionner un article svp !"
                );
                facturationForm.find("#ts-check").prop("checked", false)
            } else {
                facturationForm.find("div#tsInputsToggle").show();
                facturationForm.find("#taxe-specifique").attr("required", "required");
                facturationForm.find("#ts-name").attr("required", "required");
            }
        } else {
            facturationForm.find("div#tsInputsToggle").hide();
            facturationForm.find("#taxe-specifique").removeAttr("required");
            facturationForm.find("#ts-name").removeAttr("required");
        }
    },
    setRemiseFormOnPricesChange: function (event = null, setMontant = false) {
        if (event) event.preventDefault()
        var remise = facturationForm.find("#remise-check").is(":checked");
        if (remise) {
            var prixUnitaire = parseInt(facturationForm.find("#prix_u").val());
            var prixOriginale = parseInt(facturationForm.find("#remise_prix_u").val());
            var taux = ((prixOriginale && prixUnitaire) && prixUnitaire < prixOriginale) ? Math.round(((prixOriginale - prixUnitaire) * 100) / prixOriginale) : 0;
            facturationForm.find("#remise_taux").val(taux);
            facturationForm.find("#remise_description").val("Une remise de " + taux + "%");
        } else {
            facturation.remiseInputsToggle();
        }
        if (setMontant)
            facturation.setMontant();
    },
    setRemiseFormOnTauxChange: function (event = null) {
        if (event) event.preventDefault()
        var remise = facturationForm.find("#remise-check").is(":checked");
        if (remise) {
            var prixOriginale = parseInt(facturationForm.find("#remise_prix_u").val());
            var taux = parseInt(facturationForm.find("#remise_taux").val());
            var prixUnitaire = prixOriginale ? (prixOriginale - Math.round((prixOriginale * taux) / 100)) : 0;
            facturationForm.find("#prix_u").val(prixUnitaire);
            facturationForm.find("#remise_description").val("Une remise de " + taux + "%");
            facturation.setMontant();
        } else {
            facturation.remiseInputsToggle();
        }
    },
    /**
     * Soumission du formulaire du client
     */
    clientSubmitFormData: function (event) {
        event.preventDefault();
        var form = $("div.client-new-modal").find('form');
        var data = facturation.clientDataFormat(form)
        let dataId = form.find("#item-id").val();
        // console.log(data)
        GlobalScript.request((dataId ? URL_PUT_CLIENT.replace("__id__", dataId) : URL_POST_CLIENT), (dataId ? 'PUT' : 'POST'), data).then(function (data) {
            // Run this when your request was successful
            // console.log(data)
            client = data;
            // Mise à jour du champ de selection du client
            choices[1].setChoices([{ value: data.id, label: data.name, selected: true }])
            //
            itemNumber = 0;
            datatable.ajax.reload();
            // facturation.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
            $("div.client-new-modal").modal('hide')
            form[0].reset()
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    clientDataFormat: function (form) {
        if (form.length) {
            data = {
                'id': GlobalScript.checkBlank(form.find("#item-id").val()),
                'name': GlobalScript.checkBlank(form.find("#name").val()),
                'ifu': GlobalScript.checkBlank(form.find("#ifu").val()),
                'rcm': GlobalScript.checkBlank(form.find("#rcm").val()),
                'telephone': GlobalScript.checkBlank(form.find("#telephone").val()),
                'email': GlobalScript.checkBlank(form.find("#email").val()),
                'address': GlobalScript.checkBlank(form.find("#address").val()),
                'ville': GlobalScript.checkBlank(form.find("#ville").val()),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    clientNewItemEvent: function (event) {
        event.preventDefault();
        $("div.client-new-modal").find('h5.modal-title').text('Nouvel ajout');
        var form = $("div.client-new-modal").find('form');
        form.attr("onsubmit", "facturation.clientSubmitFormData(event)")
        form[0].reset();
        form.find("#item-id").val("");
    },
    /**
     * Soumission du formulaire de l'article
     */
    articleSubmitFormData: function (event) {
        event.preventDefault();
        var form = $("div.article-new-modal").find('form');
        var data = facturation.articleDataFormat(form)
        let dataId = form.find("#item-id").val();
        // console.log(data)
        var categorieId = form.find("#categorie").val();
        var taxeId = form.find("#taxe").val();
        var obj = { '__id__': dataId, '__cId__': categorieId, '__tId__': taxeId }
        var submitUrl = dataId ? GlobalScript.textMultipleReplace(URL_PUT_ARTICLE, obj) : GlobalScript.textMultipleReplace(URL_POST_ARTICLE, obj);
        GlobalScript.request(submitUrl, (dataId ? 'PUT' : 'POST'), data).then(function (data) {
            // Run this when your request was successful
            // console.log(data)
            article = data;
            // Mise à jour du champ de selection de l'article
            choices[2].setChoices([{ value: data.id, label: data.designation, selected: true }])
            // Sauvegarde de la taxe spécique si existante sinon null
            taxeSpecifique = article.taxeSpecifique;
            originalPrice = article.prix;
            facturation.setFormOnArticleChange();
            $("div.article-new-modal").modal('hide')
            alertify.success("Enregistrement effectué avec succès")
            form[0].reset();
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    articleDataFormat: function (form) {
        if (form.length) {
            data = {
                'id': GlobalScript.checkBlank(form.find("#item-id").val()),
                'designation': GlobalScript.checkBlank(form.find("#designation").val()),
                'prix': GlobalScript.checkBlank(form.find("#prix").val()),
                'taxeSpecifique': GlobalScript.checkBlank(form.find("#taxe-specifique").val()),
                'tsName': GlobalScript.checkBlank(form.find("#ts-name").val()),
                'stock': GlobalScript.checkBlank(form.find("#stock").val()),
                'stockSecurite': GlobalScript.checkBlank(form.find("#stock-securite").val()),
            };
            return JSON.stringify(data);
        }
        return null;
    },
    articleNewItemEvent: function (event) {
        event.preventDefault();
        $("div.article-new-modal").find('h5.modal-title').text('Nouvel ajout');
        var form = $("div.article-new-modal").find('form');
        form.attr("onsubmit", "facturation.articleSubmitFormData(event)")
        form[0].reset();
        form.find("#item-id").val("");
        GlobalScript.getForeignsData(URL_LIST_CATEGORIE_ARTICLE, ['catégories', 'id', 'libelle'], 6, null);
        GlobalScript.getForeignsData(URL_LIST_TAXE, ['taxes', 'id', 'string'], 7, null);
    },
    articleSetTsName: function (tsElement) {
        if (tsElement.val()) {
            $("div.article-new-modal").find('form').find("div.ts-name").show();
            if (!$("div.article-new-modal").find('form').find("input#ts-name").val())
                $("div.article-new-modal").find('form').find("input#ts-name").val("Taxe spécifique");
            $("div.article-new-modal").find('form').find("input#ts-name").attr("required", "required");
        } else {
            $("div.article-new-modal").find('form').find("div.ts-name").hide();
            $("div.article-new-modal").find('form').find("input#ts-name").val(null);
            $("div.article-new-modal").find('form').find("input#ts-name").removeAttr("required");
        }
    },
};
$(document).ready(function () {
    facturation.listInitalizer();
    // Edit record
    datatable.on("click", ".edit-item", function (e) {
        e.preventDefault();
        formChange = false;
        facturation.editItem($(this));
    });

    // Delete a record
    datatable.on("click", ".remove-item", function (e) {
        e.preventDefault();
        //facturation.removeItem($(this));
        facturation.saRemoveParams(
            $(this),
            "Êtes-vous sûr de vouloir supprimer cette ligne de facture ?",
            "Cette opération est irréversible !",
            "Oui, supprimer !",
            "Non, annuller !",
            "Supprimée !",
            "Suppression effectuée avec succès.",
            "Annullée !",
            "Opération annullée, rien n'a changé."
        );
    });

    //Show record
    datatable.on("click", ".show-item", function (e) {
        e.preventDefault();
        facturation.showItem($(this));
    });

    //Validate record
    datatable.on("click", ".validate-item", function (e) {
        e.preventDefault();
        // facturation.validateItem($(this));
        facturation.saValidateItemParams(
            $(this),
            "Êtes-vous sûr de vouloir valider cette ligne de facture ?",
            "Cette opération est irréversible !",
            "Oui, valider !",
            "Non, annuller !",
            "Validée !",
            "Validation effectuée avec succès.",
            "Annullée !",
            "Opération annullée, rien n'a changé."
        );
    });

    //Validate facture
    $("a.validate-facture").click(function (e) {
        e.preventDefault();
        // console.log("ici");
        if (facture && facture.valid) {
            alertify.warning("Cette facture est déjà validée");
        } else if (facture && facture.details.length) {
            // Mise à jour du montant ttc de la facture et remise à null du montant aib
            if (factureMontantTtc && !facture.aib) facture.montantTtc = factureMontantTtc;
            // Mise à jour du modal de validation
            facturation.setValidatonFormRecapTable();
            // Récupération des aib
            choices[4].removeActiveItems();
            facturation.getForeignsData(
                URL_LIST_TAXE_AIB,
                ["taux aib", "id", "string"],
                4,
                facture.aib ? facture.aib.id : null
            );
            // Récupération des types de paiement
            facturation.getForeignsData(
                URL_LIST_TYPE_PAIEMENT,
                ["types de paiement", "id", "description"],
                5,
                factureReglement && factureReglement.typePaiement ? factureReglement.typePaiement.id : null
            );
            $("#validate-invoice-modal").modal("toggle");
        } else {
            alertify.warning(
                "Veuillez ajouter un article à la facture en remplissant le formulaire de facturation"
            );
            // Scroller la page vers le haut
            GlobalScript.scrollToTop();
        }
    });
    //Show Action
    datatable.on('responsive-resize', function (e, datatable, columns) {
        e.preventDefault();
        var count = columns.reduce(function (a, b) {
            return b === false ? a + 1 : a;
        }, 0);
        var position = count ? "relative" : "absolute";
        datatable.on('click', 'button.dropdown-toggle', function (e) {
            e.preventDefault();
            $(".dropdown-menu-end").css("position", position);
        });
        // console.log(count + ' column(s) are hidden');
    });
});
document.addEventListener("DOMContentLoaded", function () {
    facturation.choicesJsInit();
    facturationForm = $("div#facturationForm").find("form");
    factureValidationForm = $("div#validate-invoice-modal").find("form");
    // Initilisation du formulaire
    // facturation.resetFacturationForm();
    //Gestion des champs de remise
    facturation.remiseInputsToggle();
    //Gestion de la taxe spécifique
    facturation.tsInputsToggle();
    // Récupératon des types de facture
    facturation.getForeignsData(
        URL_LIST_TYPE_FACTURE_VENTE,
        ["types de facture", "id", "description"],
        0,
        null
    );
    // Récupération des clients
    facturation.getForeignsData(
        URL_LIST_CLIENT,
        ["clients", "id", "name"],
        1,
        null
    );
    // Récupération des articles
    facturation.getForeignsData(
        URL_LIST_ARTICLE,
        ["articles", "id", "designation"],
        2,
        null
    );
    //Récupération des taxes
    facturation.getForeignsData(
        URL_LIST_TAXE,
        ["taxes", "id", "string"],
        3,
        null
    );
    // Récupération de la facture et recharge du tablau des lignes de la facture
    if (FACTURE_ID) {
        facturation.getFactureById(FACTURE_ID);
    }
    // Mise à jour du champ date du formulaire de la facture
    // facturationForm.find("#date").val(((new Date()).toISOString()).slice(0, 16))
    // GEstion de la taxe spécifique de l'article 
    $("div.article-new-modal").find('form').find("input#taxe-specifique").keyup(function (event) {
        event.preventDefault();
        facturation.articleSetTsName($(this));
    })
    // Input mask pour l'ifu du client
    $("div.client-new-modal").find('form').find("#ifu").inputmask({
        mask: "*************",
        casing: "upper",
    });
});