import { UserEntity } from "../../entities/user/User.js";
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
        userEntity.isUserEmailVerified(),
        userEntity.getPasswordHash(),
        userEntity.getCreatedAt(),
      ],
    );
  }
}
