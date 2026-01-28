import { UserEntity } from "../../entities/user/User.js";
import { User } from "../../model/User.js";
import { UserRepository } from "../UserRepository.js";
import { db } from "./client.js";

export class UserPgRepository implements UserRepository {
  async create(userEntity: UserEntity): Promise<void> {
    await db.query(
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
    const queryResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (queryResult.rowCount === 0) {
      return null;
    }
    console.log(queryResult);
    const data = queryResult.rows[0];
    const userData: User = {
      ...data,
      isEmailVerified: data.is_email_verified,
      createdAt: data.created_at,
      passwordHash: data.password_hash,
    };
    return UserEntity.restore(userData);
  }
}
