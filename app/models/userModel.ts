import mongoose, { Schema, models } from "mongoose";

const userModel = new Schema({
  emailId: {
    type: String,
    immutable: true,
    required: true,
  },
  mobileNumber: {
    length: 10,
    type: Number,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    immutable: true,
    required: true,
  },
  todayDate: Number,
  lastUpdatedDate: Number,
  monthLimitAmount: Number,
  todaySpends: [{
    id:String,
    amount:Number,
    date:String,
    response:String
  }],
  balance: Number,
  totalSpend:Number,
  dailyLimit:Number,
  totalSaved:Number,
  imageUrl:String,
  monthlySpends: [{
    id:String,
    amount:Number,
    date:String,
    response:String
  }]
});
const user = models.users || mongoose.model("users", userModel);
export default user;
