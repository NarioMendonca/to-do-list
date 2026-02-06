import { UserDTO, UserWithPassword } from "../model/User.js";

export interface UserReadModelRepository {
  get(userId: string): Promise<UserDTO | null>;
  getAllDataByEmail(email: string): Promise<UserWithPassword | null>;
}
