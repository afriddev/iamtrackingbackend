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
  const { emailId, id } = await req.json();

  if (emailId && id) {
    try {
      await connectUsersDB();
      const userGrocerydata: groceryType = (await userGroceryList.findOne({
        emailId,
      })) as never;

      if (userGrocerydata) {
        const finalUserGroceryData = userGrocerydata?.todayGroceryList?.filter(
          item => item?.id !== id
        );

        const finaMissedGroceryData = userGrocerydata?.missedGroceryList?.filter(
          item => item?.id !== id
        );
        const finaDailyGroceryData = userGrocerydata?.todayGroceryList?.filter(
          item => item?.id !== id
        );
        const finalNotificationGroceryData = userGrocerydata?.todayGroceryList?.filter(
          item => item?.id !== id
        );
        

        

        await userGroceryList.updateOne(
          { emailId },
          {
            $set: {
              groceryList: finalUserGroceryData,
              missedGroceryList: finaMissedGroceryData,
              todayGroceryList:finaDailyGroceryData,
              notifications:finalNotificationGroceryData
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
      message: emailId ? EMAIL_ID_PROVIDE_ERROR : ID_PROVIDE_ERROR,
    });
  }
}
