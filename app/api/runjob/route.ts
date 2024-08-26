import {
  AMOUNT_UPDATED,
  DAILY_LIMIT_EXCEED_ERROR,
  EMAIL_ID_PROVIDE_ERROR,
  JOB_RUNNED,
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
  SET_MONTH_AMOUNT_ERROR,
} from "@/app/errors/errorMessages";
import userGroceryList from "@/app/models/groceryModel";
import user from "@/app/models/userModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { groceryList } from "@/app/types/groceryTypes";
import { groceryType, userType } from "@/app/types/userTypes";
import { getRandomId, getTodayDate } from "@/app/utils/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { emailId } = await req.json();

  if (emailId) {
    try {
      await connectUsersDB();
      const userData: userType | null = await user.findOne({ emailId });
      const userGroceryData: groceryType | null =
        await userGroceryList?.findOne({
          emailId,
        });
      if (userData) {
        if (userData?.monthLimitAmount > 0) {
          if (userData?.lastUpdatedDate !== getTodayDate()) {
            let totalTodaySpendAmount = 0;
            for (
              let index = 0;
              index < userData?.todaySpends?.length;
              index++
            ) {
              totalTodaySpendAmount =
                totalTodaySpendAmount + userData?.todaySpends[index]?.amount;
            }

            await user?.updateOne({
              $push: {
                dailySpends: {
                  id: getRandomId(),
                  response:
                    totalTodaySpendAmount >= userData?.dailyLimit
                      ? DAILY_LIMIT_EXCEED_ERROR
                      : REQUEST_SUCCESS,
                  amount: totalTodaySpendAmount,
                  date: getTodayDate(),
                  type: "",
                },
              },
              $set: {
                dailySpends: [],
                todayDate: getTodayDate(),
                lastUpdatedDate: getTodayDate(),
              },
            });

            return NextResponse?.json({
              message: AMOUNT_UPDATED,
            });
          } else {
            return NextResponse.json({
              message: JOB_RUNNED,
            });
          }
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
    } catch (e) {
      console.log(e);
      return NextResponse.json({
        message: MONGO_DB_ERROR,
      });
    }
  } else {
    return NextResponse.json({
      message: EMAIL_ID_PROVIDE_ERROR,
    });
  }
}
