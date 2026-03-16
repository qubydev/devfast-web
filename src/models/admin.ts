import mongoose, { Schema, model, InferSchemaType, Document } from "mongoose";

// Define schema
export const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

// Indexes
adminSchema.index({ email: 1 }, { unique: true });

// Export
const Admin = mongoose.models.Admin || model("Admin", adminSchema);
export default Admin;
export type AdminType = InferSchemaType<typeof adminSchema> & Document;
