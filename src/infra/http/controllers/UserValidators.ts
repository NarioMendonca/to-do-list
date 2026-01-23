import { InvalidBodyError } from "../../../errors/controller/InvalidBodyError.js";

export const createUserInputValues = ["name", "email", "password"];

export class UserInputValidators {
  static validateCreateUserInput(paramsToValidate: unknown) {
    if (typeof paramsToValidate == "object" && paramsToValidate !== null) {
      const paramsToValidateValues = new Set(Object.keys(paramsToValidate));
      for (const param of createUserInputValues) {
        if (!paramsToValidateValues.has(param)) {
          throw new InvalidBodyError(
            `Missing param "${param}" on body. parameters: ${createUserInputValues}`,
          );
        }
      }
      return { ...paramsToValidate } as {
        name: string;
        email: string;
        password: string;
      };
    }
    throw new InvalidBodyError("Body should be in JSON");
  }
}
