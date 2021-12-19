const httpError = require("../models/error");

const ingenieur = require("../models/ingenieur");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const generator = require("generate-password");

const nodemailer = require("nodemailer");
const log = console.log;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL || "jihenriabi15@gmail.com", // TODO: your gmail account
    pass: process.env.PASSWORD || "201720183", // TODO: your gmail password
  },
});

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, prenom, email, tel } = req.body;
  const password = generator.generate({
    length: 10,
    numbers: true,
  });
  let existingIngenieur;
  try {
    existingIngenieur = await ingenieur.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existingIngenieur) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createdingenieur = new ingenieur({
    name,
    prenom,
    email,
    password,
    tel,
    bloque:false,
    demandeE: [],
    demandeT: [],
  });

  try {
    await createdingenieur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { ingenieurId: createdingenieur.id, email: createdingenieur.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  let mailOptions = {
    from: "jihenriabi15@gmail.com", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "Création de compte",
    text: "votre compte est crée voila votre mot de passe: " + password,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(201).json({
    id: createdingenieur.id,
    email: createdingenieur.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("ivalid input passed", 422));
  }

  const { email, password } = req.body;
  let existingIngenieur;

  try {
    existingIngenieur = await ingenieur.findOne({ email: email });
  } catch {
    return next(new httpError("ivalid input passed", 422));
  }
  console.log(existingIngenieur);
  if (!existingIngenieur || existingIngenieur.password !== password) {
    return next(new httpError("invalid input passed ", 422));
  }

  let token;
  try {
    token = jwt.sign(
      { id: existingIngenieur.id, email: existingIngenieur.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ ingenieur: existingIngenieur, token: token });
};

const getIngenieur = async (req, res, next) => {
  let existingIngenieur;
  try {
    existingIngenieur = await ingenieur.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ ingenieur: existingIngenieur });
};

const getIngenieurById = async (req, res, next) => {
  const id = req.params.id;
  let existingIngenieur;
  try {
    existingIngenieur = await ingenieur.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ ingenieur: existingIngenieur });
};

const updateIngenieur = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, prenom, email, tel } = req.body;
  const id = req.params.id;
  console.log(id);
  let existingIngenieur;
  try {
    existingIngenieur = await ingenieur.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingIngenieur.name = name;
  existingIngenieur.prenom = prenom;
  existingIngenieur.email = email;
  existingIngenieur.tel = tel;

  try {
    await existingIngenieur.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ ingenieur: existingIngenieur });
};

const deleteIngenieur = async (req, res, next) => {
  const id = req.params.id;
  let existingIngenieur;

  try {
    existingIngenieur = await ingenieur.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingIngenieur) {
    return next(new httpError("ingenieur does not exist !!", 500));
  }
  try {
    existingIngenieur.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const forgetPassword = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { email } = req.body;

  let existingIngenieur;
  try {
    existingIngenieur = await ingenieur.findOne({ email: email });
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  if (!existingIngenieur) {
    const error = new httpError("Adresse email inccorecte.", 500);
    return next(error);
  }

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  existingIngenieur.password = password;

  try {
    await existingIngenieur.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  let mailOptions = {
    from: "jihenriabi15@gmail.com", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "Mise à jour de mot de passe",
    text: "votre nouveaux mot de passe est: " + password,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(200).json({ ingenieur: existingIngenieur });
};

const bloqueIngenieur = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const id = req.params.id;

  let existingIngenieur;
  try {
    existingIngenieur = await ingenieur.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingIngenieur.bloque = !existingIngenieur.bloque;


  try {
    await existingIngenieur.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ ingenieur: existingIngenieur });
};


exports.signup = signup;
exports.login = login;
exports.getIngenieur = getIngenieur;
exports.updateIngenieur = updateIngenieur;
exports.deleteIngenieur = deleteIngenieur;
exports.forgetPassword = forgetPassword;
exports.getIngenieurById = getIngenieurById;
exports.bloqueIngenieur  = bloqueIngenieur
