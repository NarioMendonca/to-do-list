import bcrypt from "bcryptjs";
import { PasswordHasherService } from "../../../entities/user/services/PasswordHasher.js";

export class PasswordHasher implements PasswordHasherService {
  async hash(password: string): Promise<string> {
    const passwordHash = await bcrypt.hash(password, 12);
    return passwordHash;
  }
}
