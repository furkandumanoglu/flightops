import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { RecordNotFoundError } from "../services/aircraft.service";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof RecordNotFoundError) {
    res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Validation failed",
      details: err.flatten().fieldErrors,
    });
    return;
  }

  console.error("Unhandled error:", err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal server error" });
}
