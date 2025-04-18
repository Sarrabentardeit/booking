const hotels = require('../models/hotels');
const Hotel= require('../models/hotels');

const createError = require('../utils/error');

//create
module.exports.createHotel = async (req, res) => {
    const newHotel = new Hotel(req.body);

    try {
      const savedHotel = await newHotel.save();
      res.status(200).json(savedHotel);
    } catch (err) {
      res.status(500).json(err);
    }
};


//uodate
module.exports.updateHotel = async (req, res) => {


    try {
        const updateHotel = await Hotel.findByIdAndUpdate(
            req.params.id, {$set: req.body} , {new: true});
            if (!updateHotel) {
                return res.status(404).send("Hotel not found");
              }
           res.status(200).json(updateHotel);
    } catch (err) {
        console.log("Update error: ", err);
        res.status(500).send("Error updating the post");    }
};

//supprimer

module.exports.deleteHotel = async (req, res) => {

    try {
      const deleteHotel = await Hotel.findByIdAndDelete(req.params.id);
  
      if (!deleteHotel) {
        return res.status(404).send("Hotel not found");
      }
  
      res.status(200).json(deleteHotel);
    } catch (err) {
      console.log("Delete error: ", err);
      res.status(500).send("Error deleting the Hotel");
    }
  };
  //get by id 
  

module.exports.hotelInfo = async (req, res) => {

    try {
      const hotelInfo = await Hotel.findById(req.params.id);
  
      if (!hotelInfo) {
        return res.status(404).send("Hotel not found");
      }
  
      res.status(200).json(hotelInfo);
    } catch (err) {
      console.log("info error: ", err);
      res.status(500).send("Error in recuppering the Hotel");
    }
  };

  //get all getAllHotels
  module.exports.getAllHotels = async (req, res) => {

    try {
      const getAllHotels = await Hotel.find();
  
      if (!getAllHotels) {
        return res.status(404).send("Hotel not found");
      }
  
      res.status(200).json(getAllHotels);
    } catch (err) {
      console.log("info error: ", err);
      res.status(500).send("Error in recuppering the Hotel");
    }
  };
//count cities 
module.exports.countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");  // Assurez-vous que 'cities' est bien passé dans la query, comme 'cities=madrid,turkey'
  
  try {
    const list = await Promise.all(
      cities.map(city => {
        return Hotel.countDocuments({ city: city });  // Comptage des hôtels par ville
      })
    );
    res.status(200).json(list);  // Retour des résultats sous forme de tableau
  } catch (err) {
    next(err);  // Gérer l'erreur
  }
};


  