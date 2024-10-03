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


// VARIABLE ET FONCTION POUR OUVRIR LA MODALE
const launchModalButton = document.querySelector('.modify_button');
console.log(launchModalButton);
const modaleWindows = document.querySelector('.modale_main-container');
console.log(modaleWindows);
const modale = document.querySelector('.modale');
console.log(modale);

if (window.location.pathname.endsWith("edition.html")){ 
  launchModalButton.addEventListener('click', function(){
    modaleWindows.id = '';
    console.log("Hello there !")
  });
}



//TEST DE CODE POUR FERMER LA MODALEAVEC LA CROIX
function closeModaleWithXmark (){
  let xmark = document.querySelector('.fa-xmark');
  console.log(xmark);


  xmark.addEventListener("click", function() {
    modaleWindows.id = 'modaleContainer'
  })
}
if (window.location.pathname.endsWith("edition.html")){
  closeModaleWithXmark();
}





/* curl -X 'POST' \
  'http://localhost:5678/api/users/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "string",
  "password": "string"
}' */