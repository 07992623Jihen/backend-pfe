const httpError = require("../models/error");

const mauvaiseHerbe = require("../models/maivaiseHerbe");

const { validationResult } = require("express-validator");

const ajout = async (req, res, next) => {
  const { nom, type, description } = req.body;

  const createdMauvaiseHerbe = new mauvaiseHerbe({
    nom,
    type,
    description,
    image: req.file.path,
    herbicides: [],
  });

  try {
    await createdMauvaiseHerbe.save();
  } catch (err) {
    const error = new httpError("failed ajout", 500);
    return next(error);
  }

  res.status(201).json({
    createdMauvaiseHerbe,
  });
};

const updateMauvaiseHerbe = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, type, description } = req.body;
  const id = req.params.id;
  let existingMauvaiseHerbe;
  try {
    existingMauvaiseHerbe = await mauvaiseHerbe.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingMauvaiseHerbe.nom = nom;
  existingMauvaiseHerbe.type = type;
  existingMauvaiseHerbe.description = description;
  existingMauvaiseHerbe.image = req.file.path

  try {
    await existingMauvaiseHerbe.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ existingMauvaiseHerbe });
};

const getMauvaiseHerbe = async (req, res, next) => {
  let existingMauvaiseHerbe;
  try {
    existingMauvaiseHerbe = await mauvaiseHerbe.find();
  } catch {
    const error = new httpError("failed to find", 500);
    return next(error);
  }
  res.json({ mauvaiseHerbe : existingMauvaiseHerbe });
};

const getMauvaiseHerbeById = async (req, res, next) => {
  const id = req.params.id;
  console.log(id)
  let existingMauvaiseHerbe;
  try {
    existingMauvaiseHerbe = await mauvaiseHerbe.findById(id);
  } catch {
    const error = new httpError("failed to find", 500);
    return next(error);
  }
  res.json({ mauvaiseHerbe: existingMauvaiseHerbe });
};

const deleteMauvaiseHerbe = async (req, res, next) => {
  const id = req.params.id;
  let existingMauvaiseHerbe;

  try {
    existingMauvaiseHerbe = await mauvaiseHerbe.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingMauvaiseHerbe) {
    return next(new httpError("agriculteur does not exist !!", 500));
  }
  try {
    existingMauvaiseHerbe.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

exports.ajout = ajout;
exports.updateMauvaiseHerbe = updateMauvaiseHerbe;
exports.getMauvaiseHerbe = getMauvaiseHerbe;
exports.getMauvaiseHerbeById = getMauvaiseHerbeById;
exports.deleteMauvaiseHerbe = deleteMauvaiseHerbe;
