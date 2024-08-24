import {
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
  WRONG_GROCERY_DATA,
} from "@/app/errors/errorMessages";
import userGroceryList from "@/app/models/groceryModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { getRandomId, getTodayDate } from "@/app/utils/utils";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { emailId, itemName, pricePerKg, requiredGmsPerWeek } =
    await req.json();
  try {
    await connectUsersDB();
    const userGroceryData = await userGroceryList.findOne({ emailId });
    if (!userGroceryData) {
      return NextResponse.json({
        message: NO_USER_FOUND_ERROR,
      });
    } else {
      const randomId = getRandomId();
      if (itemName && pricePerKg && requiredGmsPerWeek) {
        await userGroceryList.updateOne(
          { emailId },
          {
            $set: {
              lastUpdateDate: getTodayDate(),
            },
            $push: {
              groceryList: {
                itemName,
                pricePerKg,
                requiredGmsPerWeek,
                addedDate: getTodayDate(),
                id: randomId,
              },
              notifications: {
                itemName,
                pricePerKg,
                requiredGmsPerWeek,
                addedDate: getTodayDate(),
                id: randomId,
              },
              todayGroceryList: {
                itemName,
                pricePerKg,
                requiredGmsPerWeek,
                addedDate: getTodayDate(),
                id: randomId,
              },
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
  } catch (e) {
    return NextResponse.json({
      messaeg:MONGO_DB_ERROR,
    });
  }
}
