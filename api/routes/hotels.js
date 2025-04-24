const router = require('express').Router();
const hotelsController = require('../controllers/hotels.controller')
const { verifyUser , verifyAdmin, verifyToken} = require('../utils/verifyToken');


//CREATe
router.post("/",verifyAdmin,hotelsController.createHotel)

//UPDATE
router.put("/:id",verifyAdmin,hotelsController.updateHotel)

//DELETE
router.delete("/find/:id",verifyAdmin,hotelsController.deleteHotel)
  
//recupere hotels avec id 
router.get("/:id",hotelsController.hotelInfo)
router.get('/',hotelsController.getAllHotels);
router.get("/countByCity",hotelsController.countByCity)

module.exports = router;
