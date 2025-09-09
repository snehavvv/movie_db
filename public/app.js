async function fetchMovies() {
  const res = await fetch('/movies');
  return res.json();
}

function renderMovies(movies) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <button id="addBtn" class="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Add Movie</button>
    <table class="min-w-full bg-white rounded shadow">
      <thead>
        <tr>
          <th class="py-2">Title</th>
          <th class="py-2">Director</th>
          <th class="py-2">Genre</th>
          <th class="py-2">Year</th>
          <th class="py-2">Rating</th>
          <th class="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${movies.map(movie => `
          <tr>
            <td class="border px-2 py-1">${movie.title}</td>
            <td class="border px-2 py-1">${movie.director}</td>
            <td class="border px-2 py-1">${movie.genre}</td>
            <td class="border px-2 py-1">${movie.release_year}</td>
            <td class="border px-2 py-1">${movie.rating}</td>
            <td class="border px-2 py-1">
              <button class="editBtn bg-yellow-400 px-2 py-1 rounded mr-2" data-id="${movie.id}">Edit</button>
              <button class="deleteBtn bg-red-500 text-white px-2 py-1 rounded" data-id="${movie.id}">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div id="formContainer"></div>
  `;
  document.getElementById('addBtn').onclick = showAddForm;
  document.querySelectorAll('.editBtn').forEach(btn => btn.onclick = () => showEditForm(btn.dataset.id));
  document.querySelectorAll('.deleteBtn').forEach(btn => btn.onclick = () => deleteMovie(btn.dataset.id));
}

function showAddForm() {
  showForm();
}

function showEditForm(id) {
  fetch(`/movies`).then(res => res.json()).then(movies => {
    const movie = movies.find(m => m.id == id);
    showForm(movie);
  });
}

function showForm(movie = {}) {
  const formContainer = document.getElementById('formContainer');
  formContainer.innerHTML = `
    <form id="movieForm" class="mt-4 bg-gray-50 p-4 rounded shadow">
      <input type="hidden" name="id" value="${movie.id || ''}">
      <div class="mb-2">
        <input name="title" placeholder="Title" value="${movie.title || ''}" class="border p-2 w-full" required />
      </div>
      <div class="mb-2">
        <input name="director" placeholder="Director" value="${movie.director || ''}" class="border p-2 w-full" />
      </div>
      <div class="mb-2">
        <input name="genre" placeholder="Genre" value="${movie.genre || ''}" class="border p-2 w-full" />
      </div>
      <div class="mb-2">
        <input name="release_year" type="number" placeholder="Year" value="${movie.release_year || ''}" class="border p-2 w-full" />
      </div>
      <div class="mb-2">
        <input name="rating" type="number" step="0.1" min="0" max="10" placeholder="Rating" value="${movie.rating || ''}" class="border p-2 w-full" />
      </div>
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">${movie.id ? 'Update' : 'Add'} Movie</button>
      <button type="button" id="cancelBtn" class="ml-2 px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
    </form>
  `;
  document.getElementById('cancelBtn').onclick = () => formContainer.innerHTML = '';
  document.getElementById('movieForm').onsubmit = submitForm;
}

async function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  const method = data.id ? 'PUT' : 'POST';
  const url = data.id ? `/movies/${data.id}` : '/movies';
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  document.getElementById('formContainer').innerHTML = '';
  loadMovies();
}

async function deleteMovie(id) {
  if (!confirm('Delete this movie?')) return;
  await fetch(`/movies/${id}`, { method: 'DELETE' });
  loadMovies();
}

function loadMovies() {
  fetchMovies().then(renderMovies);
}

loadMovies();
