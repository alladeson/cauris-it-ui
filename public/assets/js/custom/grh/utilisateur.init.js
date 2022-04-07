let datatable;
let choices;
let grhUser = {
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
    choicesJsInit: function() {
        var e = document.querySelectorAll("[data-trigger]");
        for (i = 0; i < e.length; ++i) {
            var a = e[i];
            choices = new Choices(a, {
                loadingText: 'Chargement...',
                noResultsText: 'Aucun résultat trouvé',
                noChoicesText: 'Pas de choix à effectuer',
                itemSelectText: 'Appuyez pour sélectionner',
                position: "auto",
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
                grhUser.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                grhUser.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = form.serialize()
        console.log(data)
        grhUser.sendData(form).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            grhUser.saSucces("Succès !", "Enregistrement effectué avec succès.")
            $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            grhUser.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        })
    },
    showItem: function() {
        //console.log('show item')
        $(".show-item-modal").modal('show')
    },
    editItem: function() {
        //console.log('edit item')
        var item = {
            nom: "AGOUHE",
            prenom: "Jonathan Grégoire",
            email: "jo.agouhe@gmail.com",
            telephone: "66789524",
            adresse: "AKONABOHE Rue 24 Sans-Fransisco",
            position: ['2', '8', '11', '12'],
        }
        grhUser.setformData($("div.add-new-modal").find('form'), item)
        $(".add-new-modal").modal('show')
    },
    activateItem: function() {
        //console.log('activate item')
        grhUser.saParams("Êtes-vous sûr de vouloir activer cet utilisateur ?", "Cette opération est irréversible !", "Oui, activer !", "Non, annuller !", "Activé !", "utilisateur activé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    },
    desactivateItem: function() {
        //console.log('desactivate item')
        grhUser.saParams("Êtes-vous sûr de vouloir désactiver cet utilisateur ?", "Cette opération est irréversible !", "Oui, désactiver !", "Non, annuller !", "Désactivé !", "utilisateur désactivé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    },
    removeItem: function() {
        //console.log('remove item')
        grhUser.saParams("Êtes-vous sûr de vouloir supprimer cet utilisateur ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimé !", "utilisateur supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    },
    setformData: function(form, item) {
        if (form.length) {
            form.find("#nom").val(item.nom)
            form.find("#prenom").val(item.prenom)
            form.find("#email").val(item.email)
            form.find("#telephone").val(item.telephone)
            form.find("#adresse").val(item.adresse)
            choices.setChoiceByValue(item.position)
        }
    },
    sendData: function(form) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: form.attr('action'),
                method: form.attr('method'),
                data: form.serialize(),
                success: function(data) {
                    resolve(data) // Resolve promise and go to then()
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                },
            });
        });
    },
    getData: function(url) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                method: "GET",
                success: function(data) {
                    resolve(data) // Resolve promise and go to then()
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                },
            });
        });
    },
    deleteItem: function(url) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: url,
                method: "DELETE",
                success: function(data) {
                    resolve(data) // Resolve promise and go to then()
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                },
            });
        });
    },
};
$(document).ready(function() {
    grhUser.listInitalizer();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        grhUser.editItem($(this));
    });

    // Activate a record
    datatable.on('click', '.activate-item', function(e) {
        e.preventDefault();
        grhUser.activateItem($(this));
    });

    // Desactivate a record
    datatable.on('click', '.desactivate-item', function(e) {
        e.preventDefault();
        grhUser.desactivateItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        grhUser.removeItem($(this));
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        grhUser.showItem($(this));
    });
});
document.addEventListener("DOMContentLoaded", function() {
    grhUser.choicesJsInit();
});