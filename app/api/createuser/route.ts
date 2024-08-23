import {
  EMAIL_ID_PROVIDE_ERROR,
  FISRT_NAME_PROVIDE_ERROR,
  MONGO_DB_ERROR,
  PASSWORD_PROVIDE_ERROR,
  REQUEST_SUCCESS,
  USER_EXISTS_ERROR,
} from "@/app/errors/errorMessages";
import userGroceryList from "@/app/models/groceryModel";
import user from "@/app/models/userModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { getTodayDate } from "@/app/utils/utils";
import { NextResponse } from "next/server";

async function checkJson(req: any) {
  const { emailId, firstName, lastName, password } = await req;
  if (!emailId) {
    return EMAIL_ID_PROVIDE_ERROR;
  } else if (!password) {
    return PASSWORD_PROVIDE_ERROR;
  } else if (!firstName) {
    return FISRT_NAME_PROVIDE_ERROR;
  } else {
    return REQUEST_SUCCESS;
  }
}

export async function POST(req: Request) {
  const requestJson = await req.json();
  const { emailId, password, firstName, lastName, mobileNumber } = requestJson;
  if ((await checkJson(requestJson)) === "SUCCESS") {
    try {
      await connectUsersDB();
      const userData = await user.findOne({ emailId });
      if (!userData) {
        await user.create({
          firstName,
          lastName: lastName ?? "",
          emailId,
          password: btoa(password),
          todayDate: getTodayDate(),
          lastUpdatedDate: getTodayDate(),
          imageUrl: "",
          mobileNumber: mobileNumber ?? "",

          monthLimitAmount: 0,
          todaySpends: [],

          dailyLimit: 0,
          dailySpends: [],

          monthLyCharges: 0,
          monthLyGroceryAmount: 0,
          monthLySpends: 0,
        });
        await userGroceryList.create({
          emailId,
          lastUpdateDate: getTodayDate() - 1,
          todayDate: getTodayDate() - 1,
          notifyHalf: true,
          monthLyGroceryAmount: 0,
          groceryList: [],
          notifications: [],
          missedGroceryList: [],
          todayGroceryList: [],
        });
        return NextResponse.json({
          message: REQUEST_SUCCESS,
        });
      } else {
        return NextResponse.json({
          message: USER_EXISTS_ERROR,
        });
      }
    } catch (e) {
      console.log(e);
      return NextResponse.json({
        message: MONGO_DB_ERROR,
      });
    }
  } else {
    return NextResponse.json({
      message: await checkJson(requestJson),
    });
  }
}
