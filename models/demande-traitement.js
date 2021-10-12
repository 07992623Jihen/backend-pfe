const mongoose = require("mongoose");
const schema = mongoose.Schema;

const demandeTraitementSchema = new schema({
  image: { type: String, required: true },
  type: { type: String, required: true },
  finished: { type: String, required: true },
  utilisateurId: { type: String, required: true },
  res: [{ type: mongoose.Types.ObjectId, ref: "reponse" }],
});

module.exports = mongoose.model("demandeTraitement", demandeTraitementSchema);
