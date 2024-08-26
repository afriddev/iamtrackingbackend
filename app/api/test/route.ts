import { NextResponse } from "next/server";

export async function GET() {
  console.log("test");
  return NextResponse.json({
    Message: "asa",
  });
}

''