export {};

//////////////////     CHECKING TOKEN ON PAGE LOAD     ///////////////////
const userToken = localStorage.getItem("token");
/* console.log(userToken); */

  //  CURRENT PAGE
const currentPage = window.location.pathname;
/* console.log(`Page actuelle: ${currentPage}`); */
if (currentPage.includes("login.html")) {
  window.location.href = "index_edition.html";
}


if ( (userToken && currentPage.includes("login.html")) || (userToken && currentPage.includes("index.html")) ) {
  window.location.href = 'index_edition.html';
} else if (!userToken && currentPage.endsWith("index_edition.html")){
  alert("Vous n'avez pas l'autorisation nécessaire pour accéder à cette page, veuillez vous reconnecter." )
  window.location.href = 'login.html';
} ; 


///////////////////     WORK'S GESTION     ///////////////////
let worksArray = [];

  //  API REQUEST AND WORK'S GALERY CONSTRUCT
const reponseWorks = await fetch("http://localhost:5678/api/works");
worksArray = await reponseWorks.json();
console.log(worksArray);
 
const gallery = document.querySelector(".gallery");

// DISPLAY WORKS FUNCTION
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
}
displayWorks(worksArray);


///////////////////     CREATION OF FILTERS BY CATEGORIES     ///////////////////

let categoriesArray = [];

  //  API REQUEST FOR CATEGORIES
const reponse = await fetch("http://localhost:5678/api/categories");
categoriesArray = await reponse.json();

  //  ADD "ALL" CATEGORIE
categoriesArray.unshift({ id: 0, name: "Tous" });

let worksFiltersContainer = document.querySelector(".worksFilters_container");

//  CREATION OF FILTER BUTTONS
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
} 

  //  FILTER BTN CREATE WHEN THE PAGE IS INDEX.HTML
if (window.location.pathname.endsWith("index.html")){
  createFilterBtn(categoriesArray);
}

//  FILTER WORKS BY CATEGORIES FUNCTION
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

//  LOGOUT MANAGEMENT
if (userToken && currentPage.includes("index_edition.html")){
  const logOut = document.querySelector(".logOut");
  logOut.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'index.html';
    localStorage.removeItem('token');
    console.log("hello");
  })
};

///////////////////     EDIT MODE     ///////////////////
 
