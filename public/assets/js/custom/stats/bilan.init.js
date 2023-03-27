let datatable = [];
let dtSelector = ["fv", "fa", "recap"];
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
let bilan = {
        listInitalizer: function(selector) {
                // $(".datatable").DataTable({ responsive: !1 }),
                datatable[selector] = $("#datatable-" + selector).DataTable({
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
                                    (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide');
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
                                                `<input type="checkbox" class="form-check-input" id="facture${selector}check${data}">` +
                                                `<label class="form-check-label" for="facture${selector}check${data}"></label>` +
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
                                    {
                                        data: 'montantTtc',
                                        render: function(data, type, row, meta) {
                                            return GlobalScript.numberFormat(data, 0)
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
                bilan.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                bilan.saError(notitle, notext);
        });
    },
    showItem: function (el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function (data) {
            // Run this when your request was successful
            console.log(data)
            bilan.setDetailsFactureRecapTable(data);
            $(".show-item-modal").modal('show')

        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage");
        });
    },
    editItem: function (el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function (data) {
            // Run this when your request was successful
            console.log(data)
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
        //console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function (data) {
            // Run this when your request was successful
            console.log(data)
            GlobalScript.showPrintedInvoice(data);
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage de l'interface de modification");
        });
    },
    printBilan: function () {
        var debut = filtreForm.find("input#date-debut").val();
        var fin = filtreForm.find("input#date-fin").val();
        console.log(debut)
        console.log(fin)
        var obj = {"-": "", "T": "_", ":": ""};
        dateDebut = GlobalScript.textMultipleReplace(debut, obj);
        dateFin = GlobalScript.textMultipleReplace(fin, obj);
		reportName = "bilan_du_" + dateDebut + "_au_" + dateFin + ".pdf";
        console.log(reportName);
        //
        GlobalScript.showPrintedBilan(URL_IMPRESSION_BILAN, 'GET', JSON.stringify(statsPayload), reportName);
    },
    reloadDatatable: function (event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setDetailsFactureRecapTable: function (facture) {
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
    getBilanMontant: function (url, tableSelector, typeFacture) {        
        //console.log(id);
        GlobalScript.request(url + "/montant", 'GET', JSON.stringify(statsPayload)).then(function (data) {
            // Run this when your request was successful
            console.log(data)
            // Formatage du tableau de données de bilan des montants
            var arrayData = bilan.setBilanMontantArrayData(data, url, tableSelector, typeFacture)            
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération du bilan des montants");
        });
    },
    setBilanMontantArrayData: function(recapdgi, url, tableSelector, typeFacture){
        // Récupération du typ de la facture, utile en cas de factures d'avoir
		var fa = typeFacture == "fa";
		// Instanciation de la liste InvoiceRecapData
		var recaps = [];
		// Instancition et mise à jour de recaps
		// Pour le groupe exonéré A (0%)
        
		if (recapdgi.taa != 0) {
            var recap = {
                "taxe_group": '',
                "total": 0,
                "imposable": 0,
                "impot": 0,
            };
			recap.taxe_group = "A - Exonéré";
			recap.total = fa ? (recapdgi.taa * (-1)) : recapdgi.taa;
			recap.imposable = 0;
			recap.impot = 0;
			// Ajout à la liste des recaps
			recaps.push(recap);
		}
		// Pour le groupe de taxation B (18%)
		if (recapdgi.tab != 0) {
            var recap = {
                "taxe_group": '',
                "total": 0,
                "imposable": 0,
                "impot": 0,
            };
			recap.taxe_group = "B - Taxable (18%)";
			recap.total = fa ? (recapdgi.tab * (-1)) : recapdgi.tab;
			recap.imposable = fa ? (recapdgi.hab * (-1)) : recapdgi.hab;
			recap.impot = fa ? (recapdgi.vab * (-1)) : recapdgi.vab;
			// Ajout à la liste des recaps
			recaps.push(recap);
		}
		// Pour le groupe C (Exportation de produits taxables) 0%
		if (recapdgi.tac != 0) {
            var recap = {
                "taxe_group": '',
                "total": 0,
                "imposable": 0,
                "impot": 0,
            };
			recap.taxe_group = "C - Exportation";
			recap.total = fa ? (recapdgi.tac * (-1)) : recapdgi.tac;
			recap.imposable = 0;
			recap.impot = 0;
			// Ajout à la liste des recaps
			recaps.push(recap);
		}
		// Pour le groupe de taxation D (18%)
		if (recapdgi.tad != 0) {
            var recap = {
                "taxe_group": '',
                "total": 0,
                "imposable": 0,
                "impot": 0,
            };
			recap.taxe_group = "D - Exception (18%)";
			recap.total = fa ? (recapdgi.tad * (-1)) : recapdgi.tad;
			recap.imposable = fa ? (recapdgi.had * (-1)) : recapdgi.had;
			recap.impot = fa ? (recapdgi.vad * (-1)) : recapdgi.vad;
			// Ajout à la liste des recaps
			recaps.push(recap);
		}
		// Pour le groupe E (Régime fiscal TPS) 0%
		if (recapdgi.tae != 0) {
			var recap = {
                "taxe_group": '',
                "total": 0,
                "imposable": 0,
                "impot": 0,
            };
			recap.taxe_group = "E - TPS";
			recap.total = fa ? (recapdgi.tae * (-1)) : recapdgi.tae;
			recap.imposable = 0;
			recap.impot = 0;
			// Ajout à la liste des recaps
			recaps.push(recap);
		}
		// Pour le groupe F (Réservé) 0%
		if (recapdgi.taf != 0) {
            var recap = {
                "taxe_group": '',
                "total": 0,
                "imposable": 0,
                "impot": 0,
            };
			recap.taxe_group = "F - Réservé";
			recap.total = fa ? (recapdgi.taf * (-1)) : recapdgi.taf;
			recap.imposable = 0;
			recap.impot = 0;
			// Ajout à la liste des recaps
			recaps.push(recap);
		}
		// Pour la taxe spécifique
		if (recapdgi.ts != 0) {
            var recap = {
                "taxe_group": '',
                "total": 0,
                "imposable": 0,
                "impot": 0,
            };
			recap.taxe_group = "TS";
			recap.total = fa ? (recapdgi.ts * (-1)) : recapdgi.ts;
			recap.imposable = 0;
			recap.impot = 0;
			// Ajout à la liste des recaps
			recaps.push(recap);
		}

		// Pour le groupe Aib
		if (recapdgi.aib != 0) {
            var recap = {
                "taxe_group": '',
                "total": 0,
                "imposable": 0,
                "impot": 0,
            };
			recap.taxe_group = "AIB";
			recap.total = fa ? (recapdgi.aib * (-1)) : recapdgi.aib;
			recap.imposable = 0;
			recap.impot = 0;
			// Ajout à la liste des recaps
			recaps.push(recap);
		}
        console.log(recaps);

        // Mis à jour du tableau d'affichage
        bilan.updateBilanMontantTable(recapdgi, recaps, tableSelector, typeFacture, url);
    },
    updateBilanMontantTable: function(recapdgi, arrayData, tableSelector, typeFacture, url){
        var tbodyRef = $(tableSelector).find("tbody");
        var tfootRef = $(tableSelector).find("tfoot");
        var body = ``;
        arrayData.forEach((recap, index) => {
            body += `<tr>
                    <th scope="row">${index + 1}</th>
                    <td>${recap.taxe_group}</td>
                    <td>${GlobalScript.numberFormat(recap.total, 0)}</td>
                    <td>${GlobalScript.numberFormat(recap.imposable, 0)}</td>
                    <td>${GlobalScript.numberFormat(recap.impot, 0)}</td>
                </tr>`
        });
        if(body)
            tbodyRef.html(body);
        else
            tbodyRef.html(
                `<tr class="text-center">
                    <td colspan="5">Aucune donnée disponible dans le tableau</td>
                </tr>`
            );
        tfootRef.html(
            `<tr>
                <td colspan="5" class=""> 
                    <dl class="row mb-0 d-flex justify-content-center">
                        <dt class="col-lg-2 col-sm-3 col-6">Montant Net Total : </dt>
                        <dd class="col-md-3 col-sm-4 col-6">${typeFacture == "fa" ? GlobalScript.numberFormat((recapdgi.total * (-1)), 0) : GlobalScript.numberFormat(recapdgi.total, 0)} FCFA</dd>
                    </dl>                    
                </td>
            </tr>`
        );

        // Mise à jour de la liste des factures
        url_list = url;
        datatable[typeFacture].ajax.reload();
    },
};
$(document).ready(function () {
    // Mise de l'url de liste des facture pour récupérer une liste vide
    url_list = URL_LIST_ITEM + "?search=vide";
    // Initialisation des tableaux de liste de facture avec datatable
    dtSelector.forEach(selector => {
        bilan.listInitalizer(selector);
        
        // Edit record
        datatable[selector].on('click', '.edit-item', function (e) {
            e.preventDefault();
            bilan.editItem($(this));
        });
    
        // Print a record
        datatable[selector].on('click', '.print-item', function (e) {
            e.preventDefault();
            bilan.printItem($(this));
        });
    
        //Show record
        datatable[selector].on('click', '.show-item', function (e) {
            e.preventDefault();
            bilan.showItem($(this));
        });
        //Show Action
        datatable[selector].on('responsive-resize', function (e, datatable, columns) {
            e.preventDefault();
            var count = columns.reduce(function (a, b) {
                return b === false ? a + 1 : a;
            }, 0);
            var position = count ? "relative" : "absolute";
            datatable.on('click', 'button.dropdown-toggle', function (e) {
                e.preventDefault();
                $(".dropdown-menu-end").css("position", position);
            });
            console.log(count + ' column(s) are hidden');
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Initialisation des champs de séléction avec choices.js
    bilan.choicesJsInit();
    
    // Récupération du formulaire du filtre
    filtreForm = $("form.filtre-form");
    // Mise à jour des champs de date du formulaire de filtre
    // filtreForm.find("#date-debut").val(((new Date()).toISOString()).slice(0, 19))
    // filtreForm.find("#date-fin").val(((new Date()).toISOString()).slice(0, 19))
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
            console.log(statsPayload);
            // Réchargement des tableaux de liste des factures
            url_list = URL_LIST_FV_CONFIRMED_DATE;
            bilan.getBilanMontant(url_list, "#bilan-facture-vente", "fv")
            url_list = URL_LIST_FA_CONFIRMED_DATE;
            bilan.getBilanMontant(url_list, "#bilan-facture-avoir", "fa")
            url_list = URL_LIST_RECAP_CONFIRMED_DATE;
            bilan.getBilanMontant(url_list, "#bilan-recapitulatif", "recap")            
            return;
        }
    });
    filtreForm.on("click", "button.print-bilan", function(event){
        event.preventDefault();
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
            console.log(statsPayload);
            // Lancement de l'impression du rapport du bilant
            bilan.printBilan();
            return;
        }
    })
});