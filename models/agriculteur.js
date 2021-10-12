const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const agriculteurSchema = new schema({
    name:{type:String,required:true},
    prenom:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:8},
    tel:{type:String,required:true},
    demandeE:[{type:mongoose.Types.ObjectId,required:true,ref:'demandeE'}],
    demandeT:[{type:mongoose.Types.ObjectId,required:true,ref:'demandeT'}]


})

agriculteurSchema.plugin(uniqueValidator)

module.exports = mongoose.model('agriculteur',agriculteurSchema)