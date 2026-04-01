import { Schema, model } from "mongoose";

const logSchema = new Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },  
    results: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true, 
  }
);


export const LogModel = model("Log", logSchema);
