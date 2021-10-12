const express = require("express");
const route = express.Router();

const ingenieurControllers = require("../controllers/ingenieur");

const { check } = require("express-validator");

route.patch(
  "/forgetPassword",
  check("email").normalizeEmail(),
  ingenieurControllers.forgetPassword
);

route.post(
  "/signup",
  check("name").not().isEmpty(),
  check("tel").not().isEmpty(),
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  ingenieurControllers.signup
);

route.post(
  "/login",
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  ingenieurControllers.login
);

route.patch(
  "/:id",
  check("name").not().isEmpty(),
  check("tel").not().isEmpty(),
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  ingenieurControllers.updateIngenieur
);

route.get("/", ingenieurControllers.getIngenieur);
route.delete("/:id", ingenieurControllers.deleteIngenieur);

module.exports = route;
