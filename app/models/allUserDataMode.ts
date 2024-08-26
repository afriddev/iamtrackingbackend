import mongoose, { Schema, models } from "mongoose";

const allUsersDataModel = new Schema({
  emailIds:[String]
  
});
const allUsersData = models.allUsersDataModel || mongoose.model("allUsersDataModel", allUsersDataModel);
export default allUsersData;
