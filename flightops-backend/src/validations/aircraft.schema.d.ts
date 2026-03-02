import { z } from "zod";
export declare const createAircraftSchema: z.ZodObject<{
    tailNumber: z.ZodString;
    model: z.ZodString;
    emptyWeight: z.ZodNumber;
    emptyWeightArm: z.ZodNumber;
    maxTakeOffWeight: z.ZodNumber;
    fuelCapacity: z.ZodNumber;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateAircraftInput = z.infer<typeof createAircraftSchema>;
//# sourceMappingURL=aircraft.schema.d.ts.map