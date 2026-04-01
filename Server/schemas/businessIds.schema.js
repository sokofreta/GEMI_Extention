import mongoose from "mongoose";

const { Schema, model } = mongoose;

const businessIdsSchema = new Schema(
  {
    id: { type: String, required: true },
    percetage: { type: Number },
    scraped: { type: Boolean, default: false },
  },
  { timestamps: true }
);

businessIdsSchema.index({ id: 1 }, { unique: true });

export const businessIdsModel = model("businessIds", businessIdsSchema);
