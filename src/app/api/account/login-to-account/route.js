import connectToDB from "@/database";
import Account from "@/models/Account";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const { pin, uid, accountId } = await req.json();
    // find if the user with the account id exists
    const currentUser = await Account.findOne({ _id: accountId, uid });
    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: "Account not found",
      });
    }
    // Now it means user exists, we need the pin to login using compare method of bcryptjs
    const isPinCorrect = await compare(pin, currentUser.pin);
    if (isPinCorrect) {
      return NextResponse.json({
        success: true,
        message: "Welcome to Watchofy!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Incorrect PIN!",
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
