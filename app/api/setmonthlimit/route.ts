import {
  MONGO_DB_ERROR,
  MONTHLY_AMOUNT_ZERO_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
} from "@/app/errors/errorMessages";
import userGroceryList from "@/app/models/groceryModel";
import user from "@/app/models/userModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { daysInThisMonth, getTodayDate } from "@/app/utils/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { amount, emailId } = await req.json();
  if (!amount || amount <= 0) {
    return NextResponse.json({
      message: MONTHLY_AMOUNT_ZERO_ERROR,
    });
  } else {
    try {
      await connectUsersDB();
      const userData = await user.findOne({ emailId });
      if (userData) {
        await user.updateOne(
          { emailId },
          {
            $set: {
              todayDate: getTodayDate(),
              lastUpdatedDate: getTodayDate(),
              monthLimitAmount: amount * 0.6,
              balance: amount * 0.6,
              dailyLimit: Math.floor(
                (amount * 0.6) / (daysInThisMonth() - getTodayDate())
              ),
            },
          }
        );
        await userGroceryList.updateOne(
          {
            emailId,
          },
          {
            $set: {
              monthLyLimit: amount * 0.4,
              lastUpdateDate: getTodayDate(),
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
  }
}
