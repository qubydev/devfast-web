import mongoose, { Schema, model, InferSchemaType, Document } from "mongoose";

// Define schema
export const templateSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  githubURL: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        // Matches:
        // https://github.com/user/repo
        // https://github.com/user/repo.git
        // https://github.com/user/repo/tree/branch
        const githubRegex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\.git)?(?:\/tree\/[\w./-]+)?$/;
        return githubRegex.test(v);
      },
      message: props => `${props.value} is not a valid GitHub repository URL`
    }
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 2000,
    default: "",
  },
  technologies: {
    type: [String],
    required: true,
  },
  trusted: {
    type: Boolean,
    default: false,
  },
  nextSteps: {
    type: String,
    maxlength: 2000,
    default: "",
  },
  downloads: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { timestamps: true });

// Indexes
templateSchema.index({ technologies: 1 });
templateSchema.index({ downloads: -1 });
templateSchema.index({
  id: "text",
  title: "text",
  description: "text"
});

// Export
const Template = mongoose.models.Template || model("Template", templateSchema);
export default Template;
export type TemplateType = InferSchemaType<typeof templateSchema> & Document;