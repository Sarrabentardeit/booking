const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
    {
        title : {type:String , required: true},
       price :{type:Number , required: true},
       maxPeople :{type:Number , required: true},

        desc: {type:String , required: true},
        RoomsNumbers: [{number:Number , unvailableDates: {type: [Date]}}],

   
    },
    {timestamps: true}
);

module.exports= mongoose.model('Room', RoomSchema);

