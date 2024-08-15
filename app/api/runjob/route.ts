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
import user from "@/app/models/userModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { userType } from "@/app/types/userTypes";
import { getTodayDate } from "@/app/utils/utils";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { emailId } = await req.json();

  if (emailId) {
    try {
      await connectUsersDB();
      const userData: userType | null = await user.findOne({ emailId });
      if (userData) {
        if (userData?.monthLimitAmount) {
          if (userData?.lastUpdatedDate !== getTodayDate()) {
            let totalSpend = 0;
            for (
              let index = 0;
              index < userData?.todaySpends?.length;
              index++
            ) {
              totalSpend = totalSpend + userData?.todaySpends[index]?.amount;
            }
            await user.updateOne(
              { emailId },
              {
                $set: {
                  todayDate: getTodayDate(),
                  lastUpdatedDate: getTodayDate(),
                  totalSpend,
                  todaySpends: [],
                  totalSaved: userData?.dailyLimit - totalSpend,
                },
                $push: {
                  monthlySpends: {
                    amount: parseInt(totalSpend as never),
                    id: new Date().getTime()?.toString(),
                    response:
                      totalSpend <= userData?.dailyLimit
                        ? REQUEST_SUCCESS
                        : DAILY_LIMIT_EXCEED_ERROR,
                    date: format(new Date(), "dd-MM-yyyy")?.toString(),
                  },
                },
              }
            );
            return NextResponse.json({
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
    } catch(e){
      console.log(e)
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
