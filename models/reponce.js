const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reponceSchema = new schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  descriptionPlature: { type: String, required: true },
  imagePlature: { type: String, required: true },
  descriptionAdulte: { type: String, required: true },
  imageAdulte: { type: String, required: true },
  descriptionAvance: { type: String, required: true },
  imageAvance: { type: String, required: true },
  lutte: { type: String, required: true },
  typeLutte: { type: String, required: true },
  herbicide: { type: String },
});

module.exports = mongoose.model("reponse", reponceSchema);
