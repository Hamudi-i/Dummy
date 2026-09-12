import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user-service";

export class UserController {
  static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(200).json(await UserService.getUserById((req as any).currentUser.userId)); }
    catch (error) { next(error); }
  }

  static async updateCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(200).json(await UserService.updateUser((req as any).currentUser.userId, req.body)); }
    catch (error) { next(error); }
  }

  static async changeCurrentPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UserService.changePassword((req as any).currentUser.userId, req.body.currentPassword, req.body.newPassword);
      res.status(204).end();
    } catch (error) { next(error); }
  }
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

  static async getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = req.params.email as string;
      const user = await UserService.getUserByEmail(email);
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
