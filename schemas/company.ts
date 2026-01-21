// Example Schema for a Company object
export const companySchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    industry: { type: "string" },
  },
  required: ["id", "name"],
};
