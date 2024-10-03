



// je récupère le formulaire html dans une constante formLogin pour pouvoir "écouter" lévènement submit
const formLogin = document.getElementById("loginForm-container");
// récupération des champs de saisies email et pass word
let baliseEmail = document.getElementById("loginEmail");
let balisePassword = document.getElementById("password");
//stockage de l'url de la demande de login API
let postLoginUrl = 'http://localhost:5678/api/users/login';


// écouteur d'évènements sur ll'évènement "submit" du formulaire
formLogin.addEventListener("submit", async function (event) {
    // on coupe le comportement par défaut du nav pour qu'il ne recharge pas la page
    event.preventDefault();
    // on récupère les valeures saisi par l'utilisateur dans les champs de saisie pour la stocker
    let email = baliseEmail.value;
    let password = balisePassword.value;
    // on converti l'email et password en JSON pour la requète API en variable loginPayload
    let loginPayload = JSON.stringify({ email, password });
    console.log(loginPayload);

    try {
        
        const loginUser = await fetch(postLoginUrl, {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : loginPayload     
        });

        console.log(loginUser);

        if (loginUser.ok) {
            let userArray = await loginUser.json();
            console.log(userArray);
            let userToken = userArray.token;
            console.log(userToken);
            localStorage.setItem("token",userToken);
            window.location.href = 'index_edition.html';
            /* closeModaleWithXmark(); */
        } else if (loginUser.status === 404) {
            // Si le statut est 401, affiche un message personnalisé et empêche l'erreur par défaut
            console.log('Erreur dans l’identifiant ou le mot de passe (401)');
            window.alert('Erreur dans l’identifiant ou le mot de passe');
        } else if (loginUser.status === 401) {
            // Pour d'autres codes d'erreur
            console.log(`Erreur : ${loginUser.status}`);
            window.alert('Erreur dans l’identifiant ou le mot de passe');
        }
    } catch (error) {
        // Gestion des erreurs réseaux ou autres exceptions
        console.error(error);
        window.alert('Une erreur réseau est survenue. Veuillez vérifier votre connexion.');
    }
});


let token = localStorage.getItem("token");
console.log(localStorage.token);
;
    

