import { EntityError } from "../../../errors/entitys/EntityError.js";

export type AuthPasswordsData = {
  password: string;
  passwordHash: string;
};

export interface ComparePasswords {
  compare(params: AuthPasswordsData): Promise<boolean>;
}

export class AuthPasswordService {
  constructor(private readonly comparePasswords: ComparePasswords) {}

  async auth({ password, passwordHash }: AuthPasswordsData): Promise<void> {
    const passwordsMatch = await this.comparePasswords.compare({
      password,
      passwordHash,
    });
    if (!passwordsMatch) {
      throw new EntityError("Invalid Credentials");
    }
  }
}
