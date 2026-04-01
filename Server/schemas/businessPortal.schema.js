import mongoose from "mongoose";
import { Schema } from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    companyNumber: { type: String, required: true },
    euid: { type: String },
    tradeTitles: { type: String },
    latinName: { type: String },
    vatNumber: { type: String },
    establishmentDate: { type: String },
    legalForm: { type: String },
    status: { type: String },
    address: { type: String },
    website: { type: String },
    eshop: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    responsibleService: { type: String },
    chamberDepartment: { type: String },
    chamberRegistryNumber: { type: String },
    chamberPhoneNumber: { type: String },
    chamberWebsite: { type: String },
    registrationDate: { type: String },
    purpose: { type: String },
    kad: { type: String },
    kad_details: { type: String },
    drastiriotites: { type: Schema.Types.Mixed},
  },
  { timestamps: true }
);
businessSchema.index({ companyNumber: 1 }, { unique: true }, { sparse: true });
export const BusinessModel = mongoose.model("business", businessSchema);
