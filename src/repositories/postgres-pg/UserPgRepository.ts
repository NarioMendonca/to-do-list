import { UserEntity } from "../../entities/user/User.js";
import { User } from "../../model/User.js";
import { isEmailVerifiedParams } from "../UserRepository.js";
import { UserRepository } from "../UserRepository.js";
import { pool } from "./client.js";

export class UserPgRepository implements UserRepository {
  async create(userEntity: UserEntity): Promise<void> {
    await pool.query(
      `INSERT INTO users (id, name, email, is_email_verified, password_hash, created_at) 
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    )`,
      [
        userEntity.getId(),
        userEntity.getName(),
        userEntity.getEmail(),
        userEntity.getIsEmailVerified(),
        userEntity.getPasswordHash(),
        userEntity.getCreatedAt(),
      ],
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const queryResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (queryResult.rowCount === 0) {
      return null;
    }
    const data = queryResult.rows[0];
    const userData: User = {
      ...data,
      isEmailVerified: data.is_email_verified,
      createdAt: data.created_at,
      passwordHash: data.password_hash,
    };
    return UserEntity.restore(userData);
  }

  async alreadyExists(email: string): Promise<boolean> {
    const queryData = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email],
    );
    if (queryData.rowCount == 0) {
      return false;
    }
    return true;
  }

  async exists(userId: string): Promise<boolean> {
    const queryData = await pool.query("SELECT id FROM users WHERE id = $1", [
      userId,
    ]);
    if (queryData.rowCount == 0) {
      return false;
    }
    return true;
  }

  async isEmailVerified(params: isEmailVerifiedParams): Promise<boolean> {
    const isEmailVerifiedQuery = await pool.query(
      `SELECT is_email_verified FROM users WHERE ${params.id ? "id" : "email"} = $1`,
      [params.id ?? params.email],
    );
    const isEmailVerified = isEmailVerifiedQuery.rows[0];
    return isEmailVerified;
  }
}
