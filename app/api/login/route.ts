import {
  EMAIL_ID_PROVIDE_ERROR,
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  PASSWORD_PROVIDE_ERROR,
  REQUEST_SUCCESS,
  WRONG_PASSWORD_ERROR,
} from "@/app/errors/errorMessages";
import user from "@/app/models/userModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { userType } from "@/app/types/userTypes";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { emailId, password } = await req.json();

  if (!emailId) {
    return NextResponse.json({
      message: EMAIL_ID_PROVIDE_ERROR,
    });
  } else if (!password) {
    return NextResponse.json({
      message: PASSWORD_PROVIDE_ERROR,
    });
  } else {
    try {
      await connectUsersDB();

      const userData: userType = (await user.findOne({
        emailId,
      })) as never;

      if (!userData?.emailId) {
        return NextResponse.json({
          message: NO_USER_FOUND_ERROR,
        });
      } else {
        if (password !== userData?.password) {
          return NextResponse.json({
            message: WRONG_PASSWORD_ERROR,
          });
        } else {
          return NextResponse.json({
            message: REQUEST_SUCCESS,
          });
        }
      }
    } catch {
      return NextResponse.json({
        message: MONGO_DB_ERROR,
      });
    }
  }
}
