// URLs de l'API
const worksUrl = 'http://localhost:5678/api/works';
const categoriesUrl = 'http://localhost:5678/api/categories';

// On garde les travaux en mémoire pour pouvoir les filtrer sans re-fetch
let allWorks = [];

// Récupération des travaux depuis l'API
async function getWorks() {
  try {
    const response = await fetch(worksUrl);
    const works = await response.json();
    console.log(`${works.length} travaux récupérés avec succès`);
    allWorks = works;
    displayGallery(works);
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux :', error);
  }
}

// Récupération des catégories depuis l'API
async function getCategories() {
  try {
    const response = await fetch(categoriesUrl);
    const categories = await response.json();
    console.log(`${categories.length} catégories récupérées avec succès`);
    displayFilters(categories);
    fillCategorySelect(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
  }
}

// Génération dynamique de la galerie
function displayGallery(works) {
  const gallery = document.querySelector('#gallery');
  gallery.innerHTML = '';

  works.forEach(work => {
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Génération dynamique des boutons de filtre
function displayFilters(categories) {
  const filters = document.querySelector('#filters');
  filters.innerHTML = '';

  // Bouton "Tous" (affiché par défaut)
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.classList.add('filter-btn', 'active');
  allButton.addEventListener('click', () => {
    setActiveButton(allButton);
    displayGallery(allWorks);
  });
  filters.appendChild(allButton);

  // Un bouton par catégorie
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.classList.add('filter-btn');

    button.addEventListener('click', () => {
      setActiveButton(button);
      const filteredWorks = allWorks.filter(work => work.categoryId === category.id);
      console.log(`Filtre "${category.name}" appliqué : ${filteredWorks.length} travaux affichés`);
      displayGallery(filteredWorks);
    });

    filters.appendChild(button);
  });
}

// Gère la classe "active" sur le bouton cliqué
function setActiveButton(clickedButton) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(button => button.classList.remove('active'));
  clickedButton.classList.add('active');
}

// Lancement au chargement de la page
getWorks();
getCategories();

// Vérifie si un utilisateur est connecté et adapte l'affichage
function checkLoginStatus() {
  const token = localStorage.getItem('token');

  if (token) {
    document.querySelector('#edit-banner').style.display = 'flex';
    document.querySelector('#edit-btn').style.display = 'inline-block';
    document.querySelector('#filters').style.display = 'none';

    const loginLink = document.querySelector('#login-link');
    loginLink.textContent = 'logout';
    loginLink.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  }
}

checkLoginStatus();