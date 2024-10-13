//  DEFINE THE HTML FORM INTO A CONSTANT formLogin
const formLogin = document.getElementById("loginForm-container");

//  DEFINE EMAIL AND PASSWORD INPUT FIELDS
let baliseEmail = document.getElementById("loginEmail");
let balisePassword = document.getElementById("password");

//  STORE THE URL FOR THE LOGIN API REQUEST
let postLoginUrl = 'http://localhost:5678/api/users/login';


// REDIRECT THE USER IF THEY ALREADY HAS TOKEN
let userToken = localStorage.getItem("token");
console.log(userToken);
let currentPage = window.location.pathname;
console.log(`Page actuelle: ${currentPage}`);

if ( (userToken && currentPage.includes("login.html")) ) {
    window.location.href = 'index_edition.html';
}


//  EVENT LISTENER FOR SUBMIT LOGIN
formLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    //  STORE THE VALUES IN FORM FIELDS
    let email = baliseEmail.value;
    let password = balisePassword.value;
    
    let loginPayload = JSON.stringify({ email, password });  // CONVERT VALUES TO JSON FOR API REQUEST
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

        //  IF THE LOGIN INFORMATIONS ARE CORRECT, STORE THE TOKEN IN LOCAL STORAGE AND
        //  REDIRECT THE USER ON EDITION MODE PAGE
        if (loginUser.ok) {
            let userArray = await loginUser.json();
            console.log(userArray);
            let userToken = userArray.token;
            console.log(userToken);
            localStorage.setItem("token",userToken);
            window.location.href = 'index_edition.html';
        
        //  ERROR HANDLING
            //  FOR INCORRECT EMAIL AND/OR PASSWORD
        } else if (loginUser.status === 401) {
            console.log(`Erreur : ${loginUser.status}`);
            window.alert('Erreur dans l’identifiant ou le mot de passe');
            
        } else if (loginUser.status === 404) {            
            console.log(`Erreur : ${loginUser.status}`);
            window.alert('Erreur dans l’identifiant ou le mot de passe');
        }
        //  FOR ALL OTHER ERRORS 
    } catch (error) {
        console.error(error);
        window.alert('Une erreur réseau est survenue. Veuillez vérifier votre connexion.');
    }
});


/////     TOKEN STORED IN LOCAL STORAGE FOR USER
let token = localStorage.getItem("token");
console.log(localStorage.token);

