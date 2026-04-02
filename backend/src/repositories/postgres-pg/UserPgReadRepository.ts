import { UserDTO, UserWithPassword } from "../../model/User.js";
import { UserReadModelRepository } from "../UserReadRepository.js";
import { pool } from "./client.js";

export class UserPgReadModelRepository implements UserReadModelRepository {
  async get(userId: string): Promise<UserDTO | null> {
    const userQuery = await pool.query(
      `SELECT id, name, email, is_email_verified FROM users WHERE id = $1`,
      [userId],
    );
    const data = userQuery.rows[0];
    if (!data) {
      return null;
    }
    const user: UserDTO = {
      ...data,
      isEmailVerified: data.is_email_verified,
      is_email_verified: undefined,
    };
    return user;
  }

  async getAllDataByEmail(email: string): Promise<UserWithPassword | null> {
    const userQuery = await pool.query(
      `SELECT id, name, email, is_email_verified, password_hash FROM users WHERE email = $1`,
      [email],
    );
    const data = userQuery.rows[0];
    if (!data) {
      return null;
    }

    const user: UserWithPassword = {
      ...data,
      isEmailVerified: data.is_email_verified,
      is_email_verified: undefined,
      passwordHash: data.password_hash,
    };
    return user;
  }
}
