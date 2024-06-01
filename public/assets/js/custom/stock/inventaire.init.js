let datatable;
let choices = [];
let categories = [];
let taxes = [];
let inventaire = {
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
                            // "ajax": "/assets/js/custom/data/inventaire.txt",
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
                                    { data: 'stock' },
                                    
                ],
            }),
            $(".dataTables_length select").addClass("form-select form-select-sm");
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
    printFicheInventaire: function(event = null) {
        if (event) event.preventDefault();
        // Url d'impression et nom du fichier
        let printPdfUrl = URL_IMPRIMER_FICHE_INVENTAIRE;
        // Formatage du nom du fichier, ex: "fiche-inventaire-de-stock-25-03-2024"
        let dateJour = (((new Date()).toLocaleString()).slice(0, 10)).replaceAll("/", "-"); // ex: 25-03-2024
        let reportName = `fiche-inventaire-de-stock-${dateJour}.pdf`;
        // Mise à jour du titre du modal d'affichage
        $pdfWebviwerModal.find('h5.card-title').text(`Fiche d'inventaire de stock`);
        // Lancement de l'impression du bon et de son affichage
        GlobalScript.showPrintedFile(printPdfUrl, "GET", null, reportName, "l'impression de la fiche d'inventaire de stock", "alertify");
    },
};
$(document).ready(function() {
    inventaire.listInitalizer();
});