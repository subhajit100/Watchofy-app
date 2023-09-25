import mongoose, { Schema, model, models } from "mongoose";

const accountSchema = new Schema(
  {
    uid: String,
    name: String,
    pin: String,
  },
  { timestamps: true }
);

const Account = models.Account || model("Account", accountSchema);
export default Account;
