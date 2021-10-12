const express = require("express");
const route = express.Router();

const reponseController = require("../controllers/reponse");

const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

route.post("/ajout", fileUpload.single("image"), reponseController.ajout);
route.post(
  "/adulte/:id",
  fileUpload.single("image"),
  reponseController.updateImageAdulte
);
route.post(
  "/avance/:id",
  fileUpload.single("image"),
  reponseController.updateImageAvance
);

module.exports = route;
