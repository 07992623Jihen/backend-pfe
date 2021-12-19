const express = require("express");
const route = express.Router();

const demandeTraitementControllers = require("../controllers/demande-traitement");

const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

route.post(
  "/ajout",
  fileUpload.single("image"),
  [check("type").not().isEmpty()],
  demandeTraitementControllers.ajout
);

route.get('/',demandeTraitementControllers.getDemandeDeTraitement)
route.get('/agriculteur/:id',demandeTraitementControllers.getDemandeByAgriculteurId)


module.exports = route;
