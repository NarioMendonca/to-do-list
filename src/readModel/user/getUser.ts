import { UserDTO } from "../../model/User.js";
import { UserReadModelRepository } from "../../repositories/UserReadModelRepository.js";
import { ReadModel } from "../ReadModel.js";

type GetUserInput = {
  userId: string;
};

export class GetUser implements ReadModel<GetUserInput, UserDTO> {
  constructor(
    private readonly userReadModelRepository: UserReadModelRepository,
  ) {}

  async handle({ userId }: GetUserInput): Promise<UserDTO> {
    const user = await this.userReadModelRepository.get(userId);

    return user;
  }
}
