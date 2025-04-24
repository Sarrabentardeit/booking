const express = require('express');
const mongoose = require('mongoose');
const authRoute = require ("./routes/auth");
const usersRoute = require ("./routes/users");
const hotelsRoute = require ("./routes/hotels");
const roomsRoute = require ("./routes/rooms");
const reservationsRoute = require('./routes/reservations');

const path = require("path");

const cookieParser = require('cookie-parser');


const app = express();

app.use(express.json());
app.use(cookieParser()); 
//routes 
app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/rooms",roomsRoute);
app.use('/api/reservations', reservationsRoute);

app.use(express.static(path.join(__dirname, "public")));
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  });
});


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(err => {
    console.log('Error connecting to database', err);
  });

// Lancer le serveur
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
