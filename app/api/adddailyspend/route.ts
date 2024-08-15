import {
  AMOUNT_VALUE_ERROR,
  DAILY_LIMIT_EXCEED_ERROR,
  DAILY_SPEND_AMOUNT_PROVIDE_ERROR,
  EMAIL_ID_PROVIDE_ERROR,
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
  SET_MONTH_AMOUNT_ERROR,
} from "@/app/errors/errorMessages";
import user from "@/app/models/userModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { userType } from "@/app/types/userTypes";
import { daysInThisMonth, getTodayDate } from "@/app/utils/utils";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function POST(req: Request) {
  const { amount, emailId } = await req.json();
  try {
    await connectUsersDB();
    if (emailId && amount > 0) {
      const userData: userType | null = await user.findOne({ emailId });
      if (userData) {
        if (userData?.monthLimitAmount > 0) {
          let totalSpend = amount;
          for (let index = 0; index < userData?.todaySpends?.length; index++) {
            totalSpend = totalSpend + userData?.todaySpends[index];
          }
          const inTheLimit =
            userData?.monthLimitAmount / (daysInThisMonth() - getTodayDate()) >
            totalSpend;
          await user.updateOne(
            { emailId },
            {
              $set: {
                todayDate: getTodayDate(),
                lastUpdatedDate: getTodayDate(),
                balance: Math.floor(userData?.balance - amount),
              },
              $push: {
                todaySpends: {
                  amount,
                  id: new Date().getTime(),
                  response: inTheLimit
                    ? REQUEST_SUCCESS
                    : DAILY_LIMIT_EXCEED_ERROR,
                  date: format(new Date(), "dd-MM-yyyy"),
                },
              },
            }
          );
          return NextResponse.json({
            message: inTheLimit ? REQUEST_SUCCESS : DAILY_LIMIT_EXCEED_ERROR,
          });
        } else {
          return NextResponse.json({
            message: SET_MONTH_AMOUNT_ERROR,
          });
        }
      } else {
        return NextResponse.json({
          message: NO_USER_FOUND_ERROR,
        });
      }
    } else {
      if (!emailId) {
        return NextResponse.json({
          message: EMAIL_ID_PROVIDE_ERROR,
        });
      } else {
        return NextResponse.json({
          message: !emailId
            ? EMAIL_ID_PROVIDE_ERROR
            : !amount || amount <= 0
            ? AMOUNT_VALUE_ERROR
            : DAILY_SPEND_AMOUNT_PROVIDE_ERROR,
        });
      }
    }
  } catch {
    return NextResponse.json({
      message: MONGO_DB_ERROR,
    });
  }
}
