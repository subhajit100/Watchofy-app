import connectToDB from "@/database";
import Favorite from "@/models/Favorite";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Account Id is mandatory",
      });
    }
    const deletedFavorites = await Favorite.deleteMany({ accountId: id });
    if (deletedFavorites) {
      return NextResponse.json({
        success: true,
        message: "Removed all Favorites from database for a particular account",
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
