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
                    {
                        data: 'createdAt',
                        "render": function(data, type, row, meta) {
                            return GlobalScript.dateFormat(data);
                        }
                    },
                    { data: 'client.identite' },
                    { data: 'montantTtc' },
                    {
                        data: 'valid',
                        "render": function(data, type, row, meta) {
                            if (data)
                                return `<span class="text-success">Traitée</span>`;
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
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            listeFacture.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            listeFacture.saError("Erreur !", "Une erreur s'est produite lors de l'affichage.")
        });
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-date').text(GlobalScript.dateFormat(itemObj.createdAt));
        $showClasseTable.find('.td-client').text(itemObj.client.identite);
        $showClasseTable.find('.td-montantHt').text(itemObj.montantHt);
        $showClasseTable.find('.td-montantTva').text(itemObj.montantTva);
        $showClasseTable.find('.td-montantTtc').text(itemObj.montantTtc);
        let html = ``;
        if (itemObj.valid)
            html = `<span class="text-success">Validée</span>`;
        else
            html = `<span class="text-warning">En attente</span>`;
        $showClasseTable.find('.td-statut').html(html);
        let url = $('div.show-item-modal').find('a.detail_link').data("uri");
        $('div.show-item-modal').find('a.detail_link').attr("href", url + "/" + itemObj.id);

    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
};
$(document).ready(function() {
    listeFacture.listInitalizer();
    // Edit record
    // datatable.on('click', '.edit-item', function(e) {
    //     e.preventDefault();
    //     listeFacture.editItem($(this));
    // });

    // Delete a record
    // datatable.on('click', '.remove-item', function(e) {
    //     e.preventDefault();
    //     listeFacture.removeItem($(this));
    // });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        listeFacture.showItem($(this));
    });
});
document.addEventListener("DOMContentLoaded", function() {
    listeFacture.choicesJsInit();
});