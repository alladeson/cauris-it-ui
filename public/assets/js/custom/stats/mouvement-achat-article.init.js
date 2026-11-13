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
		reportName = "rapport_des_achats_du_" + dateDebut + "_au_" + dateFin + ".pdf";
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
    // Formatage des data pour le fuseau horaire de l'utilisateur
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