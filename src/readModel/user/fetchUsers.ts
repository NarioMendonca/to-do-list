import { UserDTO } from "../../model/User.js";
import { UserReadModelRepository } from "../../repositories/UserReadModelRepository.js";
import { ReadModel } from "../ReadModel.js";

type FetchUsersInput = {
  usersId: string[];
};

export class FetchUsers implements ReadModel<FetchUsersInput, UserDTO[]> {
  constructor(
    private readonly userReadModelRepository: UserReadModelRepository,
  ) {}

  async handle({ usersId }: FetchUsersInput): Promise<UserDTO[]> {
    const users = this.userReadModelRepository.fetch(usersId);

    return users;
  }
}
