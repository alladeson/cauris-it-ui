let datatable;
let choices;
let userProfile = {
    choicesJsInit: function() {
        var e = document.querySelectorAll("[data-trigger]");
        for (i = 0; i < e.length; ++i) {
            var a = e[i];
            choices = new Choices(a, {
                loadingText: 'Chargement...',
                noResultsText: 'Aucun résultat trouvé',
                noChoicesText: 'Pas de choix à effectuer',
                itemSelectText: 'Appuyez pour sélectionner',
                position: "bottom",
                removeItemButton: true,
                duplicateItemsAllowed: !1,
                shouldSort: false,
                searchEnabled: false,
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
    saSuccesEditUser: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        }).then(function(e) {
            e.value ? location.href = "" : '';
        });
    },
    saSuccesPasswordReset: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        }).then(function(e) {
            e.value ? location.href = URL_LOGOUT_AUTH_USER : '';
        });
    },
    editItem: function() {
        var data = userProfile.dataFormat()
        var userForm = $("form#user-form")
        GlobalScript.request(URL_GET_ITEM.replace("__id__", JSON.parse(data).id), 'PUT', data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            if (userForm.find("input#photo").val()) userProfile.submitFormDataPhoto(data);
            else {
                userProfile.resetAuthUser();
            }
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            userProfile.saError("Erreur !", "Une erreur s'est produite lors de la modification.")
        });
    },
    passwordReset: function() {
        var data = userProfile.passwordDataFormat()
        GlobalScript.request(URL_PUT_USER_PASSWORD_RESET.replace("__id__", JSON.parse(data).id), 'PUT', data).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            userProfile.saSuccesPasswordReset("Succès !", "Modification effectuée avec succès. Vous allez être déconnecté !")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            var responseText = JSON.parse(err.responseText)
            errorMessage = "Une erreur s'est produite lors de la modification.";
            if (responseText.message)
                errorMessage = responseText.message
            userProfile.saError("Erreur !", errorMessage)
        });
    },
    submitFormDataPhoto: function(user) {
        var userForm = $("form#user-form")
        let formData = new FormData();
        let file = userForm.find("input#photo")[0].files[0];
        formData.append("file", file);
        formData.append("method", "PUT");
        formData.append("url", URL_PUT_USER_PHOTO.replace("__id__", user.id));
        GlobalScript.requestFile(formData).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            userProfile.saSuccesEditUser("Succès !", "Modification effectuée avec succès.")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            userProfile.saError("Erreur !", "Une erreur s'est produite lors de l'enregistrement.")
        });
    },
    resetAuthUser: function() {
        GlobalScript.requestLocal(URL_RESET_AUTH_USER, 'POST', null).then(function(data) {
            // Run this when your request was successful
            console.log(data)
            userProfile.saSuccesEditUser("Succès !", "Modification effectuée avec succès.")
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
            userProfile.saError("Erreur !", "Une erreur s'est produite lors de la modification.")
        });
    },
    dataFormat: function(form) {
        var userForm = $("form#user-form")
        var user = userForm.data("user");
        if (userForm.length) {
            user.username = userForm.find("#username").val()
            user.lastname = userForm.find("#lastname").val()
            user.firstname = userForm.find("#firstname").val()
            user.phone = userForm.find("#telephone").val()
            user.email = userForm.find("#email").val()
            return JSON.stringify(user);
        }
        return "";
    },
    passwordDataFormat: function(form) {
        var passwordForm = $("form#password-form")
        var userForm = $("form#user-form")
        if (passwordForm.length) {
            data = {
                'id': userForm.find("#item-id").val(),
                'old': passwordForm.find("#oldValue").val(),
                'new': passwordForm.find("#newValue").val(),
                'confirmed': passwordForm.find("#confirmedValue").val(),
            };
            return JSON.stringify(data);
        }
        return "";
    },
    onSave: function(event) {
        event.preventDefault();
        // Vérification des infos importantes
        var data = userProfile.dataFormat()
        console.log(data);
        if (data) {
            $.each(JSON.parse(data), function(key, value) {
                if (!value && !($.inArray(key, ['createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'defaultPassword']) > -1)) {
                    console.log(key)
                    userProfile.saError("Erreur !", "L'enregistrement ne peut aboutir pour manque d'informations. Veuillez bien renseigner votre nom, prénom et identifiant !")
                    save = false;
                    return save;
                } else {
                    save = true;
                }
            })
        }
        if (save) userProfile.editItem();
    },
    onSavePassword: function(event) {
        event.preventDefault();
        // Vérification des infos importantes
        var data = userProfile.passwordDataFormat()
        console.log(data);
        if (data) {
            $.each(JSON.parse(data), function(key, value) {
                if (!value) {
                    console.log(key)
                    userProfile.saError("Erreur !", "La modification ne peut aboutir. Veuillez bien remplir le formulaire du mot de passe !")
                    save = false;
                    return save;
                } else {
                    save = true;
                }
            })
        }
        if (save) userProfile.passwordReset();
    },
    passwordShowToggle: function(event = null, inputId, iconButtonId) {
        if (event) event.preventDefault();

        var x = document.getElementById(inputId);
        var y = document.getElementById(iconButtonId);
        if (x.type === "password") {
            x.type = "text";
            icon = `<i class="mdi mdi-eye-off-outline"></i>`
        } else {
            x.type = "password";
            icon = `<i class="mdi mdi-eye-outline"></i>`
        }
        y.innerHTML = icon;
    },
    imageReset: function() {
        // $(this).parent().remove();
        // $(".imgAdd").show();
        $("div.imageUpPreview").find("input.img").val("");
        $("div.imageUpPreview").find("div.imagePreview").replaceWith(`<div class="imagePreview"></div>`);
        $("div.imageUpPreview").find("i.del").hide();
    }
};
$(document).ready(function() {
    // Gestion de l'image
    $(document).on("click", "i.del", function() {
        userProfile.imageReset();
    });
    $(function() {
        $(document).on("change", ".uploadFile", function() {
            var uploadFile = $(this);
            var files = !!this.files ? this.files : [];
            if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

            if (/^image/.test(files[0].type)) { // only image file
                var reader = new FileReader(); // instance of the FileReader
                reader.readAsDataURL(files[0]); // read the local file

                reader.onloadend = function() { // set image data as background of div
                    //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                    uploadFile.closest(".imgUp").find('.imagePreview').css("background-image", "url(" + this.result + ")");
                }
                $("div.imageUpPreview").find("i.del").show();
            } else {
                userProfile.imageReset();
            }

        });
    });
});