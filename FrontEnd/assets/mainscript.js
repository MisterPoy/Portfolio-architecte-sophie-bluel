export {};

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


///// CODE DE GESTION DE LA MODALE

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


const token = localStorage.getItem('token');
console.log(token)


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

function closeModaleWithXmark (){
  xmark.forEach((xmark)=>{
    xmark.addEventListener("click", function() {
      closeModale();
    });
  }); 
};

if (window.location.pathname.endsWith("edition.html")){ 
  launchModalButton.addEventListener('click', function(){
    modaleWindows.style.display='flex';
    displayWorksModale(worksArray);  
    closeModaleWithXmark();
  });
  
} 


//FONCTION POUR FERMER LA MODALE
function closeModale (){
  modaleWindows.style.display='none';
  
}

// GESTION DU LOGOUT
const logOut = document.querySelector(".logOut");
logOut.addEventListener('click', function (event) {
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
  }
    }
});




console.log(deleteWorkBtn);

console.log(worksArray);

console.log(worksArray[9]);

// CHANGER DE MODALE EN CLIQUANT SUR "AJOUTER PHOTO"

const addPictureBtn = document.querySelector(".ajout-photo_box");
console.log(addPictureBtn);
addPictureBtn.addEventListener ('click', function(){
  modale.style.display = 'none';
  modaleAddWork.style.display = 'flex';
});


//////////////////// MODALE AJOUT DE PROJET
const uploadWork = document.getElementById('uploadWork');
console.log(uploadWork);
const imgPreviewBox = document.querySelector('.imgPreviewBox');
const imgBoxcontent = document.querySelector('.imgBoxContent');
const imgPreview = document.querySelector('.imgPreview');
console.log(imgPreview);

const goBack = document.querySelector('.arrow-goback_container');
console.log(goBack);
// REVENIR A LA PRECEDENTE MODALE EN CLIQUANT SUR LA FLECHE DE RETOUR

goBack.addEventListener('click', function(){
  modaleAddWork.style.display = 'none';
  modale.style.display = 'flex';
})

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