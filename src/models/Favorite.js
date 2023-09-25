import mongoose, { Schema, model, models } from "mongoose";

const favoriteSchema = new Schema(
  {
    uid: String,
    accountId: String,
    backdrop_path: String,
    poster_path: String,
    movieId: String,
    type: String,
  },
  { timestamps: true }
);

const Favorite = models.Favorite || model("Favorite", favoriteSchema);
export default Favorite;
