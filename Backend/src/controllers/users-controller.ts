import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user-service";

export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ count: users.length, data: users });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await UserService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUser = await UserService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedUser = await UserService.updateUser(id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await UserService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;