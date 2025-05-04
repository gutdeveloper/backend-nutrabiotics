import { IToken } from "../../domain/interfaces/token.interface";
import jwt from "jsonwebtoken";
import { config } from "../../config/env.config";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export class JwtService implements IToken {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = config.jwtSecret;
    this.expiresIn = config.jwtExpiresIn;
  }
  async generate(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as jwt.SignOptions["expiresIn"],
      algorithm: "HS256",
    });
  }

  async verify(token: string): Promise<TokenPayload> {
    return jwt.verify(token, this.secret) as TokenPayload;
  }
}
