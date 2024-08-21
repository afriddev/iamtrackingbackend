import {
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
  WRONG_GROCERY_DATA,
} from "@/app/errors/errorMessages";
import userGroceryList from "@/app/models/groceryModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { groceryList } from "@/app/types/groceryTypes";
import { getTodayDate } from "@/app/utils/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { emailId, groceryData } = await req.json();
  try {
    await connectUsersDB();
    const userGroceryData = await userGroceryList.findOne({ emailId });
    if (!userGroceryData) {
      return NextResponse.json({
        message: NO_USER_FOUND_ERROR,
      });
    } else {
      if (groceryData) {
        await userGroceryList.updateOne(
          { emailId },
          {
            $set: {
              lastUpdateDate: getTodayDate(),
            },
            $push: {
              groceryList: groceryData,
            },
          }
        );
        return NextResponse.json({
          message: REQUEST_SUCCESS,
        });
      } else {
        return NextResponse.json({
          message: WRONG_GROCERY_DATA,
        });
      }
    }
  } catch {
    return NextResponse.json({
      messaeg: MONGO_DB_ERROR,
    });
  }
}
