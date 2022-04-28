let datatable;
let choices;
let connexion = {
    submitFormData: function(event) {
        event.preventDefault();
        var form = $("form#signin_form");
        var queryParam = form.find("#query_param").val();
        var data = form.serialize();
        console.log(data);
        // Set waitme zone to form (waitMe plugin)
        waitMe_zone = form;
        connexion.sendData(form).then(function(data) {
            // Run this when your request was successful
            alertify.success("Connexion réussie");
            console.log(data)
            window.location.href = queryParam ? queryParam : "/";
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err.responseText)
            alertify.error((err.status == 401 || err.status == 403) ? "Identifiant ou Mot de passe incorrecte" : "Une erreur s'est produite lors de la connexion au serveur");
        })
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
};