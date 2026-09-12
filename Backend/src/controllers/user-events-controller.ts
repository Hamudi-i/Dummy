import { NextFunction, Request, Response } from "express";
import prisma from "../infrastructure/prisma";
import { BadRequestException } from "../infrastructure/http-exceptions";

export class UserEventController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.eventType?.trim()) throw new BadRequestException("eventType is required");
      const event = await prisma.userEvent.create({
        data: { userId: (req as any).currentUser?.userId, eventType: req.body.eventType.trim(), payload: req.body.payload },
      });
      res.status(201).json(event);
    } catch (error) { next(error); }
  }
}
