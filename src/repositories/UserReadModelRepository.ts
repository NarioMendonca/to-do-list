import { UserDTO } from "../model/User.js";

export interface UserReadModelRepository {
  get(userId: string): Promise<UserDTO>;
  fetch(usersId: string[]): Promise<UserDTO[]>;
}
