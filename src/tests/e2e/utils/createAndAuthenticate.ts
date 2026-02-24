import { faker } from "@faker-js/faker";
import { CreateUserDTO, UserDTO } from "../../../model/User.js";

type OutputData = {
  user: UserDTO;
  sessionCookie: string;
};

export async function createAndAuthenticate(
  serverAddress: string,
): Promise<OutputData> {
  const userData: CreateUserDTO = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
  };

  await fetch(`${serverAddress}/users`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const authenticateUserResponse = await fetch(`${serverAddress}/login`, {
    method: "POST",
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
    }),
  });
  const user = (await authenticateUserResponse.json()) as UserDTO;
  const sessionCookie = authenticateUserResponse.headers.get("set-cookie")!;

  return {
    user,
    sessionCookie,
  };
}
