import {
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
  WRONG_GROCERY_DATA,
} from "@/app/errors/errorMessages";
import userGroceryList from "@/app/models/groceryModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { groceryType } from "@/app/types/userTypes";
import { getRandomId, getTodayDate } from "@/app/utils/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { emailId, itemName, pricePerKg, requiredGmsPerWeek, id } =
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
        if (id) {
          const userGroceeryData: groceryType = (await userGroceryList.findOne({
            emailId,
          })) as never;
          const finalTotalGroceryList = userGroceeryData?.groceryList.filter(
            (item) => item?.id !== id
          );
          const finalNotificastionGroceryList =
            userGroceeryData?.notifications.filter((item) => item?.id !== id);
          const finalTodayGroceryList =
            userGroceeryData?.todayGroceryList.filter(
              (item) => item?.id !== id
            );

          await userGroceryList?.updateOne(
            {
              emailId,
            },
            {
              $set: {
                groceryList: finalTotalGroceryList,
                todayGroceryList: finalTodayGroceryList,
                notifications: finalNotificastionGroceryList,
              },
            }
          );
        }

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
                id: id ?? randomId,
              },
              notifications: {
                itemName,
                pricePerKg,
                requiredGmsPerWeek,
                addedDate: getTodayDate(),
                id: id ?? randomId,
              },
              todayGroceryList: {
                itemName,
                pricePerKg,
                requiredGmsPerWeek,
                addedDate: getTodayDate(),
                id: id ?? randomId,
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
      messaeg: MONGO_DB_ERROR,
    });
  }
}
