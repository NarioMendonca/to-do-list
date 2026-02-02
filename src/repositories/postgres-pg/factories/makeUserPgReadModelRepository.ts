import { UserPgReadModelRepository } from "../UserPgReadModelRepository.js";

export function makeUserReadModelRepository() {
  const userReadModelRepository = new UserPgReadModelRepository();
  return userReadModelRepository;
}
