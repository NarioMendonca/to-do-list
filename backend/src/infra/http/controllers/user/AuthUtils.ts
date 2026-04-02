import { InvalidSession } from "../../../../errors/infra/controller/InvalidSessionError.js";
import { Encryptor, PayLoad } from "../../../../utils/Encryptor.js";

export const weekInSeconds = 60 * 60 * 24 * 7;

export const getDateInSeconds = () => Math.floor(new Date().getTime() / 1000);

export type TokenPayload = {
  userId: string;
  exp: number;
};

export class AuthUtils {
  private static readonly encryptor: Encryptor = new Encryptor();

  public static makeToken = async ({ userId, exp }: TokenPayload) => {
    const tokenPayload = JSON.stringify(
      await this.encryptor.encrypt(
        JSON.stringify({
          userId,
          exp,
        }),
      ),
    );

    return tokenPayload;
  };

  public static decryptToken = async (payload: PayLoad) => {
    let cookieDecrypted: string;
    try {
      cookieDecrypted = await this.encryptor.decrypt({
        encrypted: payload.encrypted,
        iv: payload.iv,
        authTag: payload.authTag,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidSession("Invalid cookie", 401);
      }
      throw error;
    }
    const refreshToken = JSON.parse(cookieDecrypted);
    return refreshToken;
  };

  public static isTokenValid = (token: TokenPayload) => {
    if (token.exp < this.getTimeInSeconds()) {
      throw new InvalidSession("token expired", 401);
    }
  };

  public static getTimeInSeconds() {
    return Math.floor(new Date().getTime() / 1000);
  }
}
