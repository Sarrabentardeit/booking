const User = require('../models/users');
const bcrypt = require('bcryptjs');
const { createError } = require('../utils/error'); 
const jwt = require('jsonwebtoken')


module.exports.register = async (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });

        await newUser.save();
        res.status(200).send("User has been created.");
    } catch (err) {
        next(err);
    }
};


  module.exports.login = async (req, res, next) => {
    try {
      // 1. Trouver l'utilisateur par email
      const user = await User.findOne({ email: req.body.email });
      if (!user) return next(createError(404, "User not found!"));
  
      // 2. Vérifier le mot de passe
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return next(createError(400, "Wrong password or username!"));
  
      // 3. Générer le token avec ID + isAdmin
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT
      );
  
      // 4. Séparer les données à retourner (on masque le mot de passe)
      const { password, isAdmin, ...otherDetails } = user._doc;
  
      // 5. Envoyer le token en cookie + retour des infos utilisateur
      res
        .cookie("access_token", token, {
          httpOnly: true, // Ne peut pas être lu par JS client
        })
        .status(200)
        .json({ ...otherDetails, isAdmin }); // tu peux renvoyer isAdmin ici
  
    } catch (err) {
      next(err);
    }
  };