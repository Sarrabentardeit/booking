const Room = require('../models/rooms');
const Hotel = require('../models/hotels');
const { createError } = require('../utils/error'); 
// create

module.exports.createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);
  
    try {
      const savedRoom = await newRoom.save();
  
      try {
        
        await Hotel.findByIdAndUpdate(hotelId, {
          $push: { rooms: savedRoom._id },
        });
      } catch (error) {
        return next(error);
      }
  
      res.status(200).json(savedRoom);
    } catch (err) {
      next(err); 
    }
  };

//uodate
module.exports.updateRoom = async (req, res) => {


    try {
        const updateRoom  = await Room.findByIdAndUpdate(
            req.params.id, {$set: req.body} , {new: true});
            if (!updateRoom ) {
                return res.status(404).send("Room not found");
              }
           res.status(200).json(updateRoom );
    } catch (err) {
        console.log("Update error: ", err);
        res.status(500).send("Error updating the Room");    }
};

//supprimer

module.exports.deleteRoom = async (req, res) => {
    const hotelId = req.params.hotelid;

    try {
      const deleteRoom = await Room.findByIdAndDelete(req.params.id);
      try {
        await Hotel.findByIdAndUpdate(hotelId, {
          $pull: { rooms: req.params.id },
        });
      } catch (error) {
        return next(error);
      }
      if (!deleteRoom) {
        return res.status(404).send("Hotel not found");
      }
  
      res.status(200).json("Room has been deleted");
    } catch (err) {
      console.log("Delete error: ", err);
      res.status(500).send("Error deleting the Room");
    }
  };
  //get by id 
  

module.exports.roomInfo = async (req, res) => {

    try {
      const roomInfo = await Room.findById(req.params.id);
  
      if (!roomInfo) {
        return res.status(404).send("Room not found");
      }
  
      res.status(200).json(roomInfo);
    } catch (err) {
      console.log("info error: ", err);
      res.status(500).send("Error in recuppering the Room");
    }
  };

  //get all getAllHotels

  module.exports.getAllRooms = async (req, res) => {

    try {
      const getAllRooms = await Room.find();
  
      if (!getAllRooms) {
        return res.status(404).send("Room not found");
      }
  
      res.status(200).json(getAllRooms);
    } catch (err) {
      console.log("info error: ", err);
      res.status(500).send("Error in recuppering the Room");
    }
  };
