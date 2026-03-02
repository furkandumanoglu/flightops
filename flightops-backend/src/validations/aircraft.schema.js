"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAircraftSchema = void 0;
const zod_1 = require("zod");
const tailNumberRegex = /^[A-Z0-9-]{3,10}$/;
exports.createAircraftSchema = zod_1.z
    .object({
    tailNumber: zod_1.z.string().regex(tailNumberRegex, {
        message: "tailNumber must match ^[A-Z0-9-]{3,10}$",
    }),
    model: zod_1.z.string().min(1, "model is required"),
    emptyWeight: zod_1.z.number().positive("emptyWeight must be positive"),
    emptyWeightArm: zod_1.z.number().positive("emptyWeightArm must be positive"),
    maxTakeOffWeight: zod_1.z.number().positive("maxTakeOffWeight must be positive"),
    fuelCapacity: zod_1.z.number().nonnegative("fuelCapacity must be non-negative"),
    isActive: zod_1.z.boolean().optional(),
})
    .refine((data) => data.emptyWeight <= data.maxTakeOffWeight, {
    message: "emptyWeight cannot be greater than maxTakeOffWeight",
    path: ["emptyWeight"],
});
//# sourceMappingURL=aircraft.schema.js.map