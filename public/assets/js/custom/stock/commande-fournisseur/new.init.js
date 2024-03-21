let datatable;
let choices = [];
let cmdFournisseurForm;
let cmdFournisseurValidationForm;
let commande = null;
let fournisseur;
let article;
let taxeSpecifique = null;
let originalPrice = null;
let sectionFormCmdFournisseur = "article";
let cmdFournisseur = {
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
                                    // Mise à jour de l'url de récupération de la commande du fournisseur
                                    // Ceci est utile quand aucune commande n'est en cours pour le fournisseur
                                    url_cmd_fournisseur = URL_GET_ITEM_BY_FOURNISSEUR.replace(
                                        "__fId__",
                                        fournisseur ? fournisseur.id : 0
                                    );                                    
                                    //Récupération de la commande
                                    // console.log(`Url de récupération de la commande : ${url_cmd_fournisseur}`);
                                    return (data = {
                                        // Si le fournisseur à déjà une commande en cours, alors le système la récupère, 
                                        // Sinon, le système récupère la nouvelle commande du fournisseur qui peut-être null selon
                                        // que l'utilisateur ait déjà ajouté un article pour le fournisseur ou pas.
                                        url: CMDF_ID ?
                                            URL_GET_CMD_FOURNISSEUR.replace("__id__", CMDF_ID) : url_cmd_fournisseur,
                                        method: "GET",
                                    });
                                },
                                dataSrc: "details",
                                error: function(xhr, status, error) {
                                    (waitMe_zone.length ? waitMe_zone : $("body")).waitMe("hide");
                                    if (xhr.status)
                                        GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération de l'ordre d'achat");
                                    xhr.status ? $(".datatable")
                                        .find("tbody td")
                                        .html('<span class="text-danger">Echec de chargement</span>') : "";
                                },
                            },
                            order: [[1, 'desc']],
                            columns: [{
                                        data: "id",
                                        class: "",
                                        orderable: false,
                                        searchable: false,
                                        render: function(data, type, row, meta) {
                                            return (
                                                `` +
                                                `<div class="form-check font-size-16">` +
                                                `<input type="checkbox" class="form-check-input" id="detailCmdFournisseurcheck${data}">` +
                                                `<label class="form-check-label" for="detailCmdFournisseurcheck${data}"></label>` +
                                                `</div>`
                                            );
                                        },
                                    },
                                    { 
                                        data: "reference",
                                        render : function(data, type, row, meta) {
                                            return data ? data : "-";
                                        }
                                     },
                                    { data: "name" },
                                    { data: "quantite" },
                                    { data: "prixUnitaire" },
                                    {
                                        data: "discount",
                                        render: function(data, type, row, meta) {
                                            return (row.remise ? data.taux : "0.00") + "%";
                                        },
                                    },
                                    {
                                        data: "taxe",
                                        render: function(data, type, row, meta) {
                                            return data.valeur + "%";
                                        },
                                    },
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
                },
            },
            ],
        })),
            $(".dataTables_length select").addClass("form-select form-select-sm");
    },
    choicesJsInit: function () {
        let e = document.querySelectorAll("[data-trigger]");
        for (i = 0; i < e.length; ++i) {
            let a = e[i];
            choices[i] = new Choices(a, {
                loadingText: "Chargement...",
                noResultsText: "Aucun résultat trouvé",
                noChoicesText: "Pas de choix à effectuer",
                itemSelectText: "Appuyez pour sélectionner",
                position: "bottom",
                removeItemButton: true,
                duplicateItemsAllowed: !1,
                shouldSort: false,
                // Gestion des recherche selon le numéro d'ordre des champs des champs
                // Les champs numéro 2 et 4 (les taxes) n'ont pas d'option de recherche
                searchEnabled: $.inArray(i, [2, 4]) > -1 ? false : true,
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
                ? cmdFournisseur.saSucces(oktitle, oktext)
                : e.dismiss === Swal.DismissReason.cancel &&
                cmdFournisseur.saError(notitle, notext);
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
                ? cmdFournisseur.removeItem(el, oktitle, oktext)
                : e.dismiss === Swal.DismissReason.cancel &&
                cmdFournisseur.saError(notitle, notext);
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
                ? cmdFournisseur.validateItem(el, oktitle, oktext)
                : e.dismiss === Swal.DismissReason.cancel &&
                cmdFournisseur.saError(notitle, notext);
        });
    },
    saValidateCmdFournisseurParams: function (
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
                ? cmdFournisseur.validateCmdFournisseur(oktitle, oktext)
                : e.dismiss === Swal.DismissReason.cancel &&
                cmdFournisseur.saError(notitle, notext);
        });
    },
    saSuccesCmdFournisseurValider: function (title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        }).then(function (e) {
            e.value ?  GlobalScript.showPrintedCmdFournisseur(commande) : "";
            $("#validate-commande-modal").modal("toggle");
        });
    },
    submitFormData: function (event) {
        event.preventDefault();
        let data = cmdFournisseur.dataFormat(cmdFournisseurForm);
        // Vérification du changment dans le formulaire
        let dataId = cmdFournisseurForm.find("#item-id").val();
        if (GlobalScript.traceUserProfileAndParamsFormChange(dataId)) return;
        // Initialisation de l'url et methode de soumission de formulaire
        let submitUrl = "";
        let method = "";
        // Pour les données d'ajout d'un article
        if(sectionFormCmdFournisseur == "article") {            
            let articleId = cmdFournisseurForm.find("#article").val();
            let obj = {
                __fId__: fournisseur ? fournisseur.id : 0,
                __articleId__: articleId,
            };
            submitUrl = GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
            method = "POST";
        }
        // Pour les données d'expédition
        if(sectionFormCmdFournisseur == "expedition") {
            submitUrl = URL_CMD_EXPEDITION_DATA.replace("__id__", commande.id);
            method = "PUT";
        }
        // Pour les données d'expédition
        if(sectionFormCmdFournisseur == "infos-generales") {
            data = cmdFournisseur.dataFormatInfosGenerales(infosGeneralesFormForm);
            submitUrl = URL_CMD_INFOS_ADD.replace("__id__", commande.id);
            method = "PUT";
        }
        // GlobalScript.request((data.id ? (URL_PUT_ITEM.replace("__id__", commande ? commande.id ? commande.id : 0 : 0)).replace("__detailId__", data.id) : URL_POST_ITEM.replace("__fId__", fournisseur ? fournisseur.id : 0)), (data.id ? 'PUT' : 'POST'), data).then(function (data) {
        GlobalScript.request(submitUrl, method, data)
            .then(function (data) {
                // Run this when your request was successful
                commande = data;
                // Mise à jour des infos générale de la commande dans le formulaire
                cmdFournisseur.setInfosGeneralesForm(null);
                // Recharge du tableau de liste des détails de la commande
                datatable.ajax.reload();
                alertify.success("Ajout effectué avec succès.");
                // Mise à jour automatique du prix original de l'article
                originalPrice = null;
                // Mise à jour des articles dans le cas ou il aurait un changement depuis le backend
                cmdFournisseur.getForeignsData(
                    URL_LIST_ARTICLE,
                    ["articles", "id", "designation"],
                    1,
                    null
                );
                // Reset du champ d'article
                choices[1].removeActiveItems();
                // Reset du champ des taxes
                choices[2].removeActiveItems();
                // Mise à jour du formulaire après changement du champ de sélection des article
                cmdFournisseur.getArticle();
                // Mise à null de l'Id pour apprêter le formulaire au nouvel ajout
                cmdFournisseurForm.find("#item-id").val(null);
                //Affichage ou non des champs de remise
                cmdFournisseur.remiseInputsToggle();
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "l'enregistrement");
            });
    },
    submitInfosGeneralesFormData: function (event) {
        event.preventDefault();        
        // Initialisation de l'url et méthode de soumission de formulaire
        let data = "";
        let submitUrl = "";
        let method = "";
        // Pour les données d'expédition
        if(sectionFormCmdFournisseur == "infos-generales") {
            data = cmdFournisseur.dataFormatInfosGenerales(infosGeneralesForm);
            submitUrl = URL_CMD_INFOS_ADD.replace("__id__", commande.id);
            method = "PUT";
        }
        GlobalScript.request(submitUrl, method, data)
            .then(function (data) {
                // Run this when your request was successful
                commande = data;
                // Mise à jour des infos générale de la commande dans le formulaire
                cmdFournisseur.setInfosGeneralesForm(null);
                // Notification de succès
                alertify.success("Enregistrement effectué avec succès.");                
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "l'enregistrement");
            });
    },
    editItem: function (el) {
        // Récupération de l'id de l'objet
        let detailId = el.data("item-id");
        // 
        GlobalScript.request(
            URL_GET_ITEM.replace(
                "__id__",
                commande ? (commande.id ? commande.id : 0) : 0
            ).replace("__detailId__", detailId),
            "GET",
            null
        )
            .then(function (data) {
                // Run this when your request was successful
                GlobalScript.scrollToTop();
                let itemObj = data;
                // Mise à jour de l'article 
                article = data.article;       
                //Mise à jour du prix originale de l'article
                originalPrice = itemObj.remise ? itemObj.discount.originalPrice : itemObj.prixUnitaire;
                // Mise à jour du formulaire de l'ordre d'achat (ajout d'un article)
                cmdFournisseur.setformData(cmdFournisseurForm, itemObj);
                // Écoute de changement dans le formulaire
                GlobalScript.formChange(cmdFournisseurForm);
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
            URL_GET_ITEM.replace(
                "__id__",
                commande ? (commande.id ? commande.id : 0) : 0
            ).replace("__detailId__", detailId),
            "GET",
            null
        )
            .then(function (data) {
                // Run this when your request was successful
                let itemObj = data;
                // Mise à jour de l'affichage
                cmdFournisseur.setShowingTable(itemObj);
                // Affichage du modal
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
                commande ? (commande.id ? commande.id : 0) : 0
            ).replace("__detailId__", detailId),
            "DELETE",
            null
        )
            .then(function (data) {
                // Run this when your request was successful
                // console.log(data);
                alertify.success(oktext);
                datatable.ajax.reload();
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la suppression");
            });
    },
    setformData: function (form, item) {
        if (form.length) {            
            // Initialisation des éléments de la section du formulaire
            let el = null;
            // Champ de la description de l'expédition
            if(item.expedition) {
                // Mise à jour de la description de l'expédition
                form.find("#expedition-description").val(item.name);
                // Choix de la section de l'expédition du formulaire
                el = $("div.section-wrapper").find("#expeditionSectionRadio").prop("checked", true);7
                // Mise à jour de la secton du formulaire : utilise pour la suite du code
                sectionFormCmdFournisseur = "expedition";
            }
            // Choix de la section de l'ajout de l'article si ce dernier existe
            if(item.article){
                // Sélection du bouton radio de la secton Article
                el = $("div.section-wrapper").find("#articleSectionRadio").prop("checked", true);
                // Mise à jour de la secton du formulaire : utilise pour la suite du code
                sectionFormCmdFournisseur = "article";
            }      
            // Mise à jour du champs de sélection des article
            choices[1].setChoiceByValue(item.article ? item.article.id : 0);
            // Mise à jour du formulaire suite au choix des sections
            cmdFournisseur.choixSectionFormulaireCmdf(null, el, true);
            // Mise à jour du formulaire
            form.find("#item-id").val(item.id);
            form.find("#prix_u").val(item.prixUht);
            form.find("#quantite").val(item.quantite);
            // Gestsion de la remise
            form.find("#remise-check").prop("checked", item.remise ? true : false);
            form.find("#remise_taux").val(item.discount ? item.discount.taux : "");
            form.find("#remise_prix_u").val(item.discount ? item.discount.originalPrice : "");
            form.find("#remise_description").val(item.discount ? item.discount.priceModification : "");
            // Les champs de sélection
            choices[0].setChoiceByValue(fournisseur.id);            
            choices[2].setChoiceByValue(item.taxe.id);
            cmdFournisseur.setMontant();
            // Affichage ou non des champs de la remise
            cmdFournisseur.remiseInputsToggle();
        }
    },
    dataFormat: function (form) {
        if (form.length) {
            let remise = form.find("#remise-check").is(":checked");
            data = {
                id: form.find("#item-id").val(),
                quantite: form.find("#quantite").val(),
                unite: "U",
                prixUht: form.find("#prix_u").val(),
                remise: remise,
                taux: remise ? form.find("#remise_taux").val() : null,
                originalPrice: remise ? form.find("#remise_prix_u").val() : null,
                priceModification: remise ? form.find("#remise_description").val() : null,
                taxeId: form.find("#taxe").val(),
                // Pour les données d'expédition
                expedition: sectionFormCmdFournisseur == "expedition" ? true : false,
                name: form.find("#expedition-description").val(),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    dataFormatInfosGenerales: function (form) {
        if (form.length) {
            data = {
                referenceExterne: form.find("#reference-externe").val(),
                notes: form.find("#notes").val(),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    validationDataFormat: function (form) {
        if (form.length) {
            let dateCreation = new Date(form.find("#date-livraison").val());
            data = {
                dateLivraison: (dateCreation.toISOString()).slice(0, 19),
                referenceFactureFournisseur: form.find("#reference-facture").val(),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    validateCmdFournisseur: function (oktitle, oktext) {
        let data = cmdFournisseur.validationDataFormat(cmdFournisseurValidationForm);
        // console.log(data);
        GlobalScript.request(
            URL_VALIDER_CMD_FOURNISSEUR.replace(
                "__id__",
                commande ? (commande.id ? commande.id : 0) : 0
            ),
            "PUT",
            data
        ).then(function (data) {
            // Run this when your request was successful
            commande = data;
            // // Mise à jour des infos générale de la commande dans le formulaire
            // cmdFournisseur.setInfosGeneralesForm(null);
            // Mise à jour des sections du forumulaire del'ordre d'achat
            cmdFournisseur.resetFormSection();
            //
            alertify.success(oktext);
            datatable.ajax.reload();
            $("#validate-commande-modal").modal("toggle");
            // cmdFournisseur.saSuccesCmdFournisseurValider(
            //     "Validée !",
            //     "Ordre d'achat validé avec succès ! Cliquer sur 'OK' pour générer le pdf de l'ordre d'achat."
            // );
            location.href = URL_CMD_FOURNISSEUR_INDEX;
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la validation");
        });
    },
    // Récupération de la liste des articles ou des fournisseurs
    getForeignsData: function (url, selectData = [], choicePosition, itemId) {
        GlobalScript.request(url, "GET", null)
            .then(function (data) {
                // Run this when your request was successful
                dataJon = data;
                choices[choicePosition].clearChoices();
                if ($.inArray(selectData[0], ["catégories", 5]) > -1) {
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
                // Vérification si l'ID de la commande provient de l'URL
                if (CMDF_ID && selectData[0] == "fournisseurs") {
                    // Récupération de la commande et recharge du tablau des lignes de la commande
                    cmdFournisseur.getCmdFournisseurById(CMDF_ID);
                }
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération des " + selectData[0]);
            });
    },
    reloadDatatable: function (event) {
        event.preventDefault();
        // Remise à null de l'ID de la commande venant de l'url de la page
        CMDF_ID = null;
        // Récupération de l'id du fournisseur
        let fournisseurId = cmdFournisseurForm.find("#fournisseur").val();
        // Récupération du fournisseur choisi et rechargement de la liste des détails de la commande
        if (fournisseurId) cmdFournisseur.getEntity(URL_GET_FOURNISSEUR, fournisseurId, "fournisseur");
        // Rechargement de liste des détails de la commande si aucun fournisseur choisi
        else {
            fournisseur = null;
            datatable.ajax.reload();
        }
        // Récupération de la commande fournisseur
        cmdFournisseur.getEntity(
            URL_GET_ITEM_BY_FOURNISSEUR.replace("__fId__", fournisseurId ? fournisseurId : 0),
            fournisseurId,
            "l'ordre d'achat"
        );        
    },
    getArticle: function (event = null) {
        if (event) event.preventDefault();
        let articleId = cmdFournisseurForm.find("#article").val();
        if (articleId)
            cmdFournisseur.getEntity(URL_GET_ARTICLE, articleId, "l'article");
        else {
            article = null;
            cmdFournisseur.setFormOnArticleChange();
        }
    },
    setFormOnArticleChange: function () {
        // Mise à jour du formulaire
        cmdFournisseurForm.find("#prix_u").val(article ? 0 : null);
        cmdFournisseurForm.find("#quantite").val(article ? 1 : null);
        cmdFournisseurForm.find("#montant").val(article ? 0 : null);
        // Taxe
        // article ? choices[2].setChoiceByValue(article?.taxe.id) : choices[2].removeActiveItems();
        // cmdFournisseurForm.find("#prix_u").val();
        // cmdFournisseurForm.find("#quantite").val(1);
        // cmdFournisseurForm.find("#montant").val(0);
        // Taxe
        choices[2].removeActiveItems();
        // Gestion des remise
        cmdFournisseurForm.find("#remise-check").prop("checked", false);
        // Affichage ou non des champs de la remise
        cmdFournisseur.remiseInputsToggle();
    },
    setMontant: function (event = null) {
        if (event) event.preventDefault();
        let prixU = cmdFournisseurForm.find("#prix_u").val();
        let quantite = cmdFournisseurForm.find("#quantite").val();
        // Gestion du montant
        let montant = 0;
        if (prixU && quantite) montant = prixU * quantite;
        cmdFournisseurForm.find("#montant").val(montant);
        // Gestion de la taxe spécifique
        let montantTs = taxeSpecifique ? (taxeSpecifique * quantite) : null;
        cmdFournisseurForm.find("#taxe-specifique").val(montantTs);
    },
    getEntity: function (url, id, dataname = "donnée", reloadDatatable = false) {
        GlobalScript.request(url.replace("__id__", id), "GET", null)
            .then(function (data) {
                // Run this when your request was successful
                dataJson = data;
                // console.log(dataJson);
                if (dataname == "fournisseur") {
                    fournisseur = dataJson;
                    datatable.ajax.reload();
                }
                if (dataname == "l'article") {
                    article = dataJson;
                    // Mise à jour du formulaire de la remise 
                    // originalPrice = article.prix;
                    cmdFournisseur.setFormOnArticleChange();
                }

                if (dataname == "l'ordre d'achat") {
                    commande = dataJson;
                    // Mise à jour des sections du forumulaire del'ordre d'achat
                    cmdFournisseur.resetFormSection();
                }
                return dataJson;
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération de " + dataname);
            });
    },
    setShowingTable: function(itemObj) {
        let $showClasseTable = $("table.item-show-table");
        //Affichage générale
        $showClasseTable.find(".td-detail-reference").text(itemObj.article ? itemObj.article.reference : "-");
        $showClasseTable
            .find(".td-detail-designation")
            .text(itemObj.name);
        $showClasseTable.find(".td-detail-quantite").text(itemObj.quantite);
        $showClasseTable.find(".td-detail-taxe").text(itemObj.taxe.string);

         // Affichage des montants
         let $detailRecpMontantTable = $("table.detail-recap-montant-table");
         $detailRecpMontantTable
             .find(".td-detail-prixUnitaire")
             .text(itemObj.prixUht);
         $detailRecpMontantTable
             .find(".td-detail-mht")
             .text(itemObj.montantHt ? itemObj.montantHt : "0");
         $detailRecpMontantTable
             .find(".td-detail-mtva")
             .text(itemObj.montantTva ? itemObj.montantTva : "0");
         $detailRecpMontantTable
             .find(".td-detail-mttc")
             .text(itemObj.montantTtc ? itemObj.montantTtc : "0");

        // Affichage taxe spécifique et remise
        let $tsRemmiseShowTable = $("table.ts-remise-show-table");
        let remiseFalseText = $("#remise-false-text");
        if(itemObj.remise) {
            remiseFalseText.hide();
            $tsRemmiseShowTable.show();
            $tsRemmiseShowTable.find(".td-detail-remise").text(itemObj.remise ? "Oui" : "Non");
            $tsRemmiseShowTable.find(".td-detail-remise-taux").text(itemObj.remise ? itemObj.discount.taux + "%" : "-");
            $tsRemmiseShowTable.find(".td-detail-remise-prix-u").text(itemObj.remise ? itemObj.discount.originalPrice : "-");
            $tsRemmiseShowTable.find(".td-detail-remise-description").text(itemObj.remise ? itemObj.discount.priceModification : "-");
        } else {
            $tsRemmiseShowTable.hide();
            remiseFalseText.show();
        }
        // if (!itemObj.remise) $tsRemmiseShowTable.find(".tr-detail-remise").hide();

    },
    getCmdFournisseurById: function (cmdFournisseurId) {
        GlobalScript.request(URL_GET_CMD_FOURNISSEUR.replace("__id__", cmdFournisseurId), "GET", null)
            .then(function (data) {
                // Run this when your request was successful
                // console.log(data);
                commande = data;
                // Mise à jour des infos générale de la commande dans le formulaire
                cmdFournisseur.setInfosGeneralesForm(null);
                //
                fournisseur = commande.fournisseur;
                choices[0].setChoiceByValue(fournisseur.id);
                datatable.ajax.reload();
            })
            .catch(function (err) {
                // Run this when promise was rejected via reject()
                GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération de la commande");
            });
    },
    confirmCmdFournisseurValidation: function (event) {
        event.preventDefault();
        cmdFournisseur.saValidateCmdFournisseurParams(
            "Êtes-vous sûr de vouloir valider cet ordre d'achat ?",
            "Cette opération est irréversible !",
            "Oui, valider !",
            "Non, annuller !",
            "Validée !",
            "Validation effectuée avec succès.",
            "Annullée !",
            "Opération annullée, rien n'a changé."
        );
    },
    setValidatonFormRecapTable: function () {
        let $validationFormRecpaTable = $("table.commande-validation-table");
        $validationFormRecpaTable
            .find(".td-commande-remise")
            .text(commande.montantRemise ? commande.montantRemise : 0.00);
        $validationFormRecpaTable
            .find(".td-commande-mht")
            .text(commande.montantHt ? commande.montantHt : 0.00);
        $validationFormRecpaTable
            .find(".td-commande-mtva")
            .text(commande.montantTva ? commande.montantTva : 0.00);
        $validationFormRecpaTable
            .find(".td-commande-mttc")
            .text(commande.montantTtc ? commande.montantTtc : 0.00);    
    },
    customMessageOncmdFournisseurFormSubmit: function (event = null) {
        if (event) event.preventDefault();
        //   Si aucun fournisseur choisi      
        if (!cmdFournisseurForm.find("#fournisseur").val()) {
            alertify.warning("Veuillez sélectionner un fournisseur svp !");
            return;
        }
        // Si c'est la section d'ajout d'article
        if(sectionFormCmdFournisseur == "article"){            
            // Si aucun article choisi
            if (!cmdFournisseurForm.find("#article").val()) {
                alertify.warning("Veuillez sélectionner un article svp !");
                return;
            }
        }
        // Si c'est la section d'ajout des données d'expédition
        if(sectionFormCmdFournisseur == "expedition"){            
            // Si la description d'expédition est vide
            if (!cmdFournisseurForm.find("#expedition-description").val()) {
                alertify.warning("Veuillez ajouter une description pour l'expédition svp !");
                return;
            }
        }
        // Si aucune taxe choisie
        if (!cmdFournisseurForm.find("#taxe").val()) {
            alertify.warning("Veuillez sélectionner une taxe svp !");
            return;
        }
        // La soumission du formulaire
        cmdFournisseur.submitFormData(event);
      
    },
    customMessageOnValidationFormSubmit: function (event = null) {
        if (event) event.preventDefault();
         // Vérification de la date de livraison
        if (!cmdFournisseurValidationForm.find("#date-livraison").val()) {
            alertify.warning("Veuillez ajouter une date de livraison !");
            return;
        } 
        if (!cmdFournisseurValidationForm.find("#reference-facture").val()) {
            alertify.warning("Veuillez ajouter la référence de la facture du fournisseur !");
            return;
        } 
        
        cmdFournisseur.confirmCmdFournisseurValidation(event);
    },
    choixSectionFormulaireCmdf: function(event=null, el, modification = false) {
        if(event) event.preventDefault();
        // Réinitialisation du formulaire
        if(!modification){            
            choices[1].removeActiveItems();
            cmdFournisseur.getArticle();
        }
        // Récupération de la section
        sectionFormCmdFournisseur = el.data("section");
        // Récupération du parent du champ des articles et des données d'expédition
        let $articleWrapper = cmdFournisseurForm.find("div#article-wrapper")
        let $expeditionWrapper = cmdFournisseurForm.find("div#expedition-description-wrapper")
        // Vérification de l'état de la commande du fournisseur
        if(sectionFormCmdFournisseur != "article" && (!commande?.id || !commande.details.length)) {
            alertify.warning(
                "Veuillez d'abord ajouter un article à l'ordre d'achat !"
            );
            el = $("div.section-wrapper").find("#articleSectionRadio").prop("checked", true);
            $articleWrapper.removeClass("d-none");
            $expeditionWrapper.addClass("d-none");
            // Rendre le champ de données d'expédition non réquis
            $expeditionWrapper.find("#expedition-description").removeAttr("required");
            return;
        }
        // Si c'est la section d'article qui est choisie
        if(sectionFormCmdFournisseur == "article"){
            $articleWrapper.removeClass("d-none");
            $expeditionWrapper.addClass("d-none");
            // Rendre le champ de données d'expédition non réquis
            $expeditionWrapper.find("#expedition-description").removeAttr("required");
            //
            infosGeneralesForm.addClass("d-none");
            cmdFournisseurForm.removeClass("d-none");
        }
        // Section des données de l'expédition
        if(sectionFormCmdFournisseur == "expedition") {
            $articleWrapper.addClass("d-none");
            $expeditionWrapper.removeClass("d-none");
            // Rendre le champ de données d'expédition réquis
            $expeditionWrapper.find("#expedition-description").attr("required", "required");
            //
            infosGeneralesForm.addClass("d-none");
            cmdFournisseurForm.removeClass("d-none");
        }
        // Section des infos générales
        if(sectionFormCmdFournisseur == "infos-generales") {
            cmdFournisseurForm.addClass("d-none");
            infosGeneralesForm.removeClass("d-none");
        }
    },
    setInfosGeneralesForm: function(event=null) {
        if(event) event.preventDefault();
        if(commande.id) {
            infosGeneralesForm.find("#date-creation").val(commande.dateCreation.slice(0, 19));
            infosGeneralesForm.find("#reference-externe").val(commande.referenceExterne);
            infosGeneralesForm.find("#notes").val(commande.notes);
        }
    },
    resetFormSection: function() {
        // Mise à jour de la section du formulaire
        // Sélection du bouton radio de la secton Article
        el = $("div.section-wrapper").find("#articleSectionRadio").prop("checked", true);
        // Mise à jour de la secton du formulaire : utilise pour la suite du code
        sectionFormCmdFournisseur = "article";
        // Mise à jour du champs de sélection des article
        choices[1].setChoiceByValue(0);
        // Mise à jour du formulaire suite au choix des sections
        cmdFournisseur.choixSectionFormulaireCmdf(null, el);
        // Mise à jour des infos générale de la commande dans le formulaire
        cmdFournisseur.setInfosGeneralesForm(null);
    },
    /**
     * Gestion du formulaire de remise
     */
    remiseInputsToggle: function (event = null) {
        if (event) event.preventDefault();
        // Récupération de l'état de la remise
        let remise = cmdFournisseurForm.find("#remise-check").is(":checked");
        // Récupération du prix unitaire : utile pour la remise
        let prixUht = cmdFournisseurForm.find("#prix_u").val() ? cmdFournisseurForm.find("#prix_u").val() : 0;
        if (remise) {
            if (sectionFormCmdFournisseur == "article" && !article) {
                alertify.warning(
                    "Veuillez sélectionner un article svp !"
                );
                cmdFournisseurForm.find("#remise-check").prop("checked", false)
            } else if (sectionFormCmdFournisseur == "expedition" && !prixUht) {
                alertify.warning(
                    "Veuillez mettre à jour le prix unitaire svp !"
                );
                cmdFournisseurForm.find("#remise-check").prop("checked", false)
            } else {
                cmdFournisseurForm.find("div#remiseInputsToggle").show();
                cmdFournisseurForm.find("#remise_taux").attr("required", "required");
                cmdFournisseurForm.find("#remise_prix_u").attr("required", "required");
                cmdFournisseurForm.find("#remise_description").attr("required", "required");
                // Mise à jour automatique du prix original de l'article pour la remise
                originalPrice = originalPrice ? originalPrice : prixUht;
                cmdFournisseurForm.find("#remise_prix_u").val(originalPrice);
                // Mise à jour des du formulaire pour la remise
                cmdFournisseur.setRemiseFormOnPricesChange();
            }
        } else {
            cmdFournisseurForm.find("div#remiseInputsToggle").hide();
            cmdFournisseurForm.find("#remise_taux").removeAttr("required");
            cmdFournisseurForm.find("#remise_prix_u").removeAttr("required");
            cmdFournisseurForm.find("#remise_description").removeAttr("required");
            cmdFournisseurForm.find("#remise_taux").val(null);
            cmdFournisseurForm.find("#remise_prix_u").val(null);
            cmdFournisseurForm.find("#remise_description").val(null);
        }
    },
    setRemiseFormOnPricesChange: function (event = null, setMontant = false) {
        if (event) event.preventDefault()
        // Récupération de l'état de la remise
        let remise = cmdFournisseurForm.find("#remise-check").is(":checked");
        // Récupération du prix unitaire : utile pour la remise
        let prixUht = cmdFournisseurForm.find("#prix_u").val() ? cmdFournisseurForm.find("#prix_u").val() : 0;
        if (remise) {
            let prixUnitaire = parseInt(prixUht);
            let prixOriginale = parseInt(cmdFournisseurForm.find("#remise_prix_u").val());
            let taux = ((prixOriginale && prixUnitaire) && prixUnitaire < prixOriginale) ? Math.round(((prixOriginale - prixUnitaire) * 100) / prixOriginale) : 0;
            cmdFournisseurForm.find("#remise_taux").val(taux);
            cmdFournisseurForm.find("#remise_description").val("Une remise de " + taux + "%");
        } else {
            cmdFournisseur.remiseInputsToggle();
        }
        if (setMontant)
            cmdFournisseur.setMontant();
    },
    setRemiseFormOnTauxChange: function (event = null) {
        if (event) event.preventDefault()
        let remise = cmdFournisseurForm.find("#remise-check").is(":checked");
        if (remise) {
            let prixOriginale = parseInt(cmdFournisseurForm.find("#remise_prix_u").val());
            let taux = parseInt(cmdFournisseurForm.find("#remise_taux").val());
            let prixUnitaire = prixOriginale ? (prixOriginale - Math.round((prixOriginale * taux) / 100)) : 0;
            cmdFournisseurForm.find("#prix_u").val(prixUnitaire);
            cmdFournisseurForm.find("#remise_description").val("Une remise de " + taux + "%");
            cmdFournisseur.setMontant();
        } else {
            cmdFournisseur.remiseInputsToggle();
        }
    },
    /**
     * Soumission du formulaire du fournisseur
     */
    fournisseurSubmitFormData: function (event) {
        event.preventDefault();
        let form = $("div.fournisseur-new-modal").find('form');
        let data = cmdFournisseur.fournisseurDataFormat(form)
        let dataId = form.find("#item-id").val();
        // console.log(data)
        GlobalScript.request((dataId ? URL_PUT_FOURNISSEUR.replace("__id__", dataId) : URL_POST_FOURNISSEUR), (dataId ? 'PUT' : 'POST'), data).then(function (data) {
            // Run this when your request was successful
            // console.log(data)
            fournisseur = data;
            // Mise à jour du champ de selection du fournisseur
            choices[0].setChoices([{ value: data.id, label: data.name, selected: true }])
            //
            datatable.ajax.reload();
            // Alert de succès
            alertify.success("Enregistrement effectué avec succès")
            // Fermeture du modal
            $("div.fournisseur-new-modal").modal('hide')
            // Réinitialisation du formulaire
            form[0].reset()
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    fournisseurDataFormat: function (form) {
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
    fournisseurNewItemEvent: function (event) {
        event.preventDefault();
        $("div.fournisseur-new-modal").find('h5.modal-title').text('Nouvel ajout');
        let form = $("div.fournisseur-new-modal").find('form');
        form.attr("onsubmit", "cmdFournisseur.fournisseurSubmitFormData(event)")
        form[0].reset();
        form.find("#item-id").val("");
    },
    /**
     * Soumission du formulaire de l'article
     */
    articleSubmitFormData: function (event) {
        event.preventDefault();
        let form = $("div.article-new-modal").find('form');
        let data = cmdFournisseur.articleDataFormat(form)
        let dataId = form.find("#item-id").val();
        // console.log(data)
        let categorieId = form.find("#categorie").val();
        let taxeId = form.find("#taxe").val();
        let obj = { '__id__': dataId, '__cId__': categorieId, '__tId__': taxeId }
        let submitUrl = dataId ? GlobalScript.textMultipleReplace(URL_PUT_ARTICLE, obj) : GlobalScript.textMultipleReplace(URL_POST_ARTICLE, obj);
        GlobalScript.request(submitUrl, (dataId ? 'PUT' : 'POST'), data).then(function (data) {
            // Run this when your request was successful
            // console.log(data)
            article = data;
            // Mise à jour du champ de selection de l'article
            choices[1].setChoices([{ value: data.id, label: data.designation, selected: true }])
            // Sauvegarde de la taxe spécique si existante sinon null
            taxeSpecifique = article.taxeSpecifique;
            // originalPrice = article.prix;
            cmdFournisseur.setFormOnArticleChange();
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
                'reference': GlobalScript.checkBlank(form.find("#reference").val()),
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
        let form = $("div.article-new-modal").find('form');
        form.attr("onsubmit", "cmdFournisseur.articleSubmitFormData(event)")
        form[0].reset();
        form.find("#item-id").val("");
        GlobalScript.getForeignsData(URL_LIST_CATEGORIE_ARTICLE, ['catégories', 'id', 'libelle'], 3, null);
        GlobalScript.getForeignsData(URL_LIST_TAXE, ['taxes', 'id', 'string'], 4, null);
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
    cmdFournisseur.listInitalizer();
    // Edit record
    datatable.on("click", ".edit-item", function (e) {
        e.preventDefault();
        formChange = false;
        cmdFournisseur.editItem($(this));
    });

    // Delete a record
    datatable.on("click", ".remove-item", function (e) {
        e.preventDefault();
        //cmdFournisseur.removeItem($(this));
        cmdFournisseur.saRemoveParams(
            $(this),
            "Êtes-vous sûr de vouloir supprimer cette ligne de l'ordre d'achat ?",
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
        cmdFournisseur.showItem($(this));
    });

    //Validate commande
    $("a.validate-commande").click(function (e) {
        e.preventDefault();
        // console.log("ici");
        if (commande && commande.valid) {
            alertify.warning("Cette commande est déjà validée");
        } else if (commande && commande.details.length) {
            // Vérification des données des infos générales
            if(!commande.notes){
                alertify.warning(
                    "Veuillez séléctionner la section 'Infos Générale' et remplissez tout au-moins le champ 'Notes'."
                );
                return;
            }
            // Mise à jour du modal de validation
            cmdFournisseur.setValidatonFormRecapTable();
            // Affichage du modal de validation de la commande            
            $("#validate-commande-modal").modal("toggle");
        } else {
            alertify.warning(
                "Veuillez ajouter un article à l'ordre d'achat en remplissant le formulaire ci-dessus."
            );
            // Scroller la page vers le haut
            GlobalScript.scrollToTop();
        }
    });
    // Gestion du responsive du tableau de liste
    // Utilise pour une bonne affichage des options de la colonne action
    datatable.on('responsive-resize', function (e, datatable, columns) {
        e.preventDefault();
        let count = columns.reduce(function (a, b) {
            return b === false ? a + 1 : a;
        }, 0);
        let position = count ? "relative" : "absolute";
        datatable.on('click', 'button.dropdown-toggle', function (e) {
            e.preventDefault();
            $(".dropdown-menu-end").css("position", position);
        });
        // console.log(count + ' column(s) are hidden');
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Initialisation de tous les champs de sélection 
    cmdFournisseur.choicesJsInit();
    // Récupération du formulaire d'ajout d'article et des données de l'expédition
    cmdFournisseurForm = $("div#cmdFournisseurForm").find("form.article-expedition");
    // Récupération du formulaire des infos générales de la commande
    infosGeneralesForm = $("div#cmdFournisseurForm").find("form.infos-generales");
    // Récupération du formulaire de validation de la commande
    cmdFournisseurValidationForm = $("div#validate-commande-modal").find("form");
    // Mettre l'événement de clique sur les bouton radion des section du formulaire de la commande
    $("div.section-wrapper").find("input[name='sectionRadios']").on('change', function(event) {
        cmdFournisseur.choixSectionFormulaireCmdf(event, $(this));
    });
    //Gestion des champs de remise
    cmdFournisseur.remiseInputsToggle();
    // Récupération des fournisseurs
    cmdFournisseur.getForeignsData(
        URL_LIST_FOURNISSEUR,
        ["fournisseurs", "id", "name"],
        0,
        null
    );
    // Récupération des articles
    cmdFournisseur.getForeignsData(
        URL_LIST_ARTICLE,
        ["articles", "id", "designation"],
        1,
        null
    );
    //Récupération des taxes
    cmdFournisseur.getForeignsData(
        URL_LIST_TAXE,
        ["taxes", "id", "string"],
        2,
        null
    );
    // Récupération de la commande et recharge du tablau des lignes de la commande
    if (CMDF_ID) {
        cmdFournisseur.getCmdFournisseurById(CMDF_ID);
    }
    // Gestion de la taxe spécifique de l'article 
    $("div.article-new-modal").find('form').find("input#taxe-specifique").keyup(function (event) {
        event.preventDefault();
        cmdFournisseur.articleSetTsName($(this));
    })
    // Input mask pour l'ifu du fournisseur
    $("div.fournisseur-new-modal").find('form').find("#ifu").inputmask({
        mask: "*************",
        casing: "upper",
    });
});