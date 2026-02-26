import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AircraftService } from "../services/aircraft.service";
import { createAircraftSchema } from "../validations/aircraft.schema";

export function createAircraftController(service: AircraftService) {
  return {
    async create(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const parsed = createAircraftSchema.parse(req.body);
        const aircraft = await service.createAircraft({
          ...parsed,
          isActive: parsed.isActive ?? true,
        });
        res.status(StatusCodes.CREATED).json(aircraft);
      } catch (err) {
        next(err);
      }
    },

    async getById(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const id = req.params.id as string;
        const aircraft = await service.getAircraftById(id);
        res.status(StatusCodes.OK).json(aircraft);
      } catch (err) {
        next(err);
      }
    },

    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const aircraft = await service.listAircraft();
        res.status(StatusCodes.OK).json(aircraft);
      } catch (err) {
        next(err);
      }
    },

    async update(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const id = req.params.id as string;
        const aircraft = await service.updateAircraft(id, req.body);
        res.status(StatusCodes.OK).json(aircraft);
      } catch (err) {
        next(err);
      }
    },

    async delete(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const id = req.params.id as string;
        await service.deleteAircraft(id);
        res.status(StatusCodes.NO_CONTENT).send();
      } catch (err) {
        next(err);
      }
    },

    async getAvailablePayload(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const id = req.params.id as string;
        const result = await service.calculateAvailablePayload(id);
        res.status(StatusCodes.OK).json(result);
      } catch (err) {
        next(err);
      }
    },
  };
}
