import bcrypt from "bcryptjs";
import { PasswordHashModel } from "../../../entities/user/services/PasswordHashModel.js";

export class PasswordHash implements PasswordHashModel {
  async hash(password: string): Promise<string> {
    const passwordHash = await bcrypt.hash(password, 12);
    return passwordHash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const passwordMatch = bcrypt.compare(password, hash);
    return passwordMatch;
  }
}
