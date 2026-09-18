import { NextFunction, Request, Response } from "express";
import { SupportRequestService } from "../services/support-request-service";

export class SupportRequestController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json(await SupportRequestService.create((req as any).currentUser?.userId, req.body)); }
    catch (error) { next(error); }
  }
}
