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
};
let filtreForm = null;
let url_list = null;
let printModal = null;
let margeBeneficiaire = {
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
                margeBeneficiaire.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                margeBeneficiaire.saError(notitle, notext);
        });
    },
    printDepense: function () {
        var debut = filtreForm.find("input#date-debut").val();
        var fin = filtreForm.find("input#date-fin").val();
        var obj = {"-": "", "T": "_", ":": ""};
        dateDebut = GlobalScript.textMultipleReplace(debut, obj);
        dateFin = GlobalScript.textMultipleReplace(fin, obj);
		reportName = "rapport_des_depenses_du_" + dateDebut + "_au_" + dateFin + ".pdf";
        //
        GlobalScript.showPrintedBilan(URL_IMPRESSION_DEPENSE, 'GET', JSON.stringify(statsPayload), reportName);
    },
    printBenefice: function () {
        var debut = filtreForm.find("input#date-debut").val();
        var fin = filtreForm.find("input#date-fin").val();
        var obj = {"-": "", "T": "_", ":": ""};
        dateDebut = GlobalScript.textMultipleReplace(debut, obj);
        dateFin = GlobalScript.textMultipleReplace(fin, obj);
		reportName = "rapport_des_benefices_du_" + dateDebut + "_au_" + dateFin + ".pdf";
        //
        GlobalScript.showPrintedBilan(URL_IMPRESSION_BENEFICE, 'GET', JSON.stringify(statsPayload), reportName);
    },
    reloadDatatable: function (event) {
        event.preventDefault();
        datatable.ajax.reload();
    },
    getMargeMontants: function (url, tableSelector) {        
        GlobalScript.request(url, 'GET', JSON.stringify(statsPayload)).then(function (data) {
            // Formatage du tableau de données de bilan des montants
            margeBeneficiaire.updateMargeMontantTable(data, tableSelector)            
        }).catch(function (err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération des montants");
        });
    },
    updateMargeMontantTable: function(data, tableSelector){
        var tbodyRef = $(tableSelector).find("tbody");
        var tfootRef = $(tableSelector).find("tfoot");
        var body = ``;
        body += `<tr class="text-center">                    
                <td>${GlobalScript.numberFormat(data.totalAchat, 0)}</td>
                <td>${GlobalScript.numberFormat(data.totalVente, 0)}</td>
                <td>${GlobalScript.numberFormat(data.margeBeneficiaire, 0)}</td>
            </tr>`
        if(body)
            tbodyRef.html(body);
        else
            tbodyRef.html(
                `<tr class="text-center">
                    <td colspan="5">Aucune donnée disponible dans le tableau</td>
                </tr>`
            );
        tfootRef.html(
            `<tr>
                <td colspan="3" class=""> 
                    <dl class="row mb-0 d-flex justify-content-center">
                        <dt class="col-lg-2 col-sm-3 col-6 text-end">Marge Bénéficiaire : </dt>
                        <dd class="col-md-3 col-sm-4 col-6">${GlobalScript.numberFormat(data.margeBeneficiaire, 0)} FCFA</dd>
                    </dl>                    
                </td>
            </tr>`
        );
    },
    submitPrintFormModal: function(event){
        event.preventDefault();
        // Fermeture du modal d'impression du bilan
        printModal.hide();
        // Récupération du type d'impression choisi (dépense ou bénéfice)
        var printType = $("#type-impression").val();
        // Lancement de l'impression du rapport correspondant au type choisi
        if(printType === "depense"){
            margeBeneficiaire.printDepense();
        }else if(printType === "benefice"){
            margeBeneficiaire.printBenefice();
        }
        // Réinitialisation du champ de sélection du type d'impression
        // $("#type-impression").val("");
    },
};
$(document).ready(function () {
    // Set the default dateDebut to the start of the current day
    GlobalScript.setDateDebutDefaultValue();
    // Set the default dateFin to the end of the current day
    document.getElementById("date-fin").value = GlobalScript.getDateFinJour();
    // Initialisation du modal d'impression du bilan
    printModal = new bootstrap.Modal(document.getElementById("print-bilan-modal"));
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
            margeBeneficiaire.getMargeMontants(URL_GET_MONTANTS, "#bilan-recapitulatif");           
            return;
        }
    });
    filtreForm.on("click", "button.print-bilan", function(event){
        event.preventDefault();
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
            // Affichage du modal d'impression du bilan
            printModal.show();
            return;
        }
    })
});