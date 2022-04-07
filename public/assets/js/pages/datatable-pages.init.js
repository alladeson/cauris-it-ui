let datatable;

$(document).ready(function() {
    // $(".datatable").DataTable({ responsive: !1 }),
    datatable = $(".datatable").DataTable({
            "language": {
                //"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                "url": "/assets/i18n/French.json"
            }
        }),
        $(".dataTables_length select").addClass("form-select form-select-sm");
});