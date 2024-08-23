import {
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
  WRONG_GROCERY_DATA,
} from "@/app/errors/errorMessages";
import userGroceryList from "@/app/models/groceryModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { getRandomId, getTodayDate } from "@/app/utils/utils";
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
      const randomId = getRandomId();
      if (groceryData) {
        await userGroceryList.updateOne(
          { emailId },
          {
            $set: {
              lastUpdateDate: getTodayDate(),
            },
            $push: {
              groceryList: { ...groceryData, id: randomId },
              notifications: { ...groceryData, id: randomId },
              todayGroceryList: { ...groceryData, id: randomId },
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
