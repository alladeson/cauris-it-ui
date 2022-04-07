var dashboard = {
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
                entretien.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                entretien.saError(notitle, notext);
        });
    },
    goToClientList: function(e) {
        e.preventDefault();
        window.location.href = "/client";
    },
    goToReservationList: function(e) {
        e.preventDefault();
        window.location.href = "/client/reservation";
    },
    goToChambreList: function(e) {
        e.preventDefault();
        window.location.href = "/chambre";
    },
};