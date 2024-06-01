let datatable;
let choices = [];
let categories = [];
let taxes = [];
let article = {
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
                                    GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des articles");
                                    $(".datatable").find('tbody td').html('<span class="text-danger">Echec de chargement</span>');
                                }
                            },
                            // "ajax": "/assets/js/custom/data/article.txt",
                            columns: [{
                                        data: 'id',
                                        "class": "",
                                        "orderable": false,
                                        "searchable": false,
                                        "render": function(data, type, row, meta) {
                                            return `` +
                                                `<div class="form-check font-size-16">` +
                                                `<input type="checkbox" class="form-check-input" id="articlecheck${data}">` +
                                                `<label class="form-check-label" for="articlecheck${data}"></label>` +
                                                `</div>`;
                                        }
                                    },
                                    { data: 'reference' },
                                    {
                                        data: 'categorie',
                                        "render": function(data, type, row, meta) {
                                            return data.libelle;
                                        }
                                    },
                                    { data: 'designation' },
                                    {
                                        data: 'prix',
                                        render: function(data, type, row, meta) {
                                            return data + " fcfa";
                                        }
                                    },
                                    {
                                        data: 'taxe',
                                        "render": function(data, type, row, meta) {
                                            return data.string;
                                        }
                                    },
                                    {
                                        data: 'taxeSpecifique',
                                        render: function(data, type, row, meta) {
                                            return data ? data : "-";
                                        }
                                    },
                                    { data: 'stock' },
                                    { data: 'stockSecurite' },
                                    // { data: 'montant' },
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
                                                    ${ITEM_WRITABLE ?
                                                    `<li>
                                                        <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier</a>
                                                    </li>` : ""}
                                                    ${ITEM_DELETABLE ? 
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
                article.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                article.saError(notitle, notext);
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
                article.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                article.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = article.dataFormat(form)
        let dataId = form.find("#item-id").val();
        if(GlobalScript.traceFormChange(dataId)) return;
        // console.log(data)
        var categorieId = form.find("#categorie").val();
        var taxeId = form.find("#taxe").val();
        var obj = { '__id__': dataId, '__cId__': categorieId, '__tId__': taxeId }
        var submitUrl = dataId ? GlobalScript.textMultipleReplace(URL_PUT_ITEM, obj) : GlobalScript.textMultipleReplace(URL_POST_ITEM, obj);
        GlobalScript.request(submitUrl, (dataId ? 'PUT' : 'POST'), data).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
            datatable.ajax.reload();
            // article.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
            if (dataId) $("div.add-new-modal").modal('hide')
                // form[0].reset()
            article.resetFormData(form);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'enregistrement");
        });
    },
    showItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //// console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
            var itemObj = data;
            article.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage");
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //// console.log(id);
        //var response = GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
            var itemObj = data;
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            article.setformData($("div.add-new-modal").find('form'), itemObj);
            GlobalScript.getForeignsData(URL_LIST_CATEGORIE_ARTICLE, ['catégories', 'id', 'libelle'], 0, itemObj.categorie.id);
            GlobalScript.getForeignsData(URL_LIST_TAXE, ['taxes', 'id', 'string'], 1, itemObj.taxe.id);
            $(".add-new-modal").modal('show');
            GlobalScript.formChange($("div.add-new-modal").find('form'));
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "la modification");
        });
    },
    removeItem: function(el, oktitle, oktext) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        // // console.log(id);
        GlobalScript.request(URL_DELETE_ITEM.replace("__id__", id), 'DELETE', null).then(function(data) {
            // Run this when your request was successful
            // console.log(data)
                // article.saSucces(oktitle, oktext);
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
            form.find("#reference").val(item.reference)
            form.find("#designation").val(item.designation)
            form.find("#prix").val(item.prix)
            form.find("#taxe-specifique").val(item.taxeSpecifique)
            form.find("#ts-name").val(item.tsName);
            // Gestion du nom de la taxe
            article.setTsName(form.find("#taxe-specifique"));
            //
            form.find("#stock").val(item.stock)
            form.find("#stock-securite").val(item.stockSecurite)
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            data = {
                'id': GlobalScript.checkBlank(form.find("#item-id").val()),
                'reference': GlobalScript.checkBlank(form.find("#reference").val()),
                'designation': GlobalScript.checkBlank(form.find("#designation").val()),
                'prix': GlobalScript.checkBlank(form.find("#prix").val()),
                'taxeSpecifique': GlobalScript.checkBlank(form.find("#taxe-specifique").val()),
                'tsName': GlobalScript.checkBlank(form.find("#ts-name").val()),
                'stock': GlobalScript.checkBlank(form.find("#stock").val()) ?? 0,
                'stockSecurite': GlobalScript.checkBlank(form.find("#stock-securite").val()) ?? 0,
            };
            return JSON.stringify(data);
        }
        return null;
    },
    newItemEvent: function(event) {
        event.preventDefault();
        $("div.add-new-modal").find('h5.modal-title').text('Nouvel ajout');
        var form = $("div.add-new-modal").find('form');
        form[0].reset();
        form.find("#item-id").val("");
        GlobalScript.getForeignsData(URL_LIST_CATEGORIE_ARTICLE, ['catégories', 'id', 'libelle'], 0, null);
        GlobalScript.getForeignsData(URL_LIST_TAXE, ['taxes', 'id', 'string'], 1, null);
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.reference);
        $showClasseTable.find('.td-categorie').text(itemObj.categorie.libelle);
        $showClasseTable.find('.td-designation').text(itemObj.designation);
        $showClasseTable.find('.td-prix').text(itemObj.prix);
        $showClasseTable.find('.td-taxe').text(itemObj.taxe.string);
        $showClasseTable.find('.td-ts').text(itemObj.taxeSpecifique ? itemObj.taxeSpecifique : "-");
        $showClasseTable.find('.td-stock').text(itemObj.stock);
        $showClasseTable.find('.td-stock-securite').text(itemObj.stockSecurite);
    },
    /**
     * Réinitialiser le formulaire après un ajout, ceci permet à l'utilisateur de faire plusieurs ajout sans fermer le formulaire
     * @param {Object} form Le formulaire d'ajout d'un article
     */
    resetFormData: function(form) {
        form.find("#item-id").val("")
        form.find("#reference").val("")
        form.find("#designation").val("")
        form.find("#prix").val("")
        form.find("#taxe-specifique").val("")
        form.find("#stock").val("")
        form.find("#stock-securite").val("")
    },
    setTsName: function(tsElement) {
        if (tsElement.val()) {
            $("div.ts-name").show();
            if (!$("input#ts-name").val())
                $("input#ts-name").val("Taxe spécifique");
            $("input#ts-name").attr("required", "required");
        } else {
            $("div.ts-name").hide();
            $("input#ts-name").val(null);
            $("input#ts-name").removeAttr("required");
        }
    }
};
$(document).ready(function() {
    article.listInitalizer();
    article.choicesJsInit();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        formChange = false;
        article.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // article.removeItem($(this));
        article.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cet article ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "Article supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        article.showItem($(this));
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
    // GEstion de la taxe spécifique de l'article 
    $("input#taxe-specifique").keyup(function(event) {
        event.preventDefault();
        article.setTsName($(this));
    })
});