const loginUrl = 'http://localhost:5678/api/users/login';

const loginForm = document.querySelector('#login-form');
const errorMessage = document.querySelector('#error-message');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // empêche le rechargement de la page par défaut

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Identifiants incorrects');
    }

    const data = await response.json();

    // On stocke le token pour les futures requêtes protégées
    localStorage.setItem('token', data.token);

    // Redirection vers la page d'accueil
    window.location.href = 'index.html';

  } catch (error) {
    console.error('Erreur de connexion :', error);
    errorMessage.textContent = 'Email ou mot de passe incorrect';
  }
});