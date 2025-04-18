const router = require('express').Router();
const userController = require('../controllers/user.controller');


const { verifyUser , verifyAdmin, verifyToken} = require('../utils/verifyToken');



//router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  //  res.send("hello user, you are logged in and you can delete your account");
  //});
  

/*router.get("/checkauthentication" , verifyToken , (req,res,next)=>{
res.send("helo you are autheti")
});

router.get("/checkadmin/:id" , verifyAdmin , (req,res,next)=>{
    res.send("helo admin you are autheti AND YPOU CAN demlte all account")
    });*/

  //UPDATE
  router.put("/:id",verifyUser ,userController.updateUser)
  
  //DELETE
  router.delete("/:id",verifyUser ,userController.deleteUser)
    
  //recupere  avec id 
  router.get("/:id",verifyUser ,userController.userInfo)
  
  router.get("/",verifyAdmin,userController.getAllUsers)

module.exports = router;
