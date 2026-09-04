// Récupération des éléments de la modale
const modalOverlay = document.querySelector('#modal-overlay');
const modalCloseBtn = document.querySelector('#modal-close');
const editBtn = document.querySelector('#edit-btn');

const galleryView = document.querySelector('#modal-gallery-view');
const formView = document.querySelector('#modal-form-view');
const backBtn = document.querySelector('#modal-back');

// Ouvrir la modale au clic sur "modifier"
editBtn.addEventListener('click', () => {
  modalOverlay.style.display = 'flex';
  galleryView.style.display = 'block';
  formView.style.display = 'none';
  displayModalGallery(allWorks);
});

// Fermer la modale au clic sur la croix
modalCloseBtn.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});

// Fermer la modale au clic en dehors (sur l'overlay, pas sur la boîte blanche)
modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});

const modalGallery = document.querySelector('#modal-gallery');

function displayModalGallery(works) {
  modalGallery.innerHTML = '';

  works.forEach(work => {
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteIcon.dataset.id = work.id;

    figure.appendChild(img);
    figure.appendChild(deleteIcon);
    modalGallery.appendChild(figure);
  });
}

const addPhotoBtn = document.querySelector('#add-photo-btn');

// Basculer vers la vue formulaire
addPhotoBtn.addEventListener('click', () => {
  galleryView.style.display = 'none';
  formView.style.display = 'block';
});

// Revenir à la vue galerie
backBtn.addEventListener('click', () => {
  formView.style.display = 'none';
  galleryView.style.display = 'block';
});

// Gérer la suppression au clic sur une icône poubelle
modalGallery.addEventListener('click', async (event) => {
  if (event.target.closest('.delete-icon')) {
    const deleteIcon = event.target.closest('.delete-icon');
    const workId = deleteIcon.dataset.id;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // On retire le travail supprimé de allWorks (mémoire globale)
      allWorks = allWorks.filter(work => work.id !== Number(workId));

      // On met à jour les deux galeries (modale + page d'accueil)
      displayModalGallery(allWorks);
      displayGallery(allWorks);

    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  }
});

const categorySelect = document.querySelector('#photo-category');

function fillCategorySelect(categories) {
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

const photoFileInput = document.querySelector('#photo-file');
const previewImage = document.querySelector('#preview-image');
const uploadIcon = document.querySelector('.upload-icon');
const uploadLabel = document.querySelector('.upload-label');
const uploadInfo = document.querySelector('.upload-info');

photoFileInput.addEventListener('change', () => {
  const file = photoFileInput.files[0];

  if (file) {
    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl;
    previewImage.style.display = 'block';

    // On cache les éléments par défaut de la zone d'upload
    uploadIcon.style.display = 'none';
    uploadLabel.style.display = 'none';
    uploadInfo.style.display = 'none';
  }
});

const addPhotoForm = document.querySelector('#add-photo-form');

addPhotoForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.querySelector('#photo-title').value;
  const category = document.querySelector('#photo-category').value;
  const image = photoFileInput.files[0];
  const token = localStorage.getItem('token');

  const formData = new FormData();
  formData.append('image', image);
  formData.append('title', title);
  formData.append('category', category);

  try {
    const response = await fetch(worksUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout de la photo');
    }

    console.log('Photo ajoutée avec succès');

  } catch (error) {
    console.error(error);
  }
});