const mongoose = require("mongoose");
const schema = mongoose.Schema;

const HerbicideScehma = new schema({
  nom: { type: String, required: true },
  matiere: { type: String, required: true },
  dose: { type: String, required: true },
  stade: { type: String, required: true },
  conditionTraitement: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "conditionTraitement",
    },
  ],
});

module.exports = mongoose.model("Herbicide", HerbicideScehma);
