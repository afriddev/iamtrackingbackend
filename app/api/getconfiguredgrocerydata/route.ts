import {
  EMAIL_ID_PROVIDE_ERROR,
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
} from "@/app/errors/errorMessages";
import userGroceryList from "@/app/models/groceryModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { emailId } = await req.json();
  if (emailId) {
    try {
      await connectUsersDB();
      const userGroceryData = await userGroceryList?.findOne({ emailId });
      if (userGroceryData) {
        return NextResponse.json({
          message: REQUEST_SUCCESS,
          data: userGroceryData?.groceryList,
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
      message: EMAIL_ID_PROVIDE_ERROR,
    });
  }
}
