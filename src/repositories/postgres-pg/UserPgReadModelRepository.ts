import { UserDTO } from "../../model/User.js";
import {
  isEmailVerifiedParams,
  UserReadModelRepository,
} from "../UserReadModelRepository.js";
import { db } from "./client.js";

export class UserPgReadModelRepository implements UserReadModelRepository {
  async get(userId: string): Promise<UserDTO> {
    const userQuery = await db.query(
      `SELECT id, name, email, is_email_verified FROM users WHERE id = $1`,
      [userId],
    );
    const data = userQuery.rows[0];
    const user: UserDTO = {
      ...data,
      isEmailVerified: data.is_email_verified,
      is_email_verified: undefined,
    };
    return user;
  }

  fetch(usersId: string[]): Promise<UserDTO[]> {
    throw new Error("Method not implemented.");
  }

  async alreadyExists(email: string): Promise<boolean> {
    const emailExists = await db.query(
      "SELECT email FROM users WHERE email = $1",
      [email],
    );
    return emailExists.rows[0];
  }

  async isEmailVerified(params: isEmailVerifiedParams): Promise<boolean> {
    const isEmailVerifiedQuery = await db.query(
      `SELECT is_email_verified FROM users WHERE ${params.id ? "id" : "email"} = $1`,
      [params.id ?? params.email],
    );
    const isEmailVerified = isEmailVerifiedQuery.rows[0];
    return isEmailVerified;
  }
}
