import mongoose, { Schema, models } from "mongoose";

const groceryListSchema = new Schema({
  itemName: {
    type: String,
  },
  pricePerKg: {
    type: Number,
  },
  requiredGmsPerWeek: {
    type: Number,
  },
  addedDate: Number,
});

const groceryModel = new Schema({
  emailId: {
    type: String,
    immutable: true,
    required: true,
  },
  lastUpdateDate: Number,
  todayDate: Number,

  
  groceryList: [groceryListSchema],
  notifications: [groceryListSchema],
  notifyHalf: Boolean,


  monthLyGroceryAmount: Number,
});
const userGroceryList =
  models.userGroceryList || mongoose.model("userGroceryList", groceryModel);
export default userGroceryList;
