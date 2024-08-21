import mongoose from "mongoose";
import { getMongoUrl } from "../credentials";

export async function connectUsersDB() {
  await mongoose.connect(getMongoUrl("trackspends")).catch(() => {
    console.log("Oh no!");
    throw new Error("mongo error");
  });
}
