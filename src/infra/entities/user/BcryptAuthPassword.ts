import { compare } from "bcryptjs";
import {
  AuthPasswordsData,
  AuthPasswordService,
  ComparePasswords,
} from "../../../entities/user/services/AuthPasswordService.js";

class BcryptComparePasswords implements ComparePasswords {
  async compare({
    password,
    passwordHash,
  }: AuthPasswordsData): Promise<boolean> {
    const passwordsMatches = await compare(password, passwordHash);
    return passwordsMatches;
  }
}

export class BcryptAuthPassword extends AuthPasswordService {
  constructor() {
    const comparePasswords = new BcryptComparePasswords();
    super(comparePasswords);
  }
}
