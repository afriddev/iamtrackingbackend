import { NextResponse } from "next/server";

export function GET() {
  console.log("test");
  return NextResponse.json({
    Message: "asa",
  });
}
