const httpError = require("../models/error");

const demandeTraitement = require("../models/demande-traitement");

const { validationResult } = require("express-validator");

const ajout = async (req, res, next) => {
  const { type, utilisateurId } = req.body;

  const createdDemandeTraitement = new demandeTraitement({
    image: req.file.path,
    type,
    finished: false,
    utilisateurId,
    res: null,
  });

  try {
    createdDemandeTraitement.save();
  } catch (err) {
    const error = new httpError("failed ajout", 500);
    return next(error);
  }

  res.status(201).json({
    createdDemandeTraitement,
  });
};

const getDemandeDeTraitement = async (req, res, next) => {
  let existingDemande;
  try {
    existingDemande = await demandeTraitement.find();
  } catch {
    const error = new httpError("failed to find", 500);
    return next(error);
  }
  res.json({ demande : existingDemande });
};

exports.ajout = ajout;
exports.getDemandeDeTraitement =getDemandeDeTraitement
