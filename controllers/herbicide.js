const httpError = require("../models/error");

const herbicide = require("../models/herbicide");
const mauvaiseHerbe = require("../models/maivaiseHerbe");

const { validationResult } = require("express-validator");

const ajout = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, matiere, dose, stade, mauvaiseHerbeId } = req.body;
  console.log(nom, matiere, dose, stade, mauvaiseHerbeId);

  const createdHerbicide = new herbicide({
    nom,
    matiere,
    dose,
    stade,
    ConditionTraitement: [],
  });

  let existingMauvaiseHerbe;

  try {
    existingMauvaiseHerbe = await mauvaiseHerbe.findById(mauvaiseHerbeId);
  } catch (err) {
    const error = new httpError("problem !!!!!", 500);
    return next(error);
  }

  try {
    createdHerbicide.save();
    existingMauvaiseHerbe.herbicides.push(createdHerbicide);
    existingMauvaiseHerbe.save();
  } catch (err) {
    const error = new httpError("failed ajout", 500);
    return next(error);
  }

  res.status(201).json({
    createdHerbicide,
  });
};

const updateHerbicide = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, matiere, dose, stade } = req.body;
  const id = req.params.id;
  let existingHerbicide;
  try {
    existingHerbicide = await herbicide.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingHerbicide.nom = nom;
  existingHerbicide.matiere = matiere;
  existingHerbicide.dose = dose;
  existingHerbicide.stade = stade;

  try {
    await existingHerbicide.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ existingHerbicide });
};

const getHerbicide = async (req, res, next) => {
  let existingHerbicide;
  try {
    existingHerbicide = await herbicide.find();
  } catch {
    const error = new httpError("failed to find", 500);
    return next(error);
  }
  res.json({ herbicide: existingHerbicide });
};

const getHerbicideById = async (req, res, next) => {
  const id = req.params.id;
  let existingHerbicide;
  try {
    existingHerbicide = await herbicide.findById(id);
  } catch {
    const error = new httpError("failed to find", 500);
    return next(error);
  }
  res.json({ herbicide: existingHerbicide });
};

const deleteHerbicide = async (req, res, next) => {
  const id = req.params.id;
  let existingHerbicide;

  try {
    existingHerbicide = await herbicide.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingHerbicide) {
    return next(new httpError("agriculteur does not exist !!", 500));
  }
  try {
    existingHerbicide.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const getHerbicideByMauvaiseHerbeId = async (req, res, next) => {
  const id = req.params.id;

  let existingHerbicide;
  try {
    existingHerbicide = await mauvaiseHerbe.findById(id).populate("herbicides");
  } catch (err) {
    const error = new httpError(
      "Fetching mauvaise herbe failed, please try again later.",
      500
    );
    return next(error);
  }


  if (!existingHerbicide || existingHerbicide.herbicides.length === 0) {
    return next(
      new httpError("Pas d'herbicide pour cette plante.", 404)
    );
  }

  res.json({
    herbicides: existingHerbicide.herbicides.map((el) =>
      el.toObject({ getters: true })
    ),
  });
};

exports.ajout = ajout;
exports.updateHerbicide = updateHerbicide;
exports.getHerbicide = getHerbicide;
exports.getHerbicideById = getHerbicideById;
exports.deleteHerbicide = deleteHerbicide;
exports.getHerbicideByMauvaiseHerbeId =getHerbicideByMauvaiseHerbeId
