const express = require("express");
const route = express.Router();

const herbicideControllers = require("../controllers/herbicide");

const { check } = require("express-validator");

route.post("/ajout", herbicideControllers.ajout);

route.patch("/:id", herbicideControllers.updateHerbicide);

route.get("/", herbicideControllers.getHerbicide);
route.get("/:id", herbicideControllers.getHerbicideById);
route.delete("/:id", herbicideControllers.deleteHerbicide);
route.get("/mauvaiseHerbe/:id", herbicideControllers.getHerbicideByMauvaiseHerbeId);

module.exports = route;
