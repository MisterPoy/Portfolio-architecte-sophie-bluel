///////////////////     WORK'S GESTION     ///////////////////
let worksArray = [];

//  API REQUEST AND WORK'S GALERY CONSTRUCT
const worksResponse = await fetch("http://localhost:5678/api/works");
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

const launchModalButton = document.querySelector(".modify_button");
const modaleWindows = document.querySelector(".modale_main-container");
const modale = document.querySelector(".modale");
const xmark = document.querySelectorAll(".fa-xmark");
const modaleAddWork = document.querySelector(".modaleAddWork");

/////  MODAL MANAGEMENT  /////

//  EVENT LISTENER FOR MODALE OPENING
launchModalButton.addEventListener("click", function () {
  modaleWindows.style.display = "flex";
  modaleWindows.style.opacity = "1";
  modale.style.opacity = "1";
  displayWorksModale(worksArray);
  closeModaleWithXmark();
  submitWorkBtn.disabled = true;
});

//  MODAL GALLERY
const modaleGallery = document.querySelector(".modale_gallery");

//  DELETE WORK BTN
const deleteWorkBtn = document.querySelectorAll(".delete-work_btn");

//  DISPLAY WORKS MODAL FUNCTION
function displayWorksModale(works) {
  modaleGallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

    const workFigure = document.createElement("figure");
    const worksImg = document.createElement("img");

    worksImg.src = work.imageUrl;
    worksImg.alt = work.title;
    workFigure.appendChild(worksImg);

    const deleteWorkBtn = document.createElement("span");

    deleteWorkBtn.classList.add("delete-work_btn");
    deleteWorkBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    workFigure.appendChild(deleteWorkBtn);
    modaleGallery.appendChild(workFigure);

    //  ADD EVENT LISTENER FOR PROJECTS DELETION ICON BUTTONS
    deleteWorkBtn.addEventListener("click", async () => {
      //  GET TOKEN FOR VERIFICATION
      const token = localStorage.getItem("token");
      //  DEFINE WORK ID
      const workId = work.id;

      //  API REQUEST TO DELE WORKS
      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${workId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          worksArray = worksArray.filter((work) => work.id !== workId);
          displayWorksModale(worksArray);
        } else {
          console.error("Erreur lors de la suppression du projet");
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
}

//  CLOSE MODAL FUNCTION
function closeModale() {
  modaleWindows.style.display = "none";
}

// CLOSE MODAL FUNCTION WITH DELETE BUTTON
function closeModaleWithXmark() {
  xmark.forEach((xmark) => {
    xmark.addEventListener("click", function () {
      closeModale();
    });
  });
}

//  CLOSE MODAL BY CLICKING OUTSIDE THE FRAME
const userToken = localStorage.getItem("token");
//  CURRENT PAGE
let currentPage = window.location.pathname;

if (userToken && currentPage.includes("index_edition.html")) {
  modaleWindows.addEventListener("click", function (event) {
    if (modaleWindows.style.display === "flex") {
      const isClickOnDeleteBtn = Array.from(deleteWorkBtn).some((btn) =>
        btn.contains(event.target)
      );

      if (
        !modale.contains(event.target) &&
        !isClickOnDeleteBtn &&
        !modaleAddWork.contains(event.target)
      ) {
        closeModale();
        displayWorks(worksArray);
      }
    }
  });
}

/////  WORK ADDITION MODAL  /////

const uploadWork = document.getElementById("uploadWork");
const imgPreviewBox = document.querySelector(".imgPreviewBox");
const imgBoxcontent = document.querySelector(".imgBoxContent");
const imgPreview = document.querySelector(".imgPreview");

//  CHANGE MODAL WHEN THE "ADD PICTURE" BUTTON IS CLICKED
const addPictureBtn = document.querySelector(".ajout-photo_box");
addPictureBtn.addEventListener("click", function () {
  modale.style.display = "none";
  modale.style.opacity = "0";
  modaleAddWork.style.display = "flex";
  modaleAddWork.style.opacity = "1";
});

const goBack = document.querySelector(".arrow-goback_container");

//  BACK ARROW
goBack.addEventListener("click", function () {
  modaleAddWork.style.display = "none";
  modaleAddWork.style.opacity = "0";
  modale.style.display = "flex";
  modale.style.opacity = "1";
});

//  CATEGORY SELECT FILTER
const selectCategorieBox = document.getElementById("select-categorie");
let categoriesArray = [];

//  API REQUEST FOR CATEGORIES
const reponse = await fetch("http://localhost:5678/api/categories");
categoriesArray = await reponse.json();
//  CREATE CATEGORY FILTER SELECT FUNCTION
function createCategoriesSelect(categories) {
  selectCategorieBox.innerHTML = "";

  //  ADD DEFAULT DISABLED OPTION FOR AN EMPTY FIELD
  const selectBtnDefault = document.createElement("option");
  selectCategorieBox.appendChild(selectBtnDefault);

  selectBtnDefault.value = "";
  selectBtnDefault.disabled = true;
  selectBtnDefault.selected = true;

  //  CREATE OPTION ELEMENT WITH CATEGORY RETURNED BY THE API
  for (let i = 0; i < categories.length; i++) {
    const categorie = categories[i];
    const selectBtn = document.createElement("option");
    selectCategorieBox.appendChild(selectBtn);
    selectBtn.innerText = categorie.name;
    selectBtn.value = categorie.id;
    selectBtn.setAttribute("name", categorie.name);
  }
}
createCategoriesSelect(categoriesArray);

//  DISPLAY THE PREVIEW IMAGE IN THE FILE INPUT FIELD
uploadWork.addEventListener("change", (event) => {
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
const addWorkForm = document.getElementById("addWorkForm");
const inputFile = document.querySelector("input#uploadWork");
const titleField = document.querySelector("input#addWorkTitle");
const checkField = document.getElementById("select-categorie");
const submitWorkBtn = document.getElementById("submitWorkBtn");

// FIELD VALIDATION FUNCTION

function areFieldsValid() {
  return (
    inputFile.checkValidity() &&
    titleField.checkValidity() &&
    checkField.checkValidity()
  );
}

//  ARRAY WITH FIELD TO VALIDATE
[inputFile, titleField, checkField].forEach((field) => {
  field.addEventListener("input", () => {
    //  VERIFYING FIELDS WITH FUNCTION TO DISABLE OR NOT THE SUBMIT BUTTON
    if (areFieldsValid()) {
      submitWorkBtn.disabled = false; //  IF ALL FIELD ARE VALID, ACTIVATE THE SUBMIT BUTTON
    } else {
      submitWorkBtn.disabled = true; //  OR NOT
    }
  });
});

//  SUBMIT EVENT TO SEND NEW WORKS TO THE API

addWorkForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  let userToken = localStorage.getItem("token");

  //  CONSTRUCT FORMDATA FOR THE API REQUEST BODY
  const formData = new FormData();
  formData.append("image", inputFile.files[0]);
  formData.append("title", titleField.value);
  formData.append("category", checkField.value);

  // API REQUEST FOR ADD WORKS
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    });
    // UPDATE WORKS ARRAY WITH ACTUAL WORKS IN BACKEND
    if (response.ok) {
      let worksResponse = await fetch("http://localhost:5678/api/works");
      worksArray = await worksResponse.json();
      //  RESET THE FORML
      addWorkForm.reset();
      document.getElementById("uploadWork").value = "";
      imgBoxcontent.style.display = "flex";
      imgPreviewBox.style.display = "none";
      imgPreview.src = ""; //  RESET PREVIEW
      document.getElementById("select-categorie").selectedIndex = 0; // RESET THE CATEGORY SELECT FIELD

      closeModale(); //  CLOSE MODALE
      displayWorks(worksArray); //  UPDATE THE GALLERY WITH DISPLAY WORKS FUNCTION
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi des données", error);
    alert("Une erreur est survenue lors de la soumission. Veuillez réessayer");
  }
});

//  LOGOUT MANAGEMENT
if (userToken && currentPage.includes("index_edition.html")) {
  const logOut = document.querySelector(".logOut");
  logOut.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "index.html";
    localStorage.removeItem("token");
  });
}
