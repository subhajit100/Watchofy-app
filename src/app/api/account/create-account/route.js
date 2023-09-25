import connectToDB from "@/database";
import Account from "@/models/Account";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const { name, uid, pin } = await req.json();
    // uid can be same for many accounts, but uid and name combination should be different, as one uid can consist of max four accounts with help of pin

    const accountAlreadyExists = await Account.find({ uid, name });
    // check if account already exists then return saying, account already exists
    if (accountAlreadyExists && accountAlreadyExists.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Please try with different name",
      });
    }

    // account doesn't exist, but if allaccounts === 4, then no more account can be added
    const allAccounts = await Account.find({ uid });
    if (allAccounts && allAccounts.length === 4) {
      return NextResponse.json({
        success: false,
        message: "Maximum of 4 accounts can only be added",
      });
    }

    // create a new account by hashing the pin using bcryptjs
    const hashPin = await hash(pin, 12);
    const newlyCreatedAccount = await Account.create({
      uid,
      name,
      pin: hashPin,
    });

    if (newlyCreatedAccount) {
      return NextResponse.json({
        success: true,
        message: "Account created successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Something went wrong",
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
