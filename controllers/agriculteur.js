const httpError = require("../models/error");

const agriculteur = require("../models/agriculteur");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, prenom, email, password, tel } = req.body;
  let existingAgriculteur;
  try {
    existingAgriculteur = await agriculteur.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existingAgriculteur) {
    const error = new httpError("agriculteur exist", 422);
    return next(error);
  }

  const createdagriculteur = new agriculteur({
    name,
    prenom,
    email,
    password,
    tel,
    bloque: false,
    demandeE: [],
    demandeT: [],
    messages: [],
  });

  try {
    await createdagriculteur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { agriculteurId: createdagriculteur.id, email: createdagriculteur.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res
    .status(201)
    .json({
      id: createdagriculteur.id,
      email: createdagriculteur.email,
      token: token,
    });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("ivalid input passed", 422));
  }

  const { email, password } = req.body;
  let existingAgriculteur;

  try {
    existingAgriculteur = await agriculteur.findOne({ email: email });
  } catch {
    return next(new httpError("ivalid input passed", 422));
  }
  if (!existingAgriculteur || existingAgriculteur.password !== password) {
    return next(new httpError("invalid input passed ", 422));
  }

  let token;
  try {
    token = jwt.sign(
      { id: existingAgriculteur.id, email: existingAgriculteur.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ agriculteur: existingAgriculteur, token: token });
};

const getAgriculteur = async (req, res, next) => {
  let existingAgriculteur;
  try {
    existingAgriculteur = await agriculteur.find({}, "-password");
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ agriculteur: existingAgriculteur });
};

const getAgriculteurById = async (req, res, next) => {
  const id = req.params.id;
  let existingAgriculteur;
  try {
    existingAgriculteur = await agriculteur.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ agriculteur: existingAgriculteur });
};

const updateAgriculteur = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email, tel } = req.body;
  const id = req.params.id;
  let existingAgriculteur;
  try {
    existingAgriculteur = await agriculteur.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingAgriculteur.name = name;
  existingAgriculteur.email = email;
  existingAgriculteur.tel = tel;

  try {
    await existingAgriculteur.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ agriculteur: existingAgriculteur });
};

const deleteAgriculteur = async (req, res, next) => {
  const id = req.params.id;
  let existingAgriculteur;

  try {
    existingAgriculteur = await agriculteur.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingAgriculteur) {
    return next(new httpError("agriculteur does not exist !!", 500));
  }
  try {
    existingAgriculteur.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const bloqueAgriculteur = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const id = req.params.id;
  let existingAgriculteur;
  try {
    existingAgriculteur = await agriculteur.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingAgriculteur.bloque = !existingAgriculteur.bloque;

  try {
    await existingAgriculteur.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ agriculteur: existingAgriculteur });
};

exports.signup = signup;
exports.login = login;
exports.getAgriculteur = getAgriculteur;
exports.getAgriculteurById = getAgriculteurById;
exports.updateAgriculteur = updateAgriculteur;
exports.deleteAgriculteur = deleteAgriculteur;
exports.bloqueAgriculteur = bloqueAgriculteur
