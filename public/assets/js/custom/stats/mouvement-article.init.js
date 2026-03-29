let datatable = [];
let dtSelector = ["fv", "fa", "recap"];
let choices = [];
let objet;
let statsPayload = {
    "debut": null,
    "fin": null,
    "debutAt": null,
    "finAt": null,
};
let filtreForm = null;
let url_list = null;
let bilan = {
    printItem: function (el) {
        // Récupération de l'id de l'objet
        let id = el.data("item-id");
        //// console.log(id);
        GlobalScript.request(URL_GET_ITEM.replace("__id__", id), 'GET', null).then(function (data) {
            // Run this when your request was successful
            // console.log(data)
            GlobalScript.showPrintedInvoice(data);
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "sweet", "l'affichage de l'interface de modification");
        });
    },
    printBilan: function () {
        var debut = filtreForm.find("input#date-debut").val();
        var fin = filtreForm.find("input#date-fin").val();
        //
        var obj = {"-": "", "T": "_", ":": ""};
        dateDebut = GlobalScript.textMultipleReplace(debut, obj);
        dateFin = GlobalScript.textMultipleReplace(fin, obj);
		reportName = "rapport_vente_et_gestion_stock_du_" + dateDebut + "_au_" + dateFin + ".pdf";
        // console.log(reportName);
        //
        GlobalScript.showPrintedMvtArticle(URL_IMPRESSION_MOUVEMENT_ARTICLES, 'GET', JSON.stringify(statsPayload), reportName);
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
    // Mise à jour des champs de date du formulaire de filtre
    // filtreForm.find("#date-debut").val(((new Date()).toISOString()).slice(0, 19))
    // filtreForm.find("#date-fin").val(((new Date()).toISOString()).slice(0, 19))
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
            // console.log(statsPayload);
            // Réchargement des tableaux de liste des factures
            url_list = URL_LIST_FV_CONFIRMED_DATE;
            bilan.getBilanMontant(url_list, "#bilan-facture-vente", "fv")
            url_list = URL_LIST_FA_CONFIRMED_DATE;
            bilan.getBilanMontant(url_list, "#bilan-facture-avoir", "fa")
            url_list = URL_LIST_RECAP_CONFIRMED_DATE;
            bilan.getBilanMontant(url_list, "#bilan-recapitulatif", "recap")            
            return;
        }
    });
    filtreForm.on("click", "button.print-mvt-article", function(event){
        event.preventDefault();
        // Récupération des dates de début et de fin
        var debut = new Date(filtreForm.find("input#date-debut").val());
        var fin = new Date(filtreForm.find("input#date-fin").val());
        // Comparaison des dates, la date de fin doit être supérieure à la date de début
        if (fin.getTime() <= debut.getTime()) {
            alertify.error("La date de fin doit être supérieure à la date de début");
            return;
        }else {
            statsPayload.debut = (debut.toISOString()).slice(0, 19);
            statsPayload.fin = (fin.toISOString()).slice(0, 19);
            bilan.printBilan();
            return;
        }
    })
});