const mongoose = require("mongoose");

const dispatchSchema = new mongoose.Schema(

{

orderId:{

type:String,

required:true,

unique:true,

},

customer:{

type:String,

required:true,

},

phone:{

type:String,

required:true,

},

address:{

type:String,

default:"",

},

city:{

type:String,

default:"",

},

product:{

type:String,

required:true,

},

quantity:{

type:Number,

default:1,

},

dispatchDate:{

type:Date,

default:Date.now,

},

driver:{

type:String,

default:"",

},

vehicleNumber:{

type:String,

default:"",

},

trackingNumber:{

type:String,

default:"",

},

transport:{

type:String,

default:"Own Vehicle",

},

priority:{

type:String,

enum:["Low","Medium","High"],

default:"Medium",

},

status:{

type:String,

enum:[

"Pending",

"Packed",

"Dispatched",

"Out For Delivery",

"Delivered"

],

default:"Pending",

},

remarks:{

type:String,

default:"",

},

},

{

timestamps:true,

}

);

module.exports=mongoose.model("Dispatch",dispatchSchema);