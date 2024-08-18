import {
  EMAIL_ID_PROVIDE_ERROR,
  INVALID_EMAIL,
  MONGO_DB_ERROR,
  REQUEST_SUCCESS,
} from "@/app/errors/errorMessages";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { emailId, method } = await req.json();

  if (emailId) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
      try {
        const url = "https://freeemailapi.vercel.app/sendEmail/";
        const otp = ((Math.random() * 1e6) | 0).toString().padStart(6, "0");

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            toEmail: emailId,
            body: `Your Verification Code For ${
              method === "LOGIN" ? "Login" : "Sign Up"
            } ${otp}`,
            title: "Track me ",
            subject:`Otp For ${method === "LOGIN" ? "Login" : "Sign Up"}`,
          }),
        });
        const result = await response.json();
        console.log(result, emailId);

        return NextResponse.json({
          message:
            result?.message === "emailSendSuccess"
              ? REQUEST_SUCCESS
              : result?.message,
          otp,
        });
      } catch (e) {
        return NextResponse.json({
          message: MONGO_DB_ERROR,
        });
      }
    } else {
      return NextResponse.json({
        message: INVALID_EMAIL,
      });
    }
  } else {
    return NextResponse.json({
      message: EMAIL_ID_PROVIDE_ERROR,
    });
  }
}
