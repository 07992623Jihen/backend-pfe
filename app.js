const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');


const httperror = require("./models/error");
const agriculteurRoutes = require("./routes/agriculteur");
const ingenieurRoutes = require("./routes/ingenieur");
const mauvaiseHerbeRoutes = require("./routes/mauvaiseHerbe");
const herbicideRoutes = require("./routes/herbicide");
const demandeTraitementRoutes = require("./routes/demande-traitement");
const reponseRoute = require("./routes/reponse");
const adminRoutes = require("./routes/admin");
const messageRoute = require("./routes/message");


app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/agriculteur", agriculteurRoutes);
app.use("/api/ingenieur", ingenieurRoutes);
app.use("/api/mauvaiseHerbe", mauvaiseHerbeRoutes);
app.use("/api/herbicide", herbicideRoutes);
app.use("/api/demandeTraitement", demandeTraitementRoutes);
app.use("/api/reponse", reponseRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/message", messageRoute);



app.use((req, res, next) => {
  const error = new httperror("could not find that page", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error occurred " });
});

mongoose
  .connect(
    "mongodb+srv://jihen:jihen@cluster0.dyzgh.mongodb.net/Mherbe?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
