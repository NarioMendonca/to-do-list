import { UserPgReadModelRepository } from "../../../../repositories/postgres-pg/UserPgReadRepository.js";
import { Req, Res } from "../../server.js";
import { Controller } from "../Controller.js";

export class UserReadings extends Controller {
  private readonly userReadModelRepository = new UserPgReadModelRepository();

  public get = async (req: Req, res: Res) => {
    const queryParamSchema = {
      userId: "string",
    } as const;
    const queryParams = this.getQueryParams(req);
    const { userId } = this.validateData({
      schema: queryParamSchema,
      data: queryParams,
    });

    const user = await this.userReadModelRepository.get(userId);

    res.writeHead(200);
    res.write(JSON.stringify(user));
    res.end();
  };
}
