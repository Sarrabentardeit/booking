const User= require('../models/users');

const createError = require('../utils/error');




//uodate
module.exports.updateUser = async (req, res) => {


    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id, {$set: req.body} , {new: true});
            if (!updateUser) {
                return res.status(404).send("User not found");
              }
           res.status(200).json(updateUser);
    } catch (err) {
        console.log("Update error: ", err);
        res.status(500).send("Error updating the user");    }
};

//supprimer

module.exports.deleteUser = async (req, res) => {

    try {
      const deleteUser  = await User.findByIdAndDelete(req.params.id);
  
      if (!deleteUser ) {
        return res.status(404).send("user not found");
      }
  
      res.status(200).json(deleteUser);
    } catch (err) {
      console.log("Delete error: ", err);
      res.status(500).send("Error deleting the User");
    }
  };
  //get by id 
  

module.exports.userInfo = async (req, res) => {

    try {
      const userInfo = await User.findById(req.params.id);
  
      if (!userInfo) {
        return res.status(404).send("user not found");
      }
  
      res.status(200).json(userInfo);
    } catch (err) {
      console.log("info error: ", err);
      res.status(500).send("Error in recuppering the User");
    }
  };

  //get all getAllHotels

  module.exports.getAllUsers = async (req, res) => {

    try {
      const getAllUsers= await User.find();
  
      if (!getAllHotels) {
        return res.status(404).send("Hotel not found");
      }
  
      res.status(200).json(getAllUsers);
    } catch (err) {
      console.log("info error: ", err);
      res.status(500).send("Error in recuppering the User");
    }
  };
