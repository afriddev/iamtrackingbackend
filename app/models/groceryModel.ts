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
  groceryList: [groceryListSchema],
  lastUpdateDate: Number,
  todayDate: Number,
  notifications: [groceryListSchema],
  monthLyLimit: Number,
  monthLySpend: Number,
});
const userGroceryList =
  models.userGroceryList || mongoose.model("userGroceryList", groceryModel);
export default userGroceryList;
