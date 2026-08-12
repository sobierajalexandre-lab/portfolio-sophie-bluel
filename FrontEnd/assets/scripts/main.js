// URL de l'API
const worksUrl = 'http://localhost:5678/api/works';

// Récupération des travaux depuis l'API
async function getWorks() {
  try {
    const response = await fetch(worksUrl);
    const works = await response.json();
    console.log(`${works.length} travaux récupérés avec succès`);
    displayGallery(works);
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux :', error);
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

// Lancement au chargement de la page
getWorks();