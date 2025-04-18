const router = require('express').Router();

const roomController = require('../controllers/room.controller')
const { verifyUser , verifyAdmin, verifyToken} = require('../utils/verifyToken');


//CREATe
router.post("/:hotelid",verifyAdmin,roomController.createRoom)

//UPDATE
router.put("/:id",verifyAdmin,roomController.updateRoom)

//DELETE
router.delete("/:id/:hotelid",verifyAdmin,roomController.deleteRoom)
  
//recupere hotels avec id 
router.get("/:id",roomController.roomInfo)

router.get("/",roomController.getAllRooms)

module.exports = router;
