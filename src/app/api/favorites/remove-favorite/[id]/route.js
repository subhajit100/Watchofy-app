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
        message: "Favorite item Id is mandatory",
      });
    }
    const deletedFavorite = await Favorite.findByIdAndDelete(id);
    if (deletedFavorite) {
      return NextResponse.json({
        success: true,
        message: "Removed from Favorites List",
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
