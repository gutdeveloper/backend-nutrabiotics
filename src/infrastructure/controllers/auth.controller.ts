import { NextFunction, Request, Response } from "express";
import { AuthUseCase } from "../../application/use-cases/auth.use-case";
import { IRegisterDTO } from "../../application/dtos/auth/register.dto";
import { ILoginDTO } from "../../application/dtos/auth/login.dto";

export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const registerDTO: IRegisterDTO = {
        firstName,
        lastName,
        email,
        password,
      };

      const result = await this.authUseCase.register(registerDTO);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const loginDTO: ILoginDTO = { email, password };

      const result = await this.authUseCase.login(loginDTO);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.body;
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
