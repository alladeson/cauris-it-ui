let datatable;
let choices = [];
let objet;
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
                                                    <a class="dropdown-item print-item" href="javascript:void(0);" data-item-id="${data}">Imprimer</a>
                                                </li>` :
                                                `<li>
                                                    <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier et/ou valider</a>
                                                </li>` }
                                                ${(!row.confirm && !row.details.length) ? 
                                                `<li>
                                                    <a class="dropdown-item remove-item" href="javascript:void(0);" data-item-id="${data}">Supprimer</a>
                                                </li>` : ``
                                                }
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
                listeFacture.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                listeFacture.saError(notitle, notext);
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
                listeFacture.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                article.saError(notitle, notext);
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            listeFacture.setDetailsFactureRecapTable(data);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            listeFacture.saError("Erreur !", "Une erreur s'est produite lors de l'affichage.")
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            if(data.type.group == "FV"){
                location.href = URL_GLOBAL_UPDATE_FACTURE_VENTE.replace("__id__", data.id);
            }else if(data.type.group == "FA"){
                location.href = URL_GLOBAL_DETAILS_FACTURE.replace("__id__", data.id);
            }
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            listeFacture.saError("Erreur !", "Une erreur s'est produite lors de l'affichage de l'interface de modification.")
        });
    },
    printItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            window.open(
                facture.filename ? URL_GET_FILE.replace("__fileName__", data.filename) : URL_GLOBAL_IMPRIMER_FACTURE.replace("__id__", data.id),
                "_blank"
            )
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            listeFacture.saError("Erreur !", "Une erreur s'est produite lors de l'affichage de l'interface de modification.")
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // console.log(id);
        GlobalScript.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
                // article.saSucces(oktitle, oktext);
            alertify.success(oktext)
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            article.saError("Erreur !", "Une erreur s'est produite lors de la suppression.")
        });
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setDetailsFactureRecapTable: function(facture) {
        // Tableau des données de validation
        var $validationDataFormTable = $("div#facture-details-modal table.invoice-validation-data-table");
        $validationDataFormTable.find(".td-invoice-type-facture").text(facture.type ? facture.type.description : "-");
        $validationDataFormTable.find(".td-invoice-aib").text(facture.aib ? facture.montantAib : "-");
        $validationDataFormTable.find(".td-invoice-type-paiement").text(facture.reglement ? facture.reglement.typePaiement.description : "-");
        $validationDataFormTable.find(".td-invoice-mrecu").text(facture.reglement ? facture.reglement.montantRecu : "-");
        $validationDataFormTable.find(".td-invoice-mpayer").text(facture.reglement ? facture.reglement.montantPayer : "-");
        $validationDataFormTable.find(".td-invoice-mrendu").text(facture.reglement ? facture.reglement.montantRendu : "-");
        $validationDataFormTable.find(".td-invoice-description").text(facture.reglement ? facture.reglement.description : "-");

        // Tableau recap des montants
        var $validationFormRecpaTable = $("div#facture-details-modal table.invoice-validation-table");
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
        $("div#facture-details-modal").find("button.btn-print").click(function(e){
            e.preventDefault();
            window.open(
                facture.filename ? URL_GET_FILE.replace("__fileName__", facture.filename) : URL_GLOBAL_IMPRIMER_FACTURE.replace("__id__", facture.id),
                "_blank"
            )
        })
        // Gestion de l'affichage des détails de la facture
        $("div#facture-details-modal").find("button.btn-details").click(function(e){
            e.preventDefault();
            location.href = URL_GLOBAL_DETAILS_FACTURE.replace("__id__", facture.id);
        })
        //Afficher le modal
        $("div#facture-details-modal").modal('show');
    },
};
$(document).ready(function() {
    listeFacture.listInitalizer();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        listeFacture.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        listeFacture.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cette facture ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimée !", "Facture supprimée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    // Delete a record
    datatable.on('click', '.print-item', function(e) {
        e.preventDefault();
        listeFacture.printItem($(this));
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        listeFacture.showItem($(this));
    });
});
document.addEventListener("DOMContentLoaded", function() {
    listeFacture.choicesJsInit();
});