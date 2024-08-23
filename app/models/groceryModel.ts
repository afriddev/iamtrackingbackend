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
  monthLyGroceryAmount: Number,
  notifyHalf: Boolean,

  groceryList: [groceryListSchema],
  notifications: [groceryListSchema],
  
  missedGroceryList: [groceryListSchema],
  todayGroceryList: [groceryListSchema],
  
});
const userGroceryList =
  models.userGroceryList || mongoose.model("userGroceryList", groceryModel);
export default userGroceryList;
