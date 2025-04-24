const apiBase = 'http://localhost:7000/api';
const hotelApi = 'http://localhost:7000/api/hotels';

/* 🔐 Authentification */
async function login(email, password) {
  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  return res;
}

async function register(username, email, password) {
  const res = await fetch(`${apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return res;
}

/* 📦 API Hôtels / Utilisateurs / Chambres */
async function fetchHotels() {
  const res = await fetch(`${apiBase}/hotels`, { credentials: 'include' });
  return res.json();
}

async function createHotel(hotel) {
  const res = await fetch(`${apiBase}/hotels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(hotel)
  });
  return res;
}

async function fetchUsers() {
  const res = await fetch(`${apiBase}/users`, { credentials: 'include' });
  return res.json();
}

async function fetchRooms() {
  const res = await fetch(`${apiBase}/rooms`, { credentials: 'include' });
  return res.json();
}

async function deleteRoom(id, hotelId) {
  const res = await fetch(`${apiBase}/rooms/${id}/${hotelId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  return res.json();
}

/* 🚪 Déconnexion */
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

window.addEventListener("DOMContentLoaded", () => {
  const restrictedPages = ["dashboard.html", "hotels.html", "rooms.html"];
  const user = JSON.parse(localStorage.getItem("user"));

  if (restrictedPages.some(page => window.location.pathname.includes(page))) {
    if (!user || !user.isAdmin) {
      alert("Accès refusé. Administrateur uniquement.");
      localStorage.removeItem("user");
      window.location.href = "index.html";
    }
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('userCount')) {
    try {
      const users = await fetchUsers();
      const rooms = await fetchRooms();
      document.getElementById('userCount').textContent = users.length;
      document.getElementById('roomCount').textContent = rooms.length;
    } catch (e) {
      console.error("Erreur chargement des stats", e);
    }
  }
});

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await login(email, password);
    const user = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(user));
      alert("Connecté !");
      if (user && user.isAdmin) {
        window.location.href = "/admin/dashboard.html";
      } else {
        window.location.href = "/client/index.html";
      }
    } else {
      alert(user.message || "Erreur de connexion");
    }
  });
}

if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const res = await register(username, email, password);
    if (res.ok) {
      alert("Inscription réussie");
      window.location.href = 'index.html';
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

if (document.getElementById('hotelForm')) {
  document.getElementById('hotelForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const address = document.getElementById('address').value;
    const res = await createHotel({ name, city, address });
    if (res.ok) {
      alert("Hôtel ajouté !");
      window.location.href = 'hotels.html';
    } else {
      const data = await res.json();
      alert(data.message);
    }
  });
}

if (document.getElementById('hotelList')) {
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const hotels = await fetchHotels();
      const list = document.getElementById('hotelList');
      hotels.forEach(h => {
        const item = document.createElement('li');
        item.textContent = `${h.name} – ${h.city}`;
        list.appendChild(item);
      });
    } catch (err) {
      alert("Erreur lors du chargement des hôtels");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      alert("Déconnexion réussie.");
      window.location.href = "index.html";
    });
  }
});

if (window.location.pathname.includes("rooms.html")) {
  async function fetchRoomList() {
    const rooms = await fetchRooms();
    const hotels = await fetchHotels();
    const hotelMap = {};
    hotels.forEach(h => hotelMap[h._id] = h.name);

    const tbody = document.getElementById('roomList');
    tbody.innerHTML = '';

    rooms.forEach(room => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${room.title}</td>
        <td>${room.price} DT</td>
        <td>${room.maxPeople}</td>
        <td>${room.desc}</td>
        <td>${hotelMap[room.hotelId] || 'Non spécifié'}</td>
        <td>
          <button class="btn btn-edit btn-sm btn-action" onclick='editRoom(${JSON.stringify(room)})'>
            <i class="fas fa-pen"></i> Modifier
          </button>
          <button class="btn btn-delete btn-sm btn-action" onclick='handleDelete("${room._id}", "${room.hotelId || ''}")'>
            <i class="fas fa-trash"></i> Supprimer
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function editRoom(room) {
    localStorage.setItem('editRoom', JSON.stringify(room));
    window.location.href = 'room-form.html';
  }

  async function handleDelete(id, hotelId) {
    if (confirm("Voulez-vous supprimer cette chambre ?")) {
      await deleteRoom(id, hotelId);
      fetchRoomList();
    }
  }

  window.addEventListener("DOMContentLoaded", fetchRoomList);
}

if (window.location.pathname.includes("room-form.html")) {
  async function fetchHotels() {
    const res = await fetch(hotelApi);
    return res.json();
  }

  async function populateHotels() {
    const hotels = await fetchHotels();
    const hotelSelect = document.getElementById('hotelId');
    hotels.forEach(hotel => {
      const option = document.createElement('option');
      option.value = hotel._id;
      option.textContent = hotel.name;
      hotelSelect.appendChild(option);
    });
  }

  async function createRoom(room, hotelId) {
    const res = await fetch(`${apiBase}/rooms/${hotelId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
    return res.json();
  }

  async function updateRoom(id, room) {
    const res = await fetch(`${apiBase}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
    return res.json();
  }

  function fillFormIfEditing() {
    const room = JSON.parse(localStorage.getItem('editRoom'));
    if (!room) return;

    document.getElementById('roomId').value = room._id;
    document.getElementById('title').value = room.title;
    document.getElementById('price').value = room.price;
    document.getElementById('maxPeople').value = room.maxPeople;
    document.getElementById('desc').value = room.desc;
    document.getElementById('hotelId').value = room.hotelId || '';
    localStorage.removeItem('editRoom');
  }

  document.getElementById('roomForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('roomId').value;
    const room = {
      title: document.getElementById('title').value,
      price: document.getElementById('price').value,
      maxPeople: document.getElementById('maxPeople').value,
      desc: document.getElementById('desc').value
    };
    const hotelId = document.getElementById('hotelId').value;

    if (id) await updateRoom(id, room);
    else await createRoom(room, hotelId);

    window.location.href = 'rooms.html';
  });

  window.addEventListener('DOMContentLoaded', () => {
    populateHotels();
    fillFormIfEditing();
  });
}



if (window.location.pathname.includes("hotel-form.html")) {
  const apiBase = 'http://localhost:7000/api';
  const hotelForm = document.getElementById("hotelForm");
  const editData = JSON.parse(localStorage.getItem("editHotel"));

  if (editData) {
    document.getElementById("formTitle") && (document.getElementById("formTitle").textContent = "Modifier un hôtel");
    document.getElementById("hotelId").value = editData._id;
    document.getElementById("name").value = editData.name;
    document.getElementById("type").value = editData.type;
    document.getElementById("title").value = editData.title;
    document.getElementById("desc").value = editData.desc;
    document.getElementById("city").value = editData.city;
    document.getElementById("address").value = editData.address;
    document.getElementById("distance").value = editData.distance;
    document.getElementById("cheapestPrice").value = editData.cheapestPrice;
    document.getElementById("featured").value = editData.featured ? "true" : "false";
  }

  hotelForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("hotelId")?.value;

    const hotel = {
      name: document.getElementById("name").value,
      type: document.getElementById("type").value,
      title: document.getElementById("title").value,
      desc: document.getElementById("desc").value,
      city: document.getElementById("city").value,
      address: document.getElementById("address").value,
      distance: document.getElementById("distance").value,
      cheapestPrice: Number(document.getElementById("cheapestPrice").value),
      featured: document.getElementById("featured").value === "true",
      photos: [],
      rooms: []
    };

    const url = id ? `${apiBase}/hotels/${id}` : `${apiBase}/hotels`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(hotel)
    });

    if (res.ok) {
      alert(`Hôtel ${id ? 'modifié' : 'ajouté'} avec succès !`);
      localStorage.removeItem("editHotel");
      window.location.href = "hotels.html";
    } else {
      const err = await res.json();
      alert("Erreur: " + (err.message || JSON.stringify(err)));
    }
  });
}
