const httpError = require("../models/error");

const reponse = require("../models/reponce");
const demandeTraitement = require("../models/demande-traitement");

const { validationResult } = require("express-validator");

const ajout = async (req, res, next) => {
  const {
    nom,
    description,
    descriptionPlature,
    descriptionAdulte,
    descriptionAvance,
    lutte,
    typeLutte,
    herbicide,
    demandeId,
  } = req.body;

  console.log(demandeId);

  let existingDemande;

  try {
    existingDemande = await demandeTraitement.findById(demandeId);
  } catch (err) {
    const error = new httpError("problem !!!!!", 500);
    return next(error);
  }

  const createReponce = new reponse({
    nom,
    description,
    descriptionPlature,
    imagePlature: req.file.path,
    descriptionAdulte,
    imageAdulte: "hghhfh",
    descriptionAvance,
    imageAvance: "hgghghj",
    lutte,
    typeLutte,
    herbicide,
  });

  existingDemande.res = createReponce;

  try {
    createReponce.save();
    existingDemande.save();
  } catch (err) {
    const error = new httpError("failed ajout", 500);
    return next(error);
  }

  res.status(201).json({
    reponse: createReponce,
  });
};

const updateImageAdulte = async (req, res, next) => {
  const id = req.params.id;
  let existingReponse;
  try {
    existingReponse = await reponse.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingReponse.imageAdulte = req.file.path;

  try {
    await existingReponse.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ existingReponse });
};

const updateImageAvance = async (req, res, next) => {
  const id = req.params.id;
  let existingReponse;
  try {
    existingReponse = await reponse.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingReponse.imageAvance = req.file.path;

  try {
    await existingReponse.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ existingReponse });
};

exports.ajout = ajout;
exports.updateImageAdulte = updateImageAdulte;
exports.updateImageAvance = updateImageAvance;
