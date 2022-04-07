let datatable;
let choices = [];
let objet;
let nettoyage = {
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
            choices[i] = new Choices(a, {
                loadingText: 'Chargement...',
                noResultsText: 'Aucun résultat trouvé',
                noChoicesText: 'Pas de choix à effectuer',
                itemSelectText: 'Appuyez pour sélectionner',
                position: "top",
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
                nettoyage.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                nettoyage.saError(notitle, notext);
        });
    },
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("div.add-new-modal").find('form');
        var data = form.serialize()
        console.log(data)
            //console.log(form.find('#objet').val())
        nettoyage.sendData(form).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            nettoyage.saSucces("Succès !", "Enregistrement effectué avec succès.")
            $("div.add-new-modal").modal('hide')
            form[0].reset()
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            nettoyage.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        })
    },
    showItem: function() {
        //console.log('show item')
        $(".show-item-modal").modal('show')
    },
    editItem: function() {
        //console.log('edit item')
        var item = {
            reference: "156",
            date: '2022-01-10T10:00',
            chambre: '1',
            personnel: '3',
        }
        nettoyage.setformData($("div.add-new-modal").find('form'), item)
        $(".add-new-modal").modal('show')
    },
    removeItem: function() {
        //console.log('remove item')
        nettoyage.saParams("Êtes-vous sûr de vouloir supprimer ce nettoyage ?", "Cette opération est irréversible !", "Oui, supprimer !", "Non, annuller !", "Supprimée !", "Nettoyage supprimé avec succès.", "Annullée !", "Opération annullée, rien n'a changé.");
    },
    setformData: function(form, item) {
        if (form.length) {
            form.find("#reference").val(item.reference)
            form.find("#date").val(item.date)
            choices[0].setChoiceByValue(item.chambre)
            choices[1].setChoiceByValue(item.personnel)
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
    nettoyage.listInitalizer();
    // Edit record
    datatable.on('click', '.edit-item', function(e) {
        e.preventDefault();
        nettoyage.editItem($(this));
    });

    // Delete a record
    datatable.on('click', '.remove-item', function(e) {
        e.preventDefault();
        nettoyage.removeItem($(this));
    });

    //Show record
    datatable.on('click', '.show-item', function(e) {
        e.preventDefault();
        nettoyage.showItem($(this));
    });
});
document.addEventListener("DOMContentLoaded", function() {
    nettoyage.choicesJsInit();
});