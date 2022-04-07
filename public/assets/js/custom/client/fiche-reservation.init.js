let datatable;
let choices = [];
let ficheReservation = {
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
                                                `<input type="checkbox" class="form-check-input" id="ficheReservationcheck${data}">` +
                                                `<label class="form-check-label" for="ficheReservationcheck${data}"></label>` +
                                                `</div>`;
                                        }
                                    },
                                    { data: 'id' },
                                    { data: 'client.identite' },
                                    {
                                        data: 'reservation.id',
                                        "render": function(data, type, row, meta) {
                                            return `` +
                                                `<div class="d-flex gap-2">
                            <a href="javascript:void(0);" class="badge badge-soft-primary show-reservation">${data}</a>
						    </div>`;
                                        }
                                    },
                                    {
                                        data: 'facture.id',
                                        "render": function(data, type, row, meta) {
                                            return `` +
                                                `<div class="d-flex gap-2">
                            <a href="javascript:void(0);" class="badge badge-soft-primary show-facture">${data}</a>
						    </div>`;
                                        }
                                    },
                                    {
                                        data: 'status',
                                        "render": function(data, type, row, meta) {
                                            if (data)
                                                return `<span class="text-success">Validée</span>`;
                                            else if (row.checkout)
                                                return `<span class="text-success">Confirmée</span>`;
                                            else
                                                return `<span class="text-warning">En attente de confirmation</span>`;
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
                                                    `${!row.checkout ? (
                                                `<li>
                                                    <a class="dropdown-item checkout-item" href="javascript:void(0);" data-item-id="${data}">Confirmer</a>
                                                </li>` ) : ''}` +
                                                `${!row.status ? (
                                                `<li>
                                                    <a class="dropdown-item validate-item" href="javascript:void(0);" data-item-id="${data}">Valider</a>
                                                </li>` ) : ''}` +
                                            `</ul>
                                        </div>`;
                            return html;
                        }
                    }
                ],
            }),
            $(".dataTables_length select").addClass("form-select form-select-sm");
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
                ficheReservation.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                ficheReservation.saError(notitle, notext);
        });
    },
    saParamsCheckout: function(el, title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
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
                ficheReservation.checkoutItem(el) :
                e.dismiss === Swal.DismissReason.cancel &&
                ficheReservation.saError(notitle, notext);
        });
    },
    saParamsValidate: function(el, title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
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
                ficheReservation.validateItem(el) :
                e.dismiss === Swal.DismissReason.cancel &&
                ficheReservation.saError(notitle, notext);
        });
    },
    request: function(url, method, sendData) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: URL_GLOBAL_REQUEST,
                method: "POST",
                data: {
                    "url": url,
                    "method": method,
                    "data": sendData,
                },
                success: function(data) {
                    resolve(data) // Resolve promise and go to then()
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                },
            });
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        ficheReservation.request(URL_GET_ITEM.replace("__ficheId__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            ficheReservation.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            ficheReservation.saError("Erreur !", "Une erreur s'est produite lors de l'affichage.")
        });
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-client').text(itemObj.client.identite);
        $showClasseTable.find('.td-reservationRef').text(itemObj.reservation.id);
        $showClasseTable.find('.td-factureRef').text(itemObj.facture.id);
        let html = ``;
        
        if (itemObj.checkout)
            html = `<span class="text-success">Confirmée</span>`;
        else
            html = `<span class="text-warning">En attente de confirmation</span>`;
        $showClasseTable.find('.td-confirmation').html(html);

        if (itemObj.status)
            html = `<span class="text-success">Validée</span>`;
        else
            html = `<span class="text-warning">En attente de validation</span>`;
        $showClasseTable.find('.td-validation').html(html);
    },
    showReservation: function() {
        //console.log('show item')
        $(".show-item-modal").modal('show')
    },
    checkoutItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        ficheReservation.request(URL_CONFIRMATION_ITEM.replace("__ficheId__", id), 'PUT', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            // var itemObj = JSON.parse(data);
            datatable.ajax.reload();
            ficheReservation.saSucces("Succès !", "Confirmation effectuée avec succès.")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            ficheReservation.saError("Erreur !", "Une erreur s'est produite lors de la confirmation.")
        });
    },
    validateItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        ficheReservation.request(URL_VALIDATION_ITEM.replace("__ficheId__", id), 'PUT', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            // var itemObj = JSON.parse(data);
            datatable.ajax.reload();
            ficheReservation.saSucces("Succès !", "Validation effectuée avec succès.")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            ficheReservation.saError("Erreur !", "Une erreur s'est produite lors de la validation.")
        });
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
};
$(document).ready(function() {
    ficheReservation.listInitalizer();
    // Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        ficheReservation.showItem($(this));
    });

    // checkout a record
    datatable.on('click', '.checkout-item', function(e) {
        e.preventDefault();
        // ficheReservation.checkoutItem($(this));
        ficheReservation.saParamsCheckout($(this), "Êtes-vous sûr de vouloir confirmer cette réservation ?", "Cette opération est irréversible !", "Oui, confirmer !", "Non, annuller !", "Confirmée !", "Réservation confirmée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //validate record
    datatable.on('click', '.validate-item', function(e) {
        e.preventDefault();
        // ficheReservation.validateItem($(this));
        ficheReservation.saParamsValidate($(this), "Êtes-vous sûr de vouloir valider cette réservation ?", "Cette opération est irréversible !", "Oui, valider !", "Non, annuller !", "Validée !", "Réservation validée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });
    //Show ficheReservation record
    datatable.on('click', '.show-reservation', function(e) {
        e.preventDefault();
        // ficheReservation.showReservation($(this));
    });
    //Show facture record
    datatable.on('click', '.show-facture', function(e) {
        e.preventDefault();
       // ficheReservation.showReservation($(this));
    });
});