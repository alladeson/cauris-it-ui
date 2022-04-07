let datatable;
let choices = [];
let startedMonth = null;
let gestionPaie = {
        listInitalizer: function() {
            // $(".datatable").DataTable({ responsive: !1 }),
            datatable = $(".datatable").DataTable({
                    "language": {
                        //"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                        "url": "/assets/i18n/French.json"
                    }
                }),
                $(".dataTables_length select").addClass("form-select form-select-sm");
        },
        listInitalizer2: function() {
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
                                        "url": URL_LIST_ITEM.replace('__moisId__', startedMonth ? startedMonth.id : 0),
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
                                                `<input type="checkbox" class="form-check-input" id="paiecheck${data}">` +
                                                `<label class="form-check-label" for="paiecheck${data}"></label>` +
                                                `</div>`;
                                        }
                                    },
                                    {
                                        "data": "mois.libelle",
                                        "render": function(data, type, row, meta) {
                                            return GlobalScript.monthDateFormat(data);
                                        }
                                    },
                                    {
                                        data: 'personnel.nom',
                                        "render": function(data, type, row, meta) {
                                            return `<a href="javascript:void(0);" class="text-body">${row.personnel.nom + ' ' + row.personnel.prenom}</a>`;
                                        }
                                    },
                                    { "data": "personnel.statut" },
                                    {
                                        "data": "tauxHoraire",
                                        "render": function(data, type, row, meta) {
                                            if (row.personnel.statut == "Permanent")
                                                return `` +
                                                    `<div class="d-flex gap-2">` +
                                                    `<a href="javascript:void(0);" class="badge badge-soft-warning font-size-11">Néant</a>` +
                                                    `</div>`;
                                            else
                                                return `` +
                                                    `<div class="d-flex gap-2">` +
                                                    `<a href="javascript:void(0);" class="badge badge-soft-primary font-size-11">${data?data:0}</a>` +
                                                    `</div>`;
                                        }
                                    },
                                    {
                                        "data": "nombreHeure",
                                        "render": function(data, type, row, meta) {
                                            if (row.personnel.statut == "Permanent")
                                                return `` +
                                                    `<div class="d-flex gap-2">` +
                                                    `<a href="javascript:void(0);" class="badge badge-soft-warning font-size-11">Néant</a>` +
                                                    `</div>`;
                                            else
                                                return `` +
                                                    `<div class="d-flex gap-2">` +
                                                    `<a href="javascript:void(0);" class="badge badge-soft-primary font-size-11">${data?data:0}</a>` +
                                                    `</div>`;
                                        }
                                    },
                                    {
                                        "data": "montant",
                                        "render": function(data, type, row, meta) {
                                            return data ? data : 0;
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
                                                    `${startedMonth.statut == "Demarrer" ? ( 
                                                    `${row.personnel.statut == "Vacataire" ? (
                                                    `<li>
                                                        <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier</a>
                                                    </li>`) : ``}` +
                                                `<li>
                                                    <a class="dropdown-item remove-item" href="javascript:void(0);" data-item-id="${data}">Supprimer</a>
                                                </li>`): ``}` + 
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
    saSucces1: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        }).then(function(e) {
            e.value ? location.reload(true) : '';
        });
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
                gestionPaie.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                gestionPaie.saError(notitle, notext);
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
                gestionPaie.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                gestionPaie.saError(notitle, notext);
        });
    },
    // Pour la mise à jour d'une paie pour un personnel
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = gestionPaie.dataFormat(form)
        var personnelId = form.find("#personnel").data("id");
        console.log(data)
        gestionPaie.request((data.id ? ((URL_PUT_ITEM.replace("__id__", data.id)).replace("__moisId__", startedMonth ? startedMonth.id : 0)).replace("__personnelId__", personnelId) : (URL_POST_ITEM.replace("__moisId__", startedMonth ? startedMonth.id : 0)).replace("__personnelId__", personnelId)), (data.id ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            datatable.ajax.reload();
            gestionPaie.saSucces("Succès !", "Enregistrement effectué avec succès.")
            $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            var error = JSON.parse(err.responseText)
            gestionPaie.saError("Erreur !", `Une erreur s'est produite lors de l'enregistrement : ${error.message}`)
        });
    },
    // Pour la mise à jour de la liste des paie
    submitUpateFormData: function(event) {
        event.preventDefault();
        var form = $("div.update-new-modal").find('form');
        var data = form.serialize()
        console.log(data)
        gestionPaie.request(URL_UPDATE_LIST_PAIE.replace("__moisId__", startedMonth ? startedMonth.id : 0), 'PUT', data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            datatable.ajax.reload();
            gestionPaie.saSucces("Succès !", "Mise à jour effectuée avec succès.")
            $("div.update-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            var error = JSON.parse(err.responseText)
            gestionPaie.saError("Erreur !", `Une erreur s'est produite lors de la mise à jour : ${error.message}`)
        });
    },
    // Pour le démarrage du mois
    submitStartForm: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = gestionPaie.dataFormatMois(form)
        console.log(data)
        gestionPaie.request(URL_START_MONTH, 'POST', data).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
                //datatable.ajax.reload();
            gestionPaie.saSucces1("Succès !", "Démarrage effectué avec succès. La page va être rafraichir...")
            $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            var error = JSON.parse(err.responseText)
            gestionPaie.saError("Erreur !", `Une erreur s'est produite lors du démarrage : ${error.message}`)
        });
    },
    // Pour la clôture du mois
    submitStopFormData: function(event) {
        event.preventDefault();
        gestionPaie.request(URL_STOP_PAIE_MONTH.replace("__moisId__", startedMonth?startedMonth.id : 0), 'PUT', data).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
                //datatable.ajax.reload();
            gestionPaie.saSucces1("Succès !", "Clôture effectuée avec succès. La page va être rafraichir...")
            $("div.stop-new-modal").modal('hide')
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            var error = JSON.parse(err.responseText);
            gestionPaie.saError("Erreur !", `Une erreur s'est produite lors de la clôture du mois : ${error.message}`)
        });
    },
    // Pour gérer dynamiquement le montant en fonction du taux horaires et du nombre d'heure effectué
    setformDataOnChange: function() {
        var form = $("div.add-new-modal").find('form');
        // alert(form.find("#nombreHeure").val())
        form.find("#montant").val(form.find("#tauxHoraire").val() * form.find("#nombreHeure").val())
    },
    dataFormatMois: function(form) {
        if (form.length) {
            return {
                "libelle": form.find("#mois").val(),
            };
        }
        return null;
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        gestionPaie.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            gestionPaie.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            var error = JSON.parse(err.responseText)
            gestionPaie.saError("Erreur !", `Une erreur s'est produite lors de l'affichage : ${error.message}`)
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        //var response = gestionPaie.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        gestionPaie.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            var itemObj = JSON.parse(data);
            var form = $("div.add-new-modal").find('form');
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            gestionPaie.setformData(form, itemObj);
            if (itemObj.personnel.statut == "Permanent")
                form.find("div.vacataire").hide();
            else if (itemObj.personnel.statut == "Vacataire")
                form.find("div.vacataire").show();
            $(".add-new-modal").modal('show');
            //gestionPaie.getPostePersonnels(itemObj.poste.id);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            var error = JSON.parse(err.responseText)
            gestionPaie.saError("Erreur !", `Une erreur s'est produite lors de la modification : ${error.message}`)
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // console.log(id);
        gestionPaie.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            console.log(JSON.parse(data))
            gestionPaie.saSucces(oktitle, oktext);
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            var error = JSON.parse(err.responseText)
            gestionPaie.saError("Erreur !", `Une erreur s'est produite lors de la suppression : ${error.message}`)
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
    setformData: function(form, item) {
        if (form.length) {
            form.find("#item-id").val(item.id)
            form.find("#mois").val(item.mois.libelle)
            form.find("#personnel").val(item.personnel.identite)
            form.find("#personnel").attr("data-id", item.personnel.id)
            form.find("#tauxHoraire").val(item.tauxHoraire)
            form.find("#nombreHeure").val(item.nombreHeure)
            form.find("#montant").val(item.montant)
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            return {
                'id': form.find("#item-id").val(),
                "tauxHoraire": form.find("#tauxHoraire").val(),
                "nombreHeure": form.find("#nombreHeure").val(),
                "montant": form.find("#montant").val(),
            };
        }
        return null;
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-mois').text(itemObj.mois.libelle);
        $showClasseTable.find('.td-personnel').text(itemObj.personnel.identite);
        $showClasseTable.find('.td-statut').find('a').text(itemObj.personnel.statut);
        $showClasseTable.find('.td-montant').text(itemObj.montant ? itemObj.montant : 0);
        if(itemObj.personnel.statut == "Vacataire"){
            $showClasseTable.find('.td-tauxHoraire').text(itemObj.tauxHoraire ? itemObj.tauxHoraire : 0);
            $showClasseTable.find('.td-nombreHeure').text(itemObj.nombreHeure ? itemObj.nombreHeure : 0);
            $showClasseTable.find('.tr-vacataire').show();
        }else if(itemObj.personnel.statut == "Permanent"){
            $showClasseTable.find('.tr-vacataire').hide();
        }
    },
    getStartedMonth: function() {
        gestionPaie.request(URL_STARTED_PAIE_MONTH, 'GET', null).then(function(data) {
            // Run this when your request was successful
            startedMonth = JSON.parse(data);
            console.log(startedMonth)
            gestionPaie.listInitalizer2();
            // Edit record
            datatable.on('click', '.edit-item', function(e) {
                e.preventDefault();
                gestionPaie.editItem($(this));
            });

            // Delete a record
            datatable.on('click', '.remove-item', function(e) {
                e.preventDefault();
                // gestionPaie.removeItem($(this));
                gestionPaie.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cette paie ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimée !", "Paie supprimée avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
            });

            //Show record
            datatable.on('click', '.show-item', function(e) {
                e.preventDefault();
                gestionPaie.showItem($(this));
            });
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
        });
    },
    filterReloadData: function(event){
        event.preventDefault();
        var form = $("div.filter-form-wrapper").find('form');
        var libelleMois = form.find("#filter-month").val();
        // Récupération du mois servant du filtre en fonction de son libelle
        gestionPaie.request(URL_GET_MONTH_BY_LIBELLE.replace("__libelle__", libelleMois), 'GET', null).then(function(data) {
            // Run this when your request was successful
            startedMonth = JSON.parse(data);
            console.log(startedMonth)
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            var error = JSON.parse(err.responseText)
            gestionPaie.saError("Erreur !", `Une erreur s'est produite lors de la recherche : ${error.message}`)
        });
    },
};
$(document).ready(function() {
    if (!URL_START_MONTH) {
        gestionPaie.getStartedMonth();
    } else {
        gestionPaie.listInitalizer();
    }
});