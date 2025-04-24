const Reservation = require('../models/reservation');

exports.createReservation = async (req, res) => {
  try {
    const { userId, roomId, checkin, checkout } = req.body;

    // Vérification de conflit de dates
    const conflict = await Reservation.findOne({
      roomId,
      $or: [
        { checkin: { $lt: checkout }, checkout: { $gt: checkin } }
      ]
    });
    if (conflict) {
      return res.status(400).json({ message: 'Chambre déjà réservée à ces dates' });
    }

    const reservation = new Reservation({ userId, roomId, checkin, checkout });
    const saved = await reservation.save();
    res.status(200).json(saved);
  } catch (err) {
    console.error("Erreur lors de la réservation:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('userId roomId');
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du chargement des réservations' });
  }
};