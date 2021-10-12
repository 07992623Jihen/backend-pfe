const express = require("express");
const route = express.Router();

const mauvaiseHerbeControllers = require("../controllers/mauvaiseherbes");

const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

route.post(
  "/ajout",
  fileUpload.single("image"),
  [
    check("nom").not().isEmpty(),
    check("type").not().isEmpty(),
    check("description").not().isEmpty(),
  ],
  mauvaiseHerbeControllers.ajout
);

route.patch(
  "/:id",
  fileUpload.single("image"),
  [check("nom").not().isEmpty(),
  check("type").not().isEmpty(),
  check("description").not().isEmpty()],
  mauvaiseHerbeControllers.updateMauvaiseHerbe
);

route.get("/", mauvaiseHerbeControllers.getMauvaiseHerbe);
route.get("/:id", mauvaiseHerbeControllers.getMauvaiseHerbeById);
route.delete("/:id", mauvaiseHerbeControllers.deleteMauvaiseHerbe);

module.exports = route;
