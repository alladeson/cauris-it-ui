let datatable;
let choices = [];
let objet;
let auditPayload = {
    "debut": null,
    "fin": null,
    "desc": null,
    "userId": null,
};
let filtreForm = null;
let url_list = null;
let audit = {
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
                            "data": JSON.stringify(auditPayload),
                        };
                    },
                    "dataSrc": "",
                    error: function(xhr, status, error) {
                        (waitMe_zone.length ? waitMe_zone : $('body')).waitMe('hide')
                        GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des audits");
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
                                `<input type="checkbox" class="form-check-input" id="auditcheck${data}">` +
                                `<label class="form-check-label" for="auditcheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { data: 'id' },
                    { data: 'user.fullname' },
                    { data: 'user.group.name' },
                    { data: 'description' },
                    {
                        data: 'dateHeure',
                        "render": function(data, type, row, meta) {
                            return GlobalScript.dateFormat(data)
                        }
                    },
                    {
                        data: 'valeurAvant',
                        render: function(data, type, row, meta) {
                            return data ? JSON.parse(data) : "-";
                        }
                    },
                    {
                        data: 'valeurApres',
                        render: function(data, type, row, meta) {
                            return data ? JSON.parse(data) : "-";
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
                searchEnabled: $.inArray(i, [0]) > -1 ? false : true,
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
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //// console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__auditId__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
            audit.setDetailsFactureRecapTable(data);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage");
        });
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setDetailsFactureRecapTable: function(audit) {
        // Tableau de la valeur avant
        var $auditValeurAvantTable = $("div#audit-details-modal table.audit-valeur-avant-table");
        $auditValeurAvantTable.find("#valeur-avant").jsonViewer(audit.valeurAvant != "null" ? JSON.parse(audit.valeurAvant) : {});

        // Tableau de la valeur après
        var $auditValeurApresTable = $("div#audit-details-modal table.audit-valeur-apres-table");
        $auditValeurApresTable.find("#valeur-apres").jsonViewer(audit.valeurApres != "null" ? JSON.parse(audit.valeurApres) : {});

        //Afficher le modal
        $("div#audit-details-modal").modal('show');
    },
};
$(document).ready(function() {
    // Mise de l'url de liste des facture pour récupérer une liste vide
    url_list = URL_LIST_ITEM + "?search=vide";
    // Initialisation du table de liste de facture avec datatable
    audit.listInitalizer();

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        audit.showItem($(this));
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
document.addEventListener("DOMContentLoaded", function() {
    // Initialisation des champs de séléction avec choices.js
    audit.choicesJsInit();
    // Récupératon des utilisateurs
    GlobalScript.getForeignsData(
        URL_LIST_USER, ["utilisateurs", "id", "fullname"],
        0,
        null
    );
    // Récupération du formulaire du filtre
    filtreForm = $("form.filtre-form");
    // Gestion des évènements liées au filtre de la liste des factures
    // Si "Toutes" est coché, alors décocher les boutons radios de date
    filtreForm.find("input#getAll").change(function(event) {
            event.preventDefault();
            if (filtreForm.find("input#getAll").is(":checked")) {
                filtreForm.find("input[name='dateRadios']:checked").prop("checked", false);
            }
        })
        // Si une des boutons radios de date est cochée, alors décocher "Toutes"
    filtreForm.find("input[name='dateRadios']").change(function(event) {
            event.preventDefault();
            filtreForm.find("input#getAll").prop("checked", false);
        })
        // Lors de la soumission du formulaire de filtre, c'est-à-dire en cliquant sur le bouton de recherche
    filtreForm.submit(function(event) {
        event.preventDefault();
        // Mise à jour de l'url de liste
        url_list = URL_LIST_ITEM;
        // Récupération du type de la facture sélectionné
        var userId = filtreForm.find("select#user").val();
        // Si "Toutes" est coché, on récupère toutes les facture, ou en fonction du type de facture
        if (filtreForm.find("input#getAll").is(":checked")) {
            // alertify.success("'Toutes' coché");
            auditPayload.debut = null;
            auditPayload.fin = null;
            auditPayload.desc = GlobalScript.checkBlank(filtreForm.find("#operation").val());
            auditPayload.userId = GlobalScript.checkBlank(filtreForm.find("#user").val());
            // console.log(auditPayload);
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
            var typeDate = filtreForm.find("input[name='dateRadios']:checked").val();
            // Récupération des dates de début et de fin
            var debut = new Date(filtreForm.find("input#date-debut").val());
            var fin = new Date(filtreForm.find("input#date-fin").val());
            // Comparaison des dates, la date de fin doit être supérieure à la date de début
            if (fin.getTime() <= debut.getTime()) {
                alertify.error("La date de fin doit être supérieure à la date de début");
                return;
            }
            // Ici les dates sont renseignées et valides
            // Récupération de la liste en fonction de la date d'enregistrement qui est une date de type LocalDateTime,
            // pas besoin de la transformer, on peut utiliser directement la valeur des champ
            else if (typeDate == "createdAt") {
                // auditPayload.debut = filtreForm.find("input#date-debut").val();
                // auditPayload.fin = filtreForm.find("input#date-fin").val();
                auditPayload.debut = (debut.toISOString()).slice(0, 19);
                auditPayload.fin = (fin.toISOString()).slice(0, 19);
                auditPayload.desc = GlobalScript.checkBlank(filtreForm.find("#operation").val());
                auditPayload.userId = GlobalScript.checkBlank(filtreForm.find("#user").val());
                // console.log(auditPayload);
                // Réchargement du tableau de liste de la facture
                datatable.ajax.reload();
                return;
            }
        }
        // Si aucun critère n'est choisi, alors un avertissement est renvoyé
        alertify.warning("Veuillez choisir un critère pour le filtre svp. Merci !");
    })

});