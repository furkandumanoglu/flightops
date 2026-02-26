import { z } from "zod";

const tailNumberRegex = /^[A-Z0-9-]{3,10}$/;

export const createAircraftSchema = z
  .object({
    tailNumber: z.string().regex(tailNumberRegex, {
      message: "tailNumber must match ^[A-Z0-9-]{3,10}$",
    }),
    model: z.string().min(1, "model is required"),
    emptyWeight: z.number().positive("emptyWeight must be positive"),
    emptyWeightArm: z.number().positive("emptyWeightArm must be positive"),
    maxTakeOffWeight: z.number().positive("maxTakeOffWeight must be positive"),
    fuelCapacity: z.number().nonnegative("fuelCapacity must be non-negative"),
    isActive: z.boolean().optional(),
  })
  .refine((data) => data.emptyWeight <= data.maxTakeOffWeight, {
    message: "emptyWeight cannot be greater than maxTakeOffWeight",
    path: ["emptyWeight"],
  });

export type CreateAircraftInput = z.infer<typeof createAircraftSchema>;
