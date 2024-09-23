const formLogin = document.getElementById("loginForm-container");
let baliseEmail = document.getElementById("loginEmail");
let balisePassword = document.getElementById("password");
let postLoginUrl = 'http://localhost:5678/api/users/login';

formLogin.addEventListener("submit",async function (event) {
    event.preventDefault();
    let email = baliseEmail.value;
    let password = balisePassword.value;
    console.log(email + "  " + password);
    let loginPayload = JSON.stringify({ email, password });
    console.log(loginPayload);

    let userArray = [];
    try {
        const loginUser = await fetch(postLoginUrl, {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : loginPayload     
        });
        if (loginUser.ok) {
            userArray = await loginUser.json();
            console.log(userArray);
            let userToken = userArray.token;
            console.log(userToken);
            localStorage.setItem("token",userToken);
            window.location.href = 'index_edition.html';
        } else { 
            window.alert("Erreur dans l'identifiant ou le mot de passe"); 
        }
    } catch (error) {
        console.log(error);
        window.alert(error);   
    }
});


let token = localStorage.getItem("token");
console.log(localStorage.token);


    
        
    

    
    

    

