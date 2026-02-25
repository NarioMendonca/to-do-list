import z from "zod";
import { UserPgReadModelRepository } from "../../../../repositories/postgres-pg/UserPgReadRepository.js";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";

export class UserReadings {
  private readonly userReadModelRepository = new UserPgReadModelRepository();

  public get = async (req: AppRequest, res: AppResponse) => {
    const queryParamsSchema = z.object({
      userId: z.string(),
    });
    const { userId } = queryParamsSchema.parse(req.queryParams);

    const user = await this.userReadModelRepository.get(userId);

    res.writeHead(200);
    res.write(JSON.stringify(user));
    res.end();
  };
}
