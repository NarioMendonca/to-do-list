import { IncomingMessage } from "http";
import { CookieNotFoundError } from "../../../errors/infra/controller/CookieNotFoundError.js";
import { InvalidBodyError } from "../../../errors/infra/controller/InvalidBodyError.js";

export class AppUtils {
  public static getPath(req: IncomingMessage) {
    if (req.url?.includes("?")) {
      const path = req.url.split("?")[0];
      return path;
    }
    return req.url ?? "";
  }

  public static async getBody(req: IncomingMessage): Promise<string> {
    const getBodyData = new Promise<string>((resolve, reject) => {
      let data = "";
      req.once("data", (chunk) => {
        data += chunk;
      });

      req.once("close", () => resolve(data));

      req.once("error", (error) => reject(error));
    });
    const bodyData = await getBodyData;
    try {
      const data = JSON.parse(bodyData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage =
          error.message === "Unexpected end of JSON input"
            ? "Body must be in JSON"
            : error.message;
        throw new InvalidBodyError(errorMessage);
      }
      throw error;
    }
  }

  public static getQueryParams = (req: IncomingMessage) => {
    const queryParams: Record<string, string> = {};
    if (req.url?.includes("?")) {
      const urlValues = req.url.split("?");
      urlValues.shift();
      for (const value of urlValues) {
        const keyValuePair = value.split("=");
        queryParams[keyValuePair[0]] = keyValuePair[1];
      }
    }
    return queryParams;
  };

  public static getCookie(req: IncomingMessage, cookieName: string) {
    const cookies = req.headers.cookie;
    if (!cookies) {
      throw new CookieNotFoundError();
    }
    const cookiePosition = cookies.indexOf(cookieName);
    if (cookiePosition === -1) {
      throw new CookieNotFoundError();
    }
    const startOfCookie = cookiePosition + (cookieName.length + 1); // cookieName.length + 1, ex: refreshToken={  <- starts here
    if (cookies[startOfCookie - 1] !== "=") {
      throw new CookieNotFoundError();
    }
    const endOfCookie = cookies.indexOf(";", cookiePosition);
    const expectedCookie = cookies.slice(
      startOfCookie,
      endOfCookie === -1 ? cookies.length : endOfCookie,
    );
    return expectedCookie;
  }
}
