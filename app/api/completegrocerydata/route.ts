import {
  EMAIL_ID_PROVIDE_ERROR,
  ID_PROVIDE_ERROR,
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
} from "@/app/errors/errorMessages";
import userGroceryList from "@/app/models/groceryModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { groceryType } from "@/app/types/userTypes";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { emailId, id } = await req?.json();

  if (emailId && id) {
    try {
      await connectUsersDB();
      const userGroceryData: groceryType = (await userGroceryList.findOne({
        emailId,
      })) as any;

      if (userGroceryData) {
        const todayGroceryData = userGroceryData?.todayGroceryList;
        const completedGroceryList = todayGroceryData.filter(
          (item) => item?.id === id
        );
        const finalTodaygroceryList = todayGroceryData.filter(
          (item) => item?.id !== id
        );

        await userGroceryList?.updateOne(
          { emailId },
          {
            $set: {
              todayGroceryList: finalTodaygroceryList,
            },
            $push: {
              completedgroceryList: completedGroceryList[0],
            },
          }
        );

        return NextResponse.json({
          message: REQUEST_SUCCESS,
        });
      } else {
        return NextResponse.json({
          message: NO_USER_FOUND_ERROR,
        });
      }
    } catch {
      return NextResponse.json({
        message: MONGO_DB_ERROR,
      });
    }
  } else {
    return NextResponse.json({
      message: emailId ? ID_PROVIDE_ERROR : EMAIL_ID_PROVIDE_ERROR,
    });
  }
}
