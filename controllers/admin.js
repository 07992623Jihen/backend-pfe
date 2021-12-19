const httpError = require("../models/error");

const admin = require("../models/admin");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");


const signup = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new httpError("invalid input passed ", 422));
    }
  
    const { name, email, tel } = req.body;
    let existingAdmin;
    try {
        existingAdmin= await admin.findOne({ email: email });
    } catch (err) {
      const error = new httpError("problems!!!", 500);
      return next(error);
    }
  
    if (existingAdmin) {
      const error = new httpError("admin exist", 422);
      return next(error);
    }
  
    const createdadmin = new aadmin({
      name,
      email,
      tel,
      demandeE: [],
      demandeT: [],
    });
  
    try {
      await createdadmin.save();
    } catch (err) {
      const error = new httpError("failed signup", 500);
      return next(error);
    }
  
    let token;
    try {
      token = jwt.sign(
        { adminId: createdadmin.id, email: createdadmin.email },
        "secret-thinks",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new httpError("failed signup try again later", 500);
      return next(error);
    }
  
    res
      .status(201)
      .json({ id: createdadmin.id, email: createdadmin.email, token: token });
  };

  const login = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new httpError("ivalid input passed", 422));
    }
  
    const { email, password } = req.body;
    let existingAdmin;
  
    try {
      existingAdmin = await admin.findOne({ email: email });
    } catch {
      return next(new httpError("ivalid input passed", 422));
    }
    if (!existingAdmin || existingAdmin.password !== password) {
      return next(new httpError("invalid input passed ", 422));
    }

    let token;
    try {
      token = jwt.sign(
        { id: existingAdmin.id, email: existingAdmin.email },
        "secret-thinks",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new httpError("failed signup try again later", 500);
      return next(error);
    }
    res.status(200).json({ admin: existingAdmin, token: token });
  };

  
const getAdmin = async (req, res, next) => {
  let existingAdmin;
  try {
    existingAdmin = await admin.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ admin: existingAdmin });
};

const getAdminById = async (req, res, next) => {
  const id = req.params.id
  let existingAdmin;
  try {
    existingAdmin = await admin.findById(id)
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ admin: existingAdmin });
};


const updateAdmin = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email,  tel } = req.body;
  const id = req.params.id;
  let existingAdmin;
  try {
    existingAdmin = await admin.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }



  existingAdmin.name = name;
  existingAdmin.email = email;
 
  existingAdmin.tel = tel;

  try {
    await existingAdmin.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ admin: existingAdmin });
};


const deleteAdmin = async (req, res, next) => {
  const id = req.params.id;
  let existingAdmin;

  try {
    existingAdmin = await admin.findById(id);
  } catch {
    return next(new httpError("failed to fetch !!", 500));
  }
  if (!existingAdmin) {
    return next(new httpError("admin does not exist !!", 500));
  }
  try {
    existingAdmin.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};






  exports.signup=signup
  exports.login=login
  exports.getAdmin=getAdmin
  exports.getAdminById=getAdminById
  exports.updateAgriculteur=updateAdmin
  exports.deleteAdmin=deleteAdmin
