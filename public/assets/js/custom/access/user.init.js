let datatable;
let choices = [];
let user = {
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
                        GlobalScript.ajxRqtErrHandler(xhr, "alertify", "la récupération des utilisateurs");
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
                                `<input type="checkbox" class="form-check-input" id="usercheck${data}">` +
                                `<label class="form-check-label" for="usercheck${data}"></label>` +
                                `</div>`;
                        }
                    },
                    { data: 'id' },
                    {
                        data: 'username',
                        render: function(data, type, row, meta) {
                            return data ? data : "-";
                        }
                    },
                    {
                        data: 'lastname',
                        render: function(data, type, row, meta) {
                            return data ? data : "-";
                        }
                    },
                    {
                        data: 'firstname',
                        render: function(data, type, row, meta) {
                            return data ? data : "-";
                        }
                    },
                    {
                        data: 'telephone',
                        render: function(data, type, row, meta) {
                            return data ? data : "-";
                        }
                    },
                    {
                        data: 'role',
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
                                                    <li>
                                                        <a class="dropdown-item show-item" href="javascript:void(0);" data-item-id="${data}">Afficher</a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item edit-item" href="javascript:void(0);" data-item-id="${data}">Modifier</a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item remove-item" href="javascript:void(0);" data-item-id="${data}">Supprimer</a>
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
                searchEnabled: false,
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
                user.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                user.saError(notitle, notext);
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
                user.removeItem(el, oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                user.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = user.dataFormat(form)
        var dataId = form.find("#item-id").val();
        var groupeId = form.find("#groupe").val();
        // Vérification du changment dans le formulaire
        if (GlobalScript.traceFormChange(dataId)) return;
        console.log(data)
        var url = dataId ? URL_PUT_ITEM.replace("__id__", dataId) : URL_POST_ITEM;
        var method = dataId ? 'PUT' : 'POST';
        GlobalScript.request(url.replace("__groupeId__", groupeId), method, data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            datatable.ajax.reload();
            // user.saSucces("Succès !", "Enregistrement effectué avec succès.")
            alertify.success("Enregistrement effectué avec succès")
            if (dataId) $("div.add-new-modal").modal('hide')
            form[0].reset()
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
            user.setShowingTable(itemObj);
            $(".show-item-modal").modal('show')

        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage");
        });
    },
    editItem: function(el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //console.log(id);
        //var response = GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            var itemObj = data;
            $("div.add-new-modal").find('h5.modal-title').text('Modification');
            user.setformData($("div.add-new-modal").find('form'), itemObj);
            $(".add-new-modal").modal('show');
            // Récupération des groupes d'utilisateur
            GlobalScript.getForeignsData(
                URL_LIST_USER_GROUP, ["groupes d'utilisateurs", "id", "name"],
                0,
                data.group.id
            );
            // Écoute de changement dans le formulaire
            GlobalScript.formChange($("div.add-new-modal").find('form'));
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
                // user.saSucces(oktitle, oktext);
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
            form.find("#username").val(item.username)
            form.find("#lastname").val(item.lastname)
            form.find("#firstname").val(item.firstname)
            form.find("#telephone").val(item.phone)
            choices[0].setChoiceByValue(item.group.id)
                // Le mot de passe n'est pas obligatoire lors de la mise à jour
            form.find("#password").removeAttr("required")
        }
    },
    dataFormat: function(form) {
        if (form.length) {
            data = {
                'id': GlobalScript.checkBlank(form.find("#item-id").val()),
                'username': GlobalScript.checkBlank(form.find("#username").val()),
                'lastname': GlobalScript.checkBlank(form.find("#lastname").val()),
                'firstname': GlobalScript.checkBlank(form.find("#firstname").val()),
                'phone': GlobalScript.checkBlank(form.find("#telephone").val()),
                // 'role': form.find("#role").val(),
                'defaultPassword': GlobalScript.checkBlank(form.find("#password").val()),
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
        // Le mot de passe est obligatoire pour l'ajout d'un utilisateur
        form.find("#password").attr("required", "required");
        // Récupération des groupes d'utilisateur
        GlobalScript.getForeignsData(
            URL_LIST_USER_GROUP, ["groupes d'utilisateurs", "id", "name"],
            0,
            null
        );
    },
    reloadDatatable: function(event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    setShowingTable: function(itemObj) {
        var $showClasseTable = $('table.item-show-table');
        $showClasseTable.find('.td-reference').text(itemObj.id);
        $showClasseTable.find('.td-name').text(itemObj.name ? itemObj.name : "-");
        $showClasseTable.find('.td-ifu').text(itemObj.ifu ? itemObj.ifu : "-");
        $showClasseTable.find('.td-rcm').text(itemObj.rcm ? itemObj.rcm : "-");
        $showClasseTable.find('.td-telephone').text(itemObj.telephone ? itemObj.telephone : "-");
        $showClasseTable.find('.td-email').text(itemObj.email ? itemObj.email : "-");
        $showClasseTable.find('.td-address').text(itemObj.address ? itemObj.address : "-");
        $showClasseTable.find('.td-ville').text(itemObj.ville ? itemObj.ville : "-");
    },
    passwordShowToggle: function() {
        var x = document.getElementById("password");
        var y = document.getElementById("password-icon");
        if (x.type === "password") {
            x.type = "text";
            icon = `<i class="mdi mdi-eye-off-outline"></i>`
        } else {
            x.type = "password";
            icon = `<i class="mdi mdi-eye-outline"></i>`
        }
        y.innerHTML = icon;
    }
};
$(document).ready(function() {
    user.listInitalizer();
    user.choicesJsInit();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        formChange = false;
        user.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        // user.removeItem($(this));
        user.saRemoveParams($(this), "Êtes-vous sûr de vouloir supprimer cet utilisateur ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "Client supprimé avec succès.", "annulée !", "Opération annulée, rien n'a changé.");
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        user.showItem($(this));
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
        console.log(count + ' column(s) are hidden');
    });

    $("div.add-new-modal").find('form').on("click", ".submit-button", function(event) {
        event.preventDefault();
        if (!$("div.add-new-modal").find('form').find("#groupe").val()) {
            alertify.warning("Veuillez sélectionner un groupe d'utilisateur svp !")
            return;
        }
        user.submitFormData(event);
    })

});

document.addEventListener("DOMContentLoaded", function() {});