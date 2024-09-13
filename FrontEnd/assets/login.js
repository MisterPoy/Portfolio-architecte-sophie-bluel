const formLogin = document.getElementById("loginForm-container");
let baliseEmail = document.getElementById("loginEmail");
let balisePassword = document.getElementById("password");
let postLoginUrl = "http://localhost:5678/api/users/login";

formLogin.addEventListener("submit", function(event){
    event.preventDefault();
    let email = baliseEmail.value ;
    let password = balisePassword.value;
    console.log(email+"  "+password);
    let reponseLogin = JSON.stringify({email, password});
    console.log(reponseLogin);
} );
