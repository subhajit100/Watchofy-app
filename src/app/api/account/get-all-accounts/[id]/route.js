import connectToDB from "@/database";
import Account from "@/models/Account";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    // for getting all accounts, I need the uid and then fetch all accounts out of that

    const { id } = params;
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Account Id is mandatory",
      });
    }
    const allAccounts = await Account.find({ uid: id });
    if (allAccounts) {
      return NextResponse.json({
        success: true,
        data: allAccounts,
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
