import { CookieNotFoundError } from "../../../errors/infra/controller/CookieNotFoundError.js";
import { InvalidBodyError } from "../../../errors/infra/controller/InvalidBodyError.js";
import { Req } from "../server.js";

type Schema = "string" | "number" | "boolean" | { [key: string]: Schema };

type SchemaToType<T> = {
  [K in keyof T]: T[K] extends "string"
    ? string
    : T[K] extends "number"
      ? number
      : T[K] extends "boolean"
        ? boolean
        : T[K] extends "object"
          ? { [K in keyof T]: SchemaToType<K> }
          : never;
};

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

  protected getQueryParams = (req: Req) => {
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  protected validateData<Tschema extends Schema>({
    data,
    schema,
  }: {
    data: unknown;
    schema: Tschema;
  }): SchemaToType<Tschema> {
    if (typeof data !== "object" || data === null) {
      throw new InvalidBodyError("Body must be a object");
    }

    const validBody: any = {};

    for (const key in schema) {
      if (!(key in data)) {
        throw new InvalidBodyError(
          `Missing parameter ${key}. Body schema: ${JSON.stringify(schema)}`,
        );
      }
      const dataValue = (data as any)[key];
      const expectedType = schema[key];
      const typeIsObject = typeof expectedType !== "string";
      const dataIsObject = typeof dataValue === "object";
      const invalidTypeMessage = `parameter ${key} receives a ${dataIsObject ? JSON.stringify(dataValue) : typeof dataValue} and must be a ${typeIsObject ? JSON.stringify(expectedType) : expectedType}`;
      if (typeof dataValue !== expectedType && !typeIsObject) {
        throw new InvalidBodyError(invalidTypeMessage);
      }

      if (typeIsObject) {
        if (!dataIsObject) {
          throw new InvalidBodyError(invalidTypeMessage);
        }
        this.validateData({ data: dataValue, schema: expectedType as Schema });
      }

      validBody[key] = dataValue;
    }
    return validBody;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  protected getCookie(req: Req, cookieName: string) {
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
