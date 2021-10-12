const mongoose =require("mongoose")
const schema = mongoose.Schema;

const MHerbeScehma = new schema({
    nom:{type:String,required:true},
    type:{type:String,required:true},
    description:{type:String,required:true},
    image:{type:String,required:true},
    herbicides:[{type:mongoose.Types.ObjectId,required:true,ref:'Herbicide'}]

})


module.exports = mongoose.model('MHerbe',MHerbeScehma)