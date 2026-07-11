let datatable = [];
let dtSelector = ["fv", "fa", "recap"];
let choices = [];
let objet;
let statsPayload = {
    "debut": null,
    "fin": null,
    "debutAt": null,
    "finAt": null,
    "confirm": true,
    "typeId": null,
    "clientId": null,
    "search": "bilan",
    "rapportDepense": "",
    "rapportBenefice": "",
};
let filtreForm = null;
let url_list = null;
let printModal = null;
let calculMargeBeneficiaire = {
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
                calculMargeBeneficiaire.calculMarge() :
                e.dismiss === Swal.DismissReason.cancel &&
                calculMargeBeneficiaire.saError(notitle, notext);
        });
    },
    calculMarge: function () {       
        GlobalScript.request(URL_calcul_MARGE_BENEFICIAIRE_BY_DATE, 'POST', JSON.stringify(statsPayload)).then(function (data) {
            // Response data is already a string message from the server, so we can directly display it
            calculMargeBeneficiaire.saSucces("Succès !", data.response);
        }).catch(function (err) {
            // Run this when promise was rejected via reject()   
            GlobalScript.ajxRqtErrHandler(err, "sweet", "calcul de la marge bénéficiaire");
        });
    },
};
$(document).ready(function () {
    // Set the default dateDebut to the start of the current day
    GlobalScript.setDateDebutDefaultValue();
    // Set the default dateFin to the end of the current day
    document.getElementById("date-fin").value = GlobalScript.getDateFinJour();
});
document.addEventListener("DOMContentLoaded", function () {
    // Récupération du formulaire du filtre
    filtreForm = $("form.filtre-form");
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
            calculMargeBeneficiaire.saParams("Confirmez-vous le calcul de la marge bénéficiaire ?", "Les bénéfices seront calculés selon les dates sélectionnées.", "Oui, je confirme !", "Non, annuller !", "Confirmer !", "Calcul effectué avec succès !", "Annullée !", "Opération annullée, rien n'a changé.");
            return;
        }
    });
});