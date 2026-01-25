import { UserDTO } from "../../model/User.js";
import { UserReadModelRepository } from "../UserReadModelRepository.js";
import { db } from "./client.js";

export class UserPgReadModelRepository implements UserReadModelRepository {
  async get(userId: string): Promise<UserDTO> {
    const userQuery = await db.query(
      `SELECT id, name, email FROM users WHERE id = $1`,
      [userId],
    );
    const user: UserDTO = userQuery.rows[0];
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
}
