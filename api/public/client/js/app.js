// dom controllers
const promoHandler = document.getElementById('promo');
const promoHolder = document.getElementById('promo-holder');
const promoCloser = document.getElementById('promo-closer');

promoHandler.addEventListener('click', () => {
    promoHolder.classList.toggle('active');
    promoHandler.classList.toggle('inactive');
});

promoCloser.addEventListener('click', () => {
    promoHolder.classList.toggle('active');
    promoHandler.classList.toggle('inactive');
});

async function bookRoom(hotelId, roomId) {
    const checkIn = document.getElementById("checkin").value;
    const checkOut = document.getElementById("checkout").value;
    const guests = document.getElementById("guests").value;
    const userId = JSON.parse(localStorage.getItem("user"))._id;
  
    const res = await fetch("http://localhost:7000/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        hotelId,
        roomId,
        checkIn,
        checkOut,
        guests
      })
    });
  
    const data = await res.json();
    if (res.ok) {
      alert("Réservation confirmée !");
    } else {
      alert("Erreur : " + data.message);
    }
  }