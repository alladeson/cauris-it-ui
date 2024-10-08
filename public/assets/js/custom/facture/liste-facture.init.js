let datatable;
let choices = [];
let objet;
let statsPayload = {
    "debut": null,
    "fin": null,
    "debutAt": null,
    "finAt": null,
};
let filtreForm = null;
let url_list = null;
let listeFacture = {
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
                                        "url": url_list,
                                        "method": "GET",
                                        "data": JSON.stringify(statsPayload),
                                    };
                                },
                                "dataSrc": "",
                                error: function(xhr, status, error) {
                                    (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide')
                                    GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des factures");
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
                                                `<input type="checkbox" class="form-check-input" id="facturecheck${data}">` +
                                                `<label class="form-check-label" for="facturecheck${data}"></label>` +
                                                `</div>`;
                                        }
                                    },
                                    { data: 'id' },
                                    { data: 'type.description' },
                                    // {
                                    //     data: 'createdAt',
                                    //     "render": function(data, type, row, meta) {
                                    //         return GlobalScript.dateFormat(data);
                                    //     }
                                    // },
                                    { data: 'client.name' },
                                    { data: 'montantTtc' },
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
                                        data: 'reference',
                                        render: function(data, type, row, meta) {
                                            return data ? data : "-";
                                        }
                                    },
                                    {
                                        data: 'date',
                                        render: function(data, type, row, meta) {
                                            return data ? GlobalScript.dateFormat(data) : "-";
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
                                            ${row.confirm ?
                                                `<li>
                                                    <a class="dropdown-item show-item" href="javascript:void(0);" data-item-id="${data}">Afficher</a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item print-item" href="javascript:void(0);" data-item-id="${data}">Générer Facture</a>
                                                </li>` : 
                                                ITEM_WRITABLE ?
                                                `<li>
                                                    <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier et/ou valider</a>
                                                </li>` : `` }
                                                ${(!row.confirm && ITEM_DELETABLE /*&& !row.details.length*/) ?
                                                    `<li>
                                                        <a class="dropdown-item remove-item" href="javascript:void(0);" data-item-id="${data}">Supprimer</a>
                                                    </li>` : `` }
                                            </ul>
                                        </div>`;
                    return html;
                }
            }
            ],
        }),
            $(".dataTables_length select").addClass("form-select form-select-sm");
    },
    choicesJsInit: function () {
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
                searchEnabled: $.inArray(i, [0]) > -1 ? false : true,
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
                listeFacture.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                listeFacture.saError(notitle, notext);
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
                listeFacture.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                listeFacture.saError(notitle, notext);
        });
    },
    showItem: function (el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //// console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function (data) {
            // Run this when your request was successful
            // console.log(data)
            listeFacture.setDetailsFactureRecapTable(data);
            $(".show-item-modal").modal('show')

        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage");
        });
    },
    editItem: function (el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //// console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function (data) {
            // Run this when your request was successful
            if (data.type.groupe == "FV") {
                location.href = URL_GLOBAL_UPDATE_FACTURE_VENTE.replace("__id__", data.id);
            } else if (data.type.groupe == "FA") {
                location.href = URL_GLOBAL_DETAILS_FACTURE.replace("__id__", data.id);
            }
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage de l'interface de modification");
        });
    },
    printItem: function (el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //// console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function (data) {
            // Run this when your request was successful
            // console.log(data)
            GlobalScript.showPrintedInvoice(data);
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage de l'interface de modification");
        });
    },
    removeItem: function (el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // // console.log(id);
        GlobalScript.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function (data) {
            // Run this when your request was successful
            // console.log(data);
            alertify.success(oktext)
            datatable.ajax.reload();
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la suppression");
        });
    },
    reloadDatatable: function (event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setDetailsFactureRecapTable: function (facture) {
        // Tableau des données de validation
        let $validationDataFormTable = $("div#facture-details-modal table.invoice-validation-data-table");
        $validationDataFormTable.find(".td-invoice-type-facture").text(facture.type ? facture.type.description : "-");
        $validationDataFormTable.find(".td-invoice-aib").text(facture.aib ? facture.montantAib : "-");
        $validationDataFormTable.find(".td-invoice-type-paiement").text(facture.reglement ? facture.reglement.typePaiement.description : "-");
        $validationDataFormTable.find(".td-invoice-mrecu").text(facture.reglement ? facture.reglement.montantRecu : "-");
        $validationDataFormTable.find(".td-invoice-mpayer").text(facture.reglement ? facture.reglement.montantPayer : "-");
        $validationDataFormTable.find(".td-invoice-mrendu").text(facture.reglement ? facture.reglement.montantRendu : "-");
        $validationDataFormTable.find(".td-invoice-description").text(facture.reglement ? facture.reglement.description : "-");
        $validationDataFormTable.find(".td-invoice-nb").text(facture.reglement ? facture.reglement.nb : "-");

        // Tableau recap des montants
        let $validationFormRecpaTable = $("div#facture-details-modal table.invoice-validation-table");
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

        // Mise à jour des bouton d'impression et de détails
        $("div#facture-details-modal").find("button.btn-print").attr("data-id", facture.id)
        $("div#facture-details-modal").find("button.btn-details").attr("data-id", facture.id)
        // Gestion de l'impression de la factrue
        $("div#facture-details-modal").find("button.btn-print").click(function (e) {
            e.preventDefault();
            GlobalScript.showPrintedInvoice(facture);
        })
        // Gestion de l'affichage des détails de la facture
        $("div#facture-details-modal").find("button.btn-details").click(function (e) {
            e.preventDefault();
            location.href = URL_GLOBAL_DETAILS_FACTURE.replace("__id__", facture.id);
        })
        //Afficher le modal
        $("div#facture-details-modal").modal('show');
    },
};
$(document).ready(function () {
    // Mise de l'url de liste des facture pour récupérer une liste vide
    url_list = URL_LIST_ITEM + "?search=vide";
    // Initialisation du table de liste de facture avec datatable
    listeFacture.listInitalizer();
    // Edit record
    datatable.on('click', '.edit-item', function (e) {
        e.preventDefault();
        listeFacture.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function (e) {
        e.preventDefault();
        listeFacture.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cette facture ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimée !", "Facture supprimée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    // Delete a record
    datatable.on('click', '.print-item', function (e) {
        e.preventDefault();
        listeFacture.printItem($(this));
    });

    //Show record
    datatable.on('click', '.show-item', function (e) {
        e.preventDefault();
        listeFacture.showItem($(this));
    });
    //Show Action
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
    // Initialisation des champs de séléction avec choices.js
    listeFacture.choicesJsInit();
    // Récupératon des types de facture
    GlobalScript.getForeignsData(
        URL_LIST_TYPE_FACTURE,
        ["types de facture", "id", "description"],
        0,
        null,
        false,
    );
    // Récupération du formulaire du filtre
    filtreForm = $("form.filtre-form");
    // Gestion des évènements liées au filtre de la liste des factures
    // Si "Toutes" est coché, alors décocher les boutons radios de date
    filtreForm.find("input#getAll").change(function (event) {
        event.preventDefault();
        if (filtreForm.find("input#getAll").is(":checked"))
            filtreForm.find("input[name='dateRadios']:checked").prop("checked", false);
    })
    // Si une des boutons radios de date est cochée, alors décocher "Toutes"
    filtreForm.find("input[name='dateRadios']").change(function (event) {
        event.preventDefault();
        filtreForm.find("input#getAll").prop("checked", false);
    })
    // Lors de la soumission du formulaire de filtre, c'est-à-dire en cliquant sur le bouton de recherche
    filtreForm.submit(function (event) {
        event.preventDefault();
        // Récupération du type de la facture sélectionné
        let typeFactureId = filtreForm.find("select#type").val();
        // Si "Toutes" est coché, on récupère toutes les facture, ou en fonction du type de facture
        if (filtreForm.find("input#getAll").is(":checked")) {
            // alertify.success("'Toutes' coché");
            url_list = URL_LIST_ITEM;
            // Si le type de facture n'est pas vide, on récupère la liste en fonction du type de la facture
            if (typeFactureId)
                url_list = URL_LIST_FACTURE_BY_TYPE.replace("__typeId__", typeFactureId);
            // Réchargement du tableau de liste de la facture
            datatable.ajax.reload();
            return;
        }
        // Si un des boutons radios de dates est coché, alors le filtre sera fait en fonction des dates
        if (filtreForm.find("input[name='dateRadios']").is(":checked")) {
            // Si les dates ne sont pas renseignées, alors un avertissement est renvoyer et le code s'arrête là
            if (!filtreForm.find("input#date-debut").val() || !filtreForm.find("input#date-fin").val()) {
                alertify.warning("Veuillez bien renseigner les date de début et de fin svp. Merci !");
                return
            }
            // Ici les date sont renseignées
            // Récupération du type de date sélectionné
            let typeDate = filtreForm.find("input[name='dateRadios']:checked").val();
            // Récupération des dates de début et de fin
            let debut = new Date(filtreForm.find("input#date-debut").val());
            let fin = new Date(filtreForm.find("input#date-fin").val());
            // Comparaison des dates, la date de fin doit être supérieure à la date de début
            if (fin.getTime() <= debut.getTime()) {
                alertify.error("La date de fin doit être supérieure à la date de début");
                return;
            }
            // Ici les dates sont renseignées et valides
            // Si le type de date est la date de création (émission) de la facture, 
            // alors récupération de la liste en fonction de la date de création qui est une date de type Instant
            if (typeDate == "createdAt") {
                // alertify.success("Date d'émission des facture coché");
                statsPayload.debutAt = debut.toISOString();
                statsPayload.finAt = fin.toISOString();
                // console.log(statsPayload);
                url_list = URL_LIST_FACTURE_BY_CREATED_DATE;
                // Si le type de facture n'est pas vide, on récupère la liste en fonction du type de la facture
                if (typeFactureId)
                    url_list = URL_LIST_FACTURE_BY_TYPE_CREATED_DATE.replace("__typeId__", typeFactureId);
                // Réchargement du tableau de liste de la facture
                datatable.ajax.reload();
                return;
            }
            // Si le type de date est la date de confirmation (validation) de la facture,
            // alors récupération de la liste en fonction de la date de confirmation qui est une date de type Date,
            // pas besoin de la transformer, on peut utiliser directement la valeur des champ
            else if (typeDate == "confirmedAt") {
                // alertify.success("Date de confirmation des facture coché");
                // statsPayload.debut = filtreForm.find("input#date-debut").val();
                // statsPayload.fin = filtreForm.find("input#date-fin").val();
                statsPayload.debut = (debut.toISOString()).slice(0, 19);
                statsPayload.fin = (fin.toISOString()).slice(0, 19);
                // console.log(statsPayload);
                url_list = URL_LIST_FACTURE_BY_CONFIRMED_DATE;
                // Si le type de facture n'est pas vide, on récupère la liste en fonction du type de la facture
                if (typeFactureId)
                    url_list = URL_LIST_FACTURE_BY_TYPE_CONFIRMED_DATE.replace("__typeId__", typeFactureId);
                // Réchargement du tableau de liste de la facture
                datatable.ajax.reload();
                return;
            }
        }
        // Si aucun critère n'est choisi, alors un avertissement est renvoyé
        alertify.warning("Veuillez choisir un critère pour le filtre svp. Merci !");
    })

});