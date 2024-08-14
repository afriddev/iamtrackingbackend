import {
  EMAIL_ID_PROVIDE_ERROR,
  IMAGE_URl_PROVIDE_ERROR,
  MONGO_DB_ERROR,
  NO_USER_FOUND_ERROR,
  REQUEST_SUCCESS,
} from "@/app/errors/errorMessages";
import user from "@/app/models/userModel";
import { connectUsersDB } from "@/app/mongoDB/users/connectUserDB";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url, emailId } = await req.json();
  if (!emailId) {
    return NextResponse.json({
      message: EMAIL_ID_PROVIDE_ERROR,
    });
  } else if (!url) {
    return NextResponse.json({
      message: IMAGE_URl_PROVIDE_ERROR,
    });
  } else {
    try {
      await connectUsersDB();
      const userData = await user.findOne({ emailId });
      if (!userData) {
        return NextResponse.json({
          message: NO_USER_FOUND_ERROR,
        });
      } else {
        await user.updateOne(
          { emailId },
          {
            $set: { imageUrl: url },
          }
        );
        return NextResponse.json({
          message: REQUEST_SUCCESS,
        });
      }
    } catch {
      return NextResponse.json({
        message: MONGO_DB_ERROR,
      });
    }
  }
}
