let datatable;
let choices = [];
let listDemandes = {
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
                                    GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des catégories d'article");
                                    $(".datatable").find('tbody td').html('<span class="text-danger">Echec de chargement</span>');
                                }
                            },
                            // "ajax": "/assets/js/custom/data/categorie-article.txt",
                            columns: [{
                                        data: 'id',
                                        "class": "",
                                        "orderable": false,
                                        "searchable": false,
                                        "render": function(data, type, row, meta) {
                                            return `` +
                                                `<div class="form-check font-size-16">` +
                                                `<input type="checkbox" class="form-check-input" id="listDemandescheck${data}">` +
                                                `<label class="form-check-label" for="listDemandescheck${data}"></label>` +
                                                `</div>`;
                                        }
                                    },
                                    { data: 'id' },
                                    {
                                        data: 'serialKey',
                                        render: function(data, type, row, meta) {
                                            var html = `
                                                <div>
                                                    <button type="button" class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light item-file" data-item-id="${row.id}" data-icon-type="plus-circle" data-type="serialKey"><i class="bx bx-plus-circle label-icon"></i>Clé</button>
                                                </div>
                                            `
                                            return data ? (data.serialKey.slice(0, 10) + "...") : html;
                                        }
                                    },
                                    {
                                        data: 'formulaire',
                                        render: function(data, type, row, meta) {
                                            var html = `
                                                <div>
                                                    <button type="button" class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light item-file" data-item-id="${row.id}" data-icon-type="${data ? 'show' : 'upload'}" data-type="formulaire" data-filename="${data ? data : ''}"><i class="bx bx-${data ? 'show' : 'upload'} label-icon"></i> Pdf</button>
                                                </div>
                                            `
                                            return html;
                                        }
                                    },
                                    {
                                        data: 'formulaireDgi',
                                        render: function(data, type, row, meta) {
                                            var html = `
                                                <div>
                                                    <button type="button" class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light item-file" data-item-id="${row.id}" data-icon-type="${data ? 'show' : 'upload'}" data-type="formulaireDgi" data-filename="${data ? data : ''}"><i class="bx bx-${data ? 'show' : 'upload'} label-icon"></i> Pdf</button>
                                                </div>
                                            `
                                            return html;
                                        }
                                    },
                                    {
                                        data: 'configReport',
                                        render: function(data, type, row, meta) {
                                            var html = `
                                                <div>
                                                    <button type="button" class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light item-file" data-item-id="${row.id}" data-icon-type="${data ? 'show' : 'upload'}" data-type="configReport" data-filename="${data ? data : ''}"><i class="bx bx-${data ? 'show' : 'upload'} label-icon"></i> Pdf</button>
                                                </div>
                                            `
                                            return html;
                                        }
                                    },
                                    {
                                        data: 'treated',
                                        render: function(data, type, row, meta) {
                                            var html = `
                                                <div class="badge badge-soft-${data ? 'success' : 'warning'} font-size-12">${data ? 'Traitée' : 'En attente'}</div>
                                            `
                                            return html;
                                        }
                                    },
                                    {
                                        data: 'valid',
                                        render: function(data, type, row, meta) {
                                            var html = `
                                                <div class="badge badge-soft-${data ? 'success' : 'warning'} font-size-12">${data ? 'Validée' : 'En attente'}</div>
                                            `
                                            return html;
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
                                                    ${ITEM_WRITABLE && !row.treated && row.formulaire ? 
                                                    `<li>
                                                        <a class="dropdown-item status-item" href="javascript:void(0);" data-item-id="${data}" data-status-name="treated">Traiter</a>
                                                    </li>` : "" }
                                                    ${ITEM_WRITABLE && row.treated && !row.valid && row.formulaireDgi && row.configReport ? 
                                                    `<li>
                                                        <a class="dropdown-item status-item" href="javascript:void(0);" data-item-id="${data}" data-status-name="valid">Valider</a>
                                                    </li>` : "" }
                                                    ${ITEM_DELETABLE && !row.treated && !row.valid? 
                                                    `<li>
                                                        <a class="dropdown-item remove-item" href="javascript:void(0);" data-item-id="${data}">Supprimer</a>
                                                    </li>` : "" }
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
                searchEnabled: true,
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
                listDemandes.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                listDemandes.saError(notitle, notext);
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
                listDemandes.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                listDemandes.saError(notitle, notext);
        });
    },
    saUpdateStatus: function(el, title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
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
                listDemandes.updateDemandeStatus(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                listDemandes.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = listDemandes.dataFormat(form)
        let dataId = form.find("#item-id").val();
        if(GlobalScript.traceFormChange(dataId)) return;
        console.log(data)
        GlobalScript.request((dataId ? URL_PUT_ITEM.replace("__id__", dataId) : URL_POST_ITEM), (dataId ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            datatable.ajax.reload();
            // listDemandes.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
            $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    submitSerialKeyData: function(event) {
        event.preventDefault();
        var form = $("div.add-serialKey-modal").find('form');
        // Récupération de la clé d'action
        var serialKeyId = form.find("select#serialKey").val();
        if(!serialKeyId)
            alertify.warning("Veuillez sélectionner une clé svp !");
        // Récupération de l'id de la demande
        let dataId = form.find("#item-id").val();
        // Vérification de la modification du formulaire
        if(GlobalScript.traceFormChange(dataId)) return;
        //Formatage de l'url de mise à jour de la clé d'activation
        var obj = {'__id__': dataId, '__serialKeyId__': serialKeyId}
        var url = GlobalScript.textMultipleReplace(URL_PUT_DEMANDES_SERIAL_KEY, obj);
        // Envoie de la requête
        GlobalScript.request(url, "PUT", null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            datatable.ajax.reload();
            alertify.success("Enregistrement effectué avec succès")
            $("div.add-serialKey-modal").modal('toggle')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    submitFilesData: function(event) {
        event.preventDefault();
        var form = $("div.add-files-modal").find("form");
        let formData = new FormData();
        let file = form.find("input#file")[0].files[0];
        // Récupération du non du fichier
        var fileName = form.find("input#filename").val();
        // Récupération de l'id de la demande
        let dataId = form.find("#item-id").val();
        // Vérification de la modification du formulaire
        if(GlobalScript.traceFormChange(dataId)) return;
        // Formatage du data
        formData.append("file", file);
        formData.append("fileName", fileName);
        formData.append("method", "PUT");
        //Formatage de l'url de mise à jour de la clé d'activation
        var obj = {'__id__': dataId, '__fileName__': fileName + ".pdf"}
        var url = GlobalScript.textMultipleReplace(URL_PUT_DEMANDES_FILES, obj);
        // Envoie de la requête
        formData.append("url", url);
        GlobalScript.requestFile(formData).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            datatable.ajax.reload();
            $("div.add-files-modal").modal("toggle");
            listDemandes.saSucces("Succès !", "Enregistrement effectué avec succès.")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            var itemObj = data;
            listDemandes.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')            
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage");
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        var id = el.data("item-id");
        var dataType = el.data("type");
        //console.log(id);
        //var response = GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            var $modal;
            if(dataType == "serialKey"){
                $modal = $("div.add-serialKey-modal");
                $modal.find('h5.modal-title').text(data.serialKey ? "Modification de la clé d'activation" : "Ajout de la clé d'activation");            
                // Récupératon des clés d'activation
                GlobalScript.getForeignsData(
                    URL_LIST_SERIAL_KEYS_DEMANDE,
                    ["clés d'activation", "id", "serialKey"],
                    0,
                    data.serialKey ? data.id : null,
                );
            }else{
                $modal = $("div.add-files-modal");
                var fileName = dataType;
                var title = fileName == "formulaire" ? "formulaire de la demande" : fileName=="formulaireDgi" ? "récapitulatif DGI" : "rapport de configuration";
                var label = fileName == "formulaire" ? "Formulaire de la demande" : fileName=="formulaireDgi" ? "Récapitulatif DGI" : "Rapport de configuration";
                $modal.find('h5.modal-title').text("Mise à jour de fichier de " + title);            
                $modal.find('form').find("label.file-label").text(label);
                $modal.find('form').find("input#filename").val("demande_" + data.id +"_" + fileName);
            }
            $modal.find('form').find("input#item-id").val(data.id);
            $modal.modal('toggle');    
            GlobalScript.formChange($modal.find('form'));
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la modification");
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // console.log(id);
        GlobalScript.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
                // listDemandes.saSucces(oktitle, oktext);
            alertify.success(oktext)
            datatable.ajax.reload();
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la suppression");
        });
    },
    setformData: function(form, item) {
        if (form.length) {
            form.find("#item-id").val(item.id)
                //form.find("#reference").val(item.id)
            form.find("#libelle").val(item.libelle)
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            data = {
                'id': GlobalScript.checkBlank(form.find("#item-id").val()),
                'libelle': GlobalScript.checkBlank(form.find("#libelle").val()),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    newItemEvent: function(event) {
        event.preventDefault();
        $("div.add-new-modal").find('h5.modal-title').text('Nouvel ajout');
        var form = $("div.add-new-modal").find('form');
        form[0].reset();
        form.find("#item-id").val("");
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        //
        var html = `<div class="badge badge-soft-warning font-size-12">Non fourni(e)</div>`;

        $showClasseTable.find('.td-reference').html(itemObj.id);
        $showClasseTable.find('.td-serial-key').html(itemObj.serialKey ? itemObj.serialKey.serialKey : html);
        //
        var htmlpdf = `
            <div>
                <button type="button" class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light item-file" data-item-id="${itemObj.id}" data-type="formulaire" data-filename="${itemObj.formulaire}"><i class="bx bx-show label-icon"></i>Pdf</button>
            </div>
        `;
        $showClasseTable.find('.td-formulaire').html(itemObj.formulaire ? htmlpdf : html);
        //
        htmlpdf = `
            <div>
                <button type="button" class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light item-file" data-item-id="${itemObj.id}" data-type="formulaireDgi" data-filename="${itemObj.formulaireDgi}"><i class="bx bx-show label-icon"></i>Pdf</button>
            </div>
        `;
        $showClasseTable.find('.td-formulaire-dgi').html(itemObj.formulaireDgi ? htmlpdf : html);
        //
        htmlpdf = `
            <div>
                <button type="button" class="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light item-file" data-item-id="${itemObj.id}" data-type="configReport" data-filename="${itemObj.configReport}"><i class="bx bx-show label-icon"></i>Pdf</button>
            </div>
        `;
        $showClasseTable.find('.td-config-report').html(itemObj.configReport ? htmlpdf : html);

        // Gestion de l'affichage des fichiers
        $showClasseTable.on('click', '.item-file', function(e) {
            e.preventDefault();
            listDemandes.showDemandeFiles($(this))
        });
    },
    showDemandeFiles: function(el){
        var fileName = el.data("filename");
        var dataType = el.data("type");
        var dowloadPdfUrl = uploadPdfBaseUrl + fileName;
        // Mise à jour du titre du modal d'affichage
        var modalTitle = dataType == "formulaire" ? "Formulaire de la demande" : dataType=="formulaireDgi" ? "Récapitulatif DGI" : "Rapport de configuration";
        $pdfWebviwerModal.find('h5.card-title').text(modalTitle);
        GlobalScript.pdfwebviewer(dowloadPdfUrl, dowloadPdfUrl, fileName)
    },   
    updateDemandeStatus: function(el, oktitle, oktext){
        var dataId = el.data("itemId");
        var statusName = el.data("statusName");
        //Formatage de l'url de mise à jour du status
        var obj = {'__id__': dataId, '__statusName__': statusName}
        var url = GlobalScript.textMultipleReplace(URL_PUT_DEMANDES_STATUS, obj);
        // Envoie de la requête
        GlobalScript.request(url, "PUT", null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            datatable.ajax.reload();
            alertify.success(oktext);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            var message = el.data("statusName") == "treated" ? "du traitement de la demande" : "la validation de la demande";
            GlobalScript.ajxRqtErrHandler(err, "sweet", message);
        });
    },   
};
$(document).ready(function() {
    listDemandes.listInitalizer();
    listDemandes.choicesJsInit();
    // Edit record
    // datatable.on('click', '.edit-item', function(e) {
    //     e.preventDefault();
    //     formChange = false;
    //     listDemandes.editItem($(this));
    // });
    datatable.on('click', '.item-file', function(e) {
        e.preventDefault();
        formChange = false;
        if($(this).data("iconType") == "show")
            listDemandes.showDemandeFiles($(this))
        else
            listDemandes.editItem($(this));
    });

    datatable.on('click', '.status-item', function(e) {
        e.preventDefault();
        var title = $(this).data("statusName") == "treated" ? "traiter" : "valider";
        var title2 = $(this).data("statusName") == "treated" ? "traitée" : "validée";
        listDemandes.saUpdateStatus($(this), "Êtes-vous sûr de vouloir "+ title + " cette demande ?", "Cette opération est irréversible !", "Oui, "+ title + " !", "Non, annuler !", title2 + " !", "Demande "+ title2 + " avec succès.", "annulée !", "Opération annulée, rien n'a changé.");
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // listDemandes.removeItem($(this));
        listDemandes.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cette demande ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuler !", "Supprimée !", "Demande supprimée avec succès.", "annulée !", "Opération annulée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        listDemandes.showItem($(this));
    });

    // Gestion de l'autocompletion
    // $("div.add-serialKey-modal").find("form #serialKey").autocomplete({
    //     source: function(request, response) {
    //         var term = Inputmask.unmask(request.term);
    //         console.log("search : " + term)
    //         waitMe_zone = null
    //         return GlobalScript.request(URL_GET_SERIAL_KEYS_AUTOCOMPLETE + "?search=" + term, 'GET', null).then(function(data) {
    //             // Run this when your request was successful
    //             console.log(data);
    //             response(data);
    //             waitMe_zone = ""
    //         }).catch(function(err) {
    //             // Run this when promise was rejected via reject()
    //             GlobalScript.ajxRqtErrHandler(err, "alertify", "la recherche de la clé correspondante");
    //         });
    //     },
    //     autofocus: true,
    //     minLength: 2,
    //     delay: 100,
    // });

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
});