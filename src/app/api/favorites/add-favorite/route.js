import connectToDB from "@/database";
import Favorite from "@/models/Favorite";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const data = await req.json();

    const favoriteAlreadyExists = await Favorite.find({
      uid: data.uid,
      movieId: data.movieId,
      accountId: data.accountId,
    });
    // check if media already added to your favorite list then return saying, media already exists
    if (favoriteAlreadyExists && favoriteAlreadyExists.length > 0) {
      return NextResponse.json({
        success: false,
        message: "This is already added to your favourite list",
      });
    }

    // Add a new movie to favorites
    const newlyCreatedAccount = await Favorite.create(data);

    if (newlyCreatedAccount) {
      return NextResponse.json({
        success: true,
        message: "Added to your favorite list successfully",
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
