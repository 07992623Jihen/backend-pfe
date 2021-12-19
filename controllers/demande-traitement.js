const httpError = require("../models/error");

const demandeTraitement = require("../models/demande-traitement");
const agriculteur =require("../models/agriculteur")

const { validationResult } = require("express-validator");

const ajout = async (req, res, next) => {
  const { type, utilisateurId } = req.body;

  let existingUser;
  try {
    existingUser = await agriculteur.findById(utilisateurId);
  } catch {
    const error = new httpError("failed to find", 500);
    return next(error);
  }

  const createdDemandeTraitement = new demandeTraitement({
    image: req.file.path,
    type,
    finished: false,
    utilisateurId,
    res: [],
  });

  try {
    createdDemandeTraitement.save();
    existingUser.demandeT.push(createdDemandeTraitement)
    existingUser.save()
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


const getDemandeByAgriculteurId = async (req, res, next) => {
  const id = req.params.id;

  let existingDemande;
  try {
    existingDemande = await agriculteur.findById(id).populate("demandeT");
  } catch (err) {
    const error = new httpError(
      "Fetching mauvaise herbe failed, please try again later.",
      500
    );
    return next(error);
  }


  if (!existingDemande || existingDemande.demandeT.length === 0) {
    return next(
      new httpError("Pas d'herbicide pour cette plante.", 404)
    );
  }

  res.json({
    demandes: existingDemande.demandeT.map((el) =>
      el.toObject({ getters: true })
    ),
  });
};


exports.ajout = ajout;
exports.getDemandeDeTraitement =getDemandeDeTraitement
exports.getDemandeByAgriculteurId = getDemandeByAgriculteurId
