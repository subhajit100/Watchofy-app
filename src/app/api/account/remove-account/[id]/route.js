import connectToDB from "@/database";
import Account from "@/models/Account";
import { NextResponse } from "next/server";

export async function DELETE(req, {params}) {
  try {
    await connectToDB();
    const { id } = params;
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Account Id is mandatory",
      });
    }
    const deletedAccount = await Account.findByIdAndDelete(id);
    if (deletedAccount) {
      return NextResponse.json({
        success: true,
        message: "Account deleted successfully",
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
