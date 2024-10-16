export {};

//////////////////     CHECKING TOKEN ON PAGE LOAD     ///////////////////
const userToken = localStorage.getItem("token");

  //  CURRENT PAGE
const currentPage = window.location.pathname;

if ( (userToken && currentPage.includes("login.html")) || (userToken && currentPage.includes("index.html")) ) {
  window.location.href = 'index_edition.html';
} else if (!userToken && currentPage.endsWith("index_edition.html")){
  alert("Vous n'avez pas l'autorisation nécessaire pour accéder à cette page, veuillez vous reconnecter." )
  window.location.href = 'login.html';
}; 

///////////////////     WORK'S GESTION     ///////////////////
let worksArray = [];

  //  API REQUEST AND WORK'S GALERY CONSTRUCT
let worksResponse  = await fetch("http://localhost:5678/api/works");
worksArray = await worksResponse.json();
 
const gallery = document.querySelector(".gallery");

// DISPLAY WORKS FUNCTION
function displayWorks(works) {
  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

    const workFigure = document.createElement("figure");
    const worksImg = document.createElement("img");
    worksImg.src = work.imageUrl;
    worksImg.alt = work.title;
    workFigure.appendChild(worksImg);
    const worksTitle = document.createElement("figcaption");
    worksTitle.innerText = work.title;
    workFigure.appendChild(worksTitle);
    gallery.appendChild(workFigure);
  }
}
displayWorks(worksArray);

///////////////////     CREATION OF FILTERS BY CATEGORIES     ///////////////////

let categoriesArray = [];

  //  API REQUEST FOR CATEGORIES
const reponse = await fetch("http://localhost:5678/api/categories");
categoriesArray = await reponse.json();

  //  ADD "ALL" CATEGORIE
categoriesArray.unshift({ id: 0, name: "Tous" });

//  CREATION OF FILTER BUTTONS
const worksFiltersContainer = document.querySelector(".worksFilters_container");
function createFilterBtn(categories) { 
 
  worksFiltersContainer.innerHTML = "";
  
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
};

  //  FILTER BTN CREATE WHEN THE PAGE IS INDEX.HTML
if (window.location.pathname.endsWith("index.html")){
  createFilterBtn(categoriesArray);
};

//  FILTER WORKS BY CATEGORIES FUNCTION
function filterWorksByCategories(categoryId) {

  if (categoryId === 0) {
    displayWorks(worksArray);

  } else {
    const filteredWorks = worksArray.filter(
      (work) => work.categoryId === categoryId
    );

    displayWorks(filteredWorks);
    }
};
