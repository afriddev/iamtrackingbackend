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
  imageUrl: String,

  monthLimitAmount: Number,
  dailySpends: [
    {
      id: String,
      amount: Number,
      date: String,
      response: String,
    },
  ],

  dailyLimit: Number,
  todaySpends: [
    {
      id: String,
      amount: Number,
      date: String,
      response: String,
      type: { type: String },
    },
  ],
  

  monthLyCharges: Number,
  monthLySpends: Number,

});
const user = models.users || mongoose.model("users", userModel);
export default user;
