//declaration d'un tableau vide pour acceuillir les catégories
let categoriesArray = [];

let worksFilters_container = document.querySelector(".worksFilters_container");

//on vide le html du container des filtres
worksFilters_container.innerHTML = "";

// on récupère les données de l'api pour les catégorie, convertis en Tableau dans la constante categoriesArray 
const reponse = await fetch("http://localhost:5678/api/categories");
categoriesArray = await reponse.json();

// on rajoute une catégorie au début du tableau pour TOUS sur le même modèle, avec une id de 0 et un name "tous"
let tousFilter = {"id": 0, "name": "Tous" };
categoriesArray.unshift(tousFilter);
console.log(categoriesArray);

//boucle pour créer un élément html <button> pour chaque élément de categoriesArray, enfant du container principal et ayant un text qui correspond
//au name de chaque catégorie



for (let i = 0; i < categoriesArray.length; i++) {
  let categorie = categoriesArray[i];
  let categoriesBtn = document.createElement("button");
  worksFilters_container.appendChild(categoriesBtn);
  categoriesBtn.innerText = categorie.name;
  categoriesBtn.classList.add("filterBtn");
  categoriesBtn.dataset.id = categorie.id;

  categoriesBtn.addEventListener("click", function(){
    let allFiltersBtn = document.querySelectorAll(".filterBtn");
    for (let i = 0; i < allFiltersBtn.length; i++) {
      allFiltersBtn[i].classList.remove("filterBtnActived");
    }
    categoriesBtn.classList.add("filterBtnActived");
  } );
}
console.log(categoriesArray);

// declaration globale worksArray en tableau vide afin qu'il soit remplit par la reponse.json()
let worksArray = [];

const reponseWorks = await fetch("http://localhost:5678/api/works");
worksArray = await reponseWorks.json();

let gallery = document.querySelector(".gallery");

// erase html gallery
gallery.innerHTML = "";

for (let i = 0; i < worksArray.length; i++) {

  const work = worksArray[i];

  const worksFiles = document.createElement("figure");
  gallery.appendChild(worksFiles);
  const worksImg = document.createElement("img");
  worksImg.src = work.imageUrl;
  worksFiles.appendChild(worksImg);
  const worksTitle = document.createElement("figcaption");
  worksTitle.innerText = work.title;
  worksFiles.appendChild(worksTitle);

}

console.log(categoriesArray);