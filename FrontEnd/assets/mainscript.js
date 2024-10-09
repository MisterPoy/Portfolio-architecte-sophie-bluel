export {};

// VERIFICATION DU TOKEN AU CHARGEMENT DE LA PAGE
let userToken = localStorage.getItem("token");
console.log(userToken);
// ON DECLARE L'ADRESSE DE LA PAGE ACTUELLEMENT VISITE
let currentPage = window.location.pathname;
console.log(`Page actuelle: ${currentPage}`);
if (currentPage.includes("login.html")) {
  console.log("test force redirection depuis login.html");
  window.location.href = "index_edition.html";
}

// ON VERIFIE SI LME TOKEN EST OK ET ON REDIRIGE EN FONCTION DE
if ( (userToken && currentPage.includes("login.html")) || (userToken && currentPage.includes("index.html")) ) {
  window.location.href = 'index_edition.html';
} else if (!userToken && currentPage.endsWith("index_edition.html")){
  alert("Vous n'avez pas l'autorisation nécessaire pour accéder à cette page, veuillez vous reconnecter." )
  window.location.href = 'login.html';
} ; 

// declaration globale worksArray en tableau vide afin qu'il soit remplit par la reponse.json()
let worksArray = [];

const reponseWorks = await fetch("http://localhost:5678/api/works");
worksArray = await reponseWorks.json();
console.log(worksArray);

let gallery = document.querySelector(".gallery");



function displayWorks(works) {
  // erase html gallery
  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

    const worksFiles = document.createElement("figure");
    const worksImg = document.createElement("img");
    worksImg.src = work.imageUrl;
    worksImg.alt = work.title;
    worksFiles.appendChild(worksImg);
    const worksTitle = document.createElement("figcaption");
    worksTitle.innerText = work.title;
    worksFiles.appendChild(worksTitle);
    gallery.appendChild(worksFiles);
  }
}
displayWorks(worksArray);


//         CREATION DES FILTRES PAR CATEGORIES
//declaration d'un tableau vide pour acceuillir les catégories
let categoriesArray = [];

// on récupère les données de l'api pour les catégorie, convertis en Tableau dans la constante categoriesArray
const reponse = await fetch("http://localhost:5678/api/categories");
categoriesArray = await reponse.json();

// on rajoute une catégorie au début du tableau pour TOUS sur le même modèle, avec une id de 0 et un name "tous"
categoriesArray.unshift({ id: 0, name: "Tous" });

let worksFiltersContainer = document.querySelector(".worksFilters_container");

//FONCTION DE CREATION DES FILTRES
function createFilterBtn(categories) { 
  //on vide le html du container des filtres
  worksFiltersContainer.innerHTML = "";
  //boucle pour créer un élément html <button> pour chaque élément de categoriesArray, enfant du container principal et ayant un text qui correspond
  //au name de chaque catégorie
  for (let i = 0; i < categories.length; i++) {
    let categorie = categories[i];
    let categoriesBtn = document.createElement("button");
    worksFiltersContainer.appendChild(categoriesBtn);
    categoriesBtn.innerText = categorie.name;
    categoriesBtn.classList.add("filterBtn");
    categoriesBtn.dataset.id = categorie.id;

    categoriesBtn.addEventListener("click", function () {
      let allFiltersBtn = document.querySelectorAll(".filterBtn");
      for (let i = 0; i < allFiltersBtn.length; i++) {
        allFiltersBtn[i].classList.remove("filterBtnActived");
      }
      categoriesBtn.classList.add("filterBtnActived");

      const categoryId = parseInt(categoriesBtn.dataset.id);
      filterWorksByCategories(categoryId);
    });
  }
}   
if (window.location.pathname.endsWith("index.html")){
  createFilterBtn(categoriesArray);
}
/* createFilterBtn(categoriesArray); */

function filterWorksByCategories(categoryId) {
  if (categoryId === 0) {
    displayWorks(worksArray);
  } else {
    const filteredWorks = worksArray.filter(
      (work) => work.categoryId === categoryId
    );
    displayWorks(filteredWorks);
    console.log(categoryId);
    }
}


////////////// VARIABLE ET FONCTION POUR OUVRIR LA MODALE //////////////////////
const launchModalButton = document.querySelector('.modify_button');

const modaleWindows = document.querySelector('.modale_main-container');

const modale = document.querySelector('.modale');

const xmark = document.querySelectorAll('.fa-xmark');
console.log(xmark);

const modaleAddWork = document.querySelector('.modaleAddWork');
console.log(modaleAddWork);


///// CODE DE GESTION DE LA MODALE

/// AJOUT DU LISTENER SUR LE BOUTON POUR OUVRIR LA MODALE
if (window.location.pathname.endsWith("edition.html")){ 
  launchModalButton.addEventListener('click', function(){
    modaleWindows.style.display ='flex';
    modaleWindows.style.opacity = '1';
    modale.style.opacity = '1';
    displayWorksModale(worksArray);  
    closeModaleWithXmark();
    submitWorkBtn.disabled = true;
  });
  
} 

// DECLARATION MODALE GALLERY
let modaleGallery = document.querySelector(".modale_gallery");
console.log(modaleGallery);


// FONCTION AFFICHANT LES PROJETS
function displayWorksModale (works) {
  modaleGallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

    const worksFiles = document.createElement("figure");
    const worksImg = document.createElement("img");
    worksImg.src = work.imageUrl;
    worksImg.alt = work.title;
    worksFiles.appendChild(worksImg);
    const deleteWorkBtn = document.createElement("span");
    deleteWorkBtn.classList.add("delete-work_btn");
    deleteWorkBtn.innerHTML = ('<i class="fa-regular fa-trash-can"></i>');
    worksFiles.appendChild(deleteWorkBtn);
    modaleGallery.appendChild(worksFiles);
    // AJOUT D'EVENTS LISTENENR SUR LE CLICK DES BOUTONS DE SUPPRESSION DE PROJET
    deleteWorkBtn.addEventListener('click', async ()=> {
      // ON RECUPERE LE TOKEN
      const token = localStorage.getItem("token");
      console.log(token);
      // ON DEFINIT LE WORK ID 
      const workId = work.id;

  //  GESTION DE LA REQUETE DE SUPPRESSION AU CLICK ET RECHARGEMENT DE LA GALLERY
      // REQUETE DELETE
      try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
          method: 'DELETE',
          headers :{
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) { //SI LA REPONSE EST OK
          // ON SUPPRIME LE PROJET SELECTION workId
          worksArray = worksArray.filter(work => work.id !== workId);
          displayWorksModale(worksArray);
        } else { // GESTION DE L'ERREUR
            console.error('Erreur lors de la suppression du projet');  
        }
      } catch (error){
        console.error(error);
      }

      console.log("Essaie click bouton suppression réussit");
      console.log(worksArray[i]);
    });
  }
}

// DECLARATION DES BOUTONS DE SUPPRESSION DE PROJET DE LA MODALE
let deleteWorkBtn = document.querySelectorAll('.delete-work_btn');
console.log(deleteWorkBtn);

//FONCTION POUR FERMER LA MODALE
function closeModale (){
  modaleWindows.style.display='none';
  
}

// FONCTION DE FERMETURE DE LA MODALE EN CLIQUANT SUR LA CROIX
function closeModaleWithXmark (){
  xmark.forEach((xmark)=>{
    xmark.addEventListener("click", function() {
      closeModale();
    });
  }); 
};


// GESTION DU LOGOUT
const logOut = document.querySelector(".logOut");
logOut.addEventListener('click', function (event) {
  event.preventDefault();
  window.location.href = 'index.html';
  localStorage.removeItem('token');
  console.log("hello");
})


// CODE POUR FERMER LA MODALE EN CLIQUANT EN DEHORS DU CADRE DE CELLE-CI

modaleWindows.addEventListener('click', function (event) {

  if (modaleWindows.style.display === 'flex') {

    const isClickOnDeleteBtn = Array.from(deleteWorkBtn).some(btn => btn.contains(event.target));

    if (!modale.contains(event.target) && !isClickOnDeleteBtn && !modaleAddWork.contains(event.target)) {
    closeModale();
    console.log('hello everybody');
    displayWorks(worksArray);
  }
    }
});




console.log(deleteWorkBtn);

console.log(worksArray);

console.log(worksArray[9]);




//////////////////// MODALE AJOUT DE PROJET
const uploadWork = document.getElementById('uploadWork');
console.log(uploadWork);
const imgPreviewBox = document.querySelector('.imgPreviewBox');
const imgBoxcontent = document.querySelector('.imgBoxContent');
const imgPreview = document.querySelector('.imgPreview');
console.log(imgPreview);

// CHANGER DE MODALE EN CLIQUANT SUR "AJOUTER PHOTO"

const addPictureBtn = document.querySelector(".ajout-photo_box");
console.log(addPictureBtn);
addPictureBtn.addEventListener ('click', function(){
  modale.style.display = 'none';
  modale.style.opacity = '0'; 
  modaleAddWork.style.display = 'flex';
  modaleAddWork.style.opacity = '1';
});

const goBack = document.querySelector('.arrow-goback_container');
console.log(goBack);
// REVENIR A LA PRECEDENTE MODALE EN CLIQUANT SUR LA FLECHE DE RETOUR

goBack.addEventListener('click', function(){
  modaleAddWork.style.display = 'none';
  modaleAddWork.style.opacity = '0'; 
  modale.style.display = 'flex';
  modale.style.opacity = '1'; 
})


/// RECUPERE DYNAMIQUEMENT LES CATEGORIE POUR CREER LES CATEGORIES DU CHAMP SELECT

// JE SELECTIONNE LE CONTENANT DES CATAGORIES A CHOISIR
const selectCategorieBox = document.getElementById('select-categorie');
console.log(selectCategorieBox);
//
function createCategoriesSelect (categories) {
  selectCategorieBox.innerHTML = "";
  //CREATION DE LA PREMIERE OPTION PAR DEFAUT
  let selectBtnDefault = document.createElement("option");
  selectCategorieBox.appendChild(selectBtnDefault);
  // ON LUI RAJOUTE TOUT SES ATTRIBUT
  selectBtnDefault.value = "";
  selectBtnDefault.disabled = true;
  selectBtnDefault.selected = true;
  // ON ENLEVE LA CATEGORIE "TOUS" DU CATEGORIEARRAY
  categoriesArray.shift();
  console.log(categoriesArray);
  // CREATION DES AUTRE OPTIONS PAR RAPPORT AUX CATEGORIES DU BACK
  for (let i = 0; i < categories.length; i++) {
    let categorie = categories[i];
    let selectBtn = document.createElement("option");
    selectCategorieBox.appendChild(selectBtn);
    selectBtn.innerText = categorie.name;
    selectBtn.value = categorie.id;
    selectBtn.setAttribute('name', categorie.name);
  }
  /* let selectBtnDefault = document.createElement("option");
  selectBtnDefault.innerHTML = 'value="" disabled selected'; */
}
createCategoriesSelect(categoriesArray);

console.log(categoriesArray);


// POUR AFFICHER L'IMAGE DE PREVIEW APRES AVOIR CHOISIT LE FICHIER
uploadWork.addEventListener('change', (event)=> {

  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imgPreview.src = e.target.result;
      imgBoxcontent.style.display = "none";  
      imgPreviewBox.style.display = "flex";
    };
    reader.readAsDataURL(file);
  }
});

/// VERIFICATION DE LA VALIDITE DES CHAMPS DU FORMULAIRE

const addWorkForm = document.getElementById('addWorkForm');
console.log(addWorkForm);

const inputFile = document.querySelector('input#uploadWork');
console.log(inputFile); 

const titleField = document.querySelector('input#addWorkTitle');
console.log(titleField);

const checkField = document.getElementById('select-categorie');
console.log(checkField);

const submitWorkBtn = document.getElementById('submitWorkBtn');
console.log(submitWorkBtn);

console.log(addWorkForm);
console.log(checkField);

function areFieldsValid () {
  return (
    inputFile.checkValidity() &&
    titleField.checkValidity() &&
    checkField.checkValidity()
  );
}

/// TABLEAU AVEC LES CHAMPS A VERIFIER

[inputFile, titleField, checkField].forEach(field =>{
  // AJOUTE UN ECOUTEUR A CHAQUE CHAMP
  field.addEventListener('input',()=>{
    //VERIFIE SI TOUS LES CHAMP SON VALIDE AVEC LA FONCTION AREFIELDSVALID
    if (areFieldsValid()){
      submitWorkBtn.disabled = false; // si tous les champs sont valides active le bouton
    }  else {
      submitWorkBtn.disabled = true;
    }
  });
});


// AJOUT DE L'EVENEMENT SUBMIT POUR ENVOYER LE NOUVEAU PROJET AU BACK

addWorkForm.addEventListener ('submit', async function(event){
  event.preventDefault();
  // on récupère le token
  let userToken = localStorage.getItem('token');

  // on construit l'objet formData avec les infos du formulaires pour 
  //le body de la requète
  const formData = new FormData();
  formData.append('image', inputFile.files[0]);
  formData.append('title', titleField.value);

  formData.append('category', checkField.value);
  console.log(formData);  
  // requète pour envoyer les données à l'api
  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method : 'POST',
      headers : {
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    });
    if (response.ok) {

      const reponseWorks = await fetch("http://localhost:5678/api/works");
      worksArray = await reponseWorks.json();
      console.log(worksArray);

      // reset
      addWorkForm.reset();
      document.getElementById('uploadWork').value = '';
      imgBoxcontent.style.display = "flex";  
      imgPreviewBox.style.display = "none";
      imgPreview.src = ''; // Effacer l'aperçu
      document.getElementById('select-categorie').selectedIndex = 0;
      // on rajoute le nouveau projet au worksArray
      // on ferme la modale
      closeModale();
      // on met à jour la galerie
      displayWorks(worksArray);
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi des données', error);
    alert('Une erreur est survenue lors de la soumission. Veuillez réessayer');
  }
});

/* document.addEventListener('click', function (event) {

  if (!modale.contains(event.target)) {
    closeModale();
  }
});
 */

/* curl -X 'POST' \
  'http://localhost:5678/api/users/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "string",
  "password": "string"
}' */