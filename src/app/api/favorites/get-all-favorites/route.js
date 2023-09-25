import connectToDB from "@/database";
import Favorite from "@/models/Favorite";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req) {
  try {
    await connectToDB();
    // for getting all accounts, I need the uid and then fetch all accounts out of that
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const accountId = searchParams.get("accountId");
    if (!id || !accountId) {
      return NextResponse.json({
        success: false,
        message: "Account Id is mandatory",
      });
    }
    const allFavorites = await Favorite.find({ uid: id, accountId });
    if (allFavorites) {
      return NextResponse.json({
        success: true,
        data: allFavorites,
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
