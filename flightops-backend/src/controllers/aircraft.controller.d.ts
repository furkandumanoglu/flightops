import { Request, Response, NextFunction } from "express";
import { AircraftService } from "../services/aircraft.service";
import { WeightBalanceService } from "../services/wb.service";
export declare function createAircraftController(service: AircraftService, wbService: WeightBalanceService): {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    list(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAvailablePayload(req: Request, res: Response, next: NextFunction): Promise<void>;
    calculateCG(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=aircraft.controller.d.ts.map