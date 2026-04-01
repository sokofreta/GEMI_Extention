import { Schema, model } from "mongoose";

const actorSchema = new Schema({
    role: { type: String },
    fullname: { type: String },
    age: { type: String },
    eyeColor: { type: String },
    weight: { type: String },
    languages: { type: [String] },
    hairColor: { type: String },
    height: { type: String },
    description: { type: String },
    bio: { type: String },
    birthdate: { type: String },
    images: { type: [String] },
    roles: { type: [String] },
    system: { type: Number },
});

actorSchema.index({ fullname: 1, age: 1,role:1,birthdate :1}, { unique: true,sparse:true });

export const ActorModel = model("Actor", actorSchema);