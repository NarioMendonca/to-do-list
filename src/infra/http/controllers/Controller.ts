import { Req } from "../server.js";

export class Controller {
  protected async getBody(req: Req): Promise<string> {
    const getBodyData = new Promise<string>((resolve, reject) => {
      let data = "";
      req.once("data", (chunk) => {
        data += chunk;
      });

      req.once("close", () => resolve(data));

      req.once("error", (error) => reject(error));
    });
    const data = await getBodyData;
    return JSON.parse(data);
  }
}
