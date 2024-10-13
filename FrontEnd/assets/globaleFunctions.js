


function displayWorks(works) {
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
};



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
};


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
};


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
};


function closeModale (){
  modaleWindows.style.display='none';
  
}