if (window.location.pathname.endsWith("edition.html")){
  //  GLOBAL VARIABLE FOR MODAL MANAGEMENT
  const launchModalButton = document.querySelector('.modify_button');

  const modaleWindows = document.querySelector('.modale_main-container');

  const modale = document.querySelector('.modale');

  const xmark = document.querySelectorAll('.fa-xmark');
  console.log(xmark);

  const modaleAddWork = document.querySelector('.modaleAddWork');
  console.log(modaleAddWork);


  /////  MODAL MANAGEMENT  /////

  //  EVENT LISTENER FOR MODALE OPENING  
  launchModalButton.addEventListener('click', function(){
    modaleWindows.style.display ='flex';
    modaleWindows.style.opacity = '1';
    modale.style.opacity = '1';
    displayWorksModale(worksArray);  
    closeModaleWithXmark();
    submitWorkBtn.disabled = true;
  });
    

  //  MODAL GALLERY
  let modaleGallery = document.querySelector(".modale_gallery");
  console.log(modaleGallery);

  //  DELETE WORK BTN
  let deleteWorkBtn = document.querySelectorAll('.delete-work_btn');
  console.log(deleteWorkBtn);

  //  DISPLAY WORKS MODAL FUNCTION
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

      //  ADD EVENT LISTENER FOR PROJECTS DELETION ICON BUTTONS
      deleteWorkBtn.addEventListener('click', async ()=> {
        //  GET TOKEN FOR VERIFICATION
        const token = localStorage.getItem("token");
        console.log(token);
        //  DEFINE WORK ID
        const workId = work.id;

        //  API REQUEST TO DELE WORKS
        try {
          const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers :{
              Authorization: `Bearer ${token}`
            }
          });
          if (response.ok) {
          
            worksArray = worksArray.filter(work => work.id !== workId);
            displayWorksModale(worksArray);

          } else {
              console.error('Erreur lors de la suppression du projet');  
          }
        } catch (error){
          console.error(error);
        }
      });
    }
  };


  //  CLOSE MODAL FUNCTION
  function closeModale (){
    modaleWindows.style.display='none';
    
  }

  // CLOSE MODAL FUNCTION WITH DELETE BUTTON
  function closeModaleWithXmark (){
    xmark.forEach((xmark)=>{
      xmark.addEventListener("click", function() {
        closeModale();
      });
    }); 
  };




  //  CLOSE MODAL BY CLICKING OUTSIDE THE FRAME
  if (userToken && currentPage.includes("index_edition.html")) {
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
  };


  /////  WORK ADDITION MODAL  /////

  const uploadWork = document.getElementById('uploadWork');
  console.log(uploadWork);
  const imgPreviewBox = document.querySelector('.imgPreviewBox');
  const imgBoxcontent = document.querySelector('.imgBoxContent');
  const imgPreview = document.querySelector('.imgPreview');
  console.log(imgPreview);

  //  CHANGE MODAL WHEN THE "ADD PICTURE" BUTTON IS CLICKED
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

  //  BACK ARROW
  goBack.addEventListener('click', function(){
    modaleAddWork.style.display = 'none';
    modaleAddWork.style.opacity = '0'; 
    modale.style.display = 'flex';
    modale.style.opacity = '1'; 
  })


  //  CATEGORY SELECT FILTER
  const selectCategorieBox = document.getElementById('select-categorie');
  console.log(selectCategorieBox);
  
  //  CREATE CATEGORY FILTER SELECT FUNCTION
  function createCategoriesSelect (categories) {
    selectCategorieBox.innerHTML = "";

    //  ADD DEFAULT DISABLED OPTION FOR AN EMPTY FIELD
    let selectBtnDefault = document.createElement("option");
    selectCategorieBox.appendChild(selectBtnDefault);

    selectBtnDefault.value = "";
    selectBtnDefault.disabled = true;
    selectBtnDefault.selected = true;
    //  DELETE "ALL" CATEGORY IN CATEGORIES ARRAY
    categoriesArray.shift();
    console.log(categoriesArray);
    //  CREATE OPTION ELEMENT WITH CATEGORY RETURNED BY THE API
    for (let i = 0; i < categories.length; i++) {
      let categorie = categories[i];
      let selectBtn = document.createElement("option");
      selectCategorieBox.appendChild(selectBtn);
      selectBtn.innerText = categorie.name;
      selectBtn.value = categorie.id;
      selectBtn.setAttribute('name', categorie.name);
    }
  };
  createCategoriesSelect(categoriesArray);

  console.log(categoriesArray);


  //  DISPLAY THE PREVIEW IMAGE IN THE FILE INPUT FIELD
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


  //  FORM FIELD VALIDATION
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


  // FIELD VALIDATION FUNCTION

  function areFieldsValid () {
    return (
      inputFile.checkValidity() &&
      titleField.checkValidity() &&
      checkField.checkValidity()
    );
  };

  //  ARRAY WITH FIELD TO VALIDATE

  [inputFile, titleField, checkField].forEach(field =>{
    
    field.addEventListener('input',()=>{
      //  VERIFYING FIELDS WITH FUNCTION TO DISABLE OR NOT THE SUBMIT BUTTON
      if (areFieldsValid()){
        submitWorkBtn.disabled = false;  //  IF ALL FIELD ARE VALID, ACTIVATE THE SUBMIT BUTTON
      }  else {
        submitWorkBtn.disabled = true;  //  OR NOT
      }
    });
  });


  //  SUBMIT EVENT TO SEND NEW WORKS TO THE API

  addWorkForm.addEventListener ('submit', async function(event){

    event.preventDefault();
    
    let userToken = localStorage.getItem('token');

    //  CONSTRUCT FORMDATA FOR THE API REQUEST BODY 
    const formData = new FormData();
    formData.append('image', inputFile.files[0]);
    formData.append('title', titleField.value);
    formData.append('category', checkField.value);
    console.log(formData); 


    // API REQUEST FOR ADD WORKS
    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method : 'POST',
        headers : {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });
      // UPDATE WORKS ARRAY WITH ACTUAL WORKS IN BACKEND
      if (response.ok) {

        const reponseWorks = await fetch("http://localhost:5678/api/works");
        worksArray = await reponseWorks.json();
        console.log(worksArray);

        //  RESET THE FORML
        addWorkForm.reset();
        document.getElementById('uploadWork').value = '';
        imgBoxcontent.style.display = "flex";  
        imgPreviewBox.style.display = "none";
        imgPreview.src = ''; //  RESET PREVIEW
        document.getElementById('select-categorie').selectedIndex = 0; // RESET THE CATEGORY SELECT FIELD      
        
        closeModale();  //  CLOSE MODALE        
        displayWorks(worksArray);  //  UPDATE THE GALLERY WITH DISPLAY WORKS FUNCTION
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi des données', error);
      alert('Une erreur est survenue lors de la soumission. Veuillez réessayer');
    }
  });
}
