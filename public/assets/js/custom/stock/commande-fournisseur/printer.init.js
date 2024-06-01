let printer = {
    printCmdFournisseur: function(event = null, cmdf) {
        if (event) event.preventDefault();
        // Vérification de la validation du bon de commande
        // if(!cmdf.valid){
        //     this.sweetAlertError("Impression Bon de commande", "Ce bon de commande n'est pas encore validé. Veuillez le valider d'abord svp !");
        //     return;
        // }
        // Url d'impression et nom du fichier
        var printPdfUrl = URL_IMPRIMER_CMD_FOURNISSEUR.replace("__id__", cmdf.id);
        var reportName = `bon-de-commande-${cmdf.numero}.pdf`;
        // Mise à jour du titre du modal d'affichage
        $pdfWebviwerModal.find('h5.card-title').text(`Bon de commande #${cmdf.numero}`);
        // Lancement de l'impression du bon et de son affichage
        GlobalScript.showPrintedFile(printPdfUrl, "GET", null, reportName, "l'impression du bon de commande", "alertify");
    },
    sweetAlertError: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        })
    },
};