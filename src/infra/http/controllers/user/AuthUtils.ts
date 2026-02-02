import { InvalidSession } from "../../../../errors/controller/InvalidSessionError.js";
import { Encryptor, PayLoad } from "../../../../utils/Encryptor.js";

export const weekInSeconds = 60 * 60 * 24 * 7;

export const getDateInSeconds = () => Math.floor(new Date().getTime() / 1000);

export type TokenPayload = {
  userId: string;
  exp: number;
};

export class AuthUtils {
  private readonly encryptor: Encryptor;
  constructor() {
    this.encryptor = new Encryptor();
  }

  public makeToken = async ({ userId, exp }: TokenPayload) => {
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

  public decryptToken = async (payload: PayLoad) => {
    let cookieDecrypted: string;
    try {
      cookieDecrypted = await this.encryptor.decrypt({
        encrypted: payload.encrypted,
        iv: payload.iv,
        authTag: payload.authTag,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidSession("Invalid cookie");
      }
      throw error;
    }
    const refreshToken = JSON.parse(cookieDecrypted);
    return refreshToken;
  };

  public isTokenValid = (token: TokenPayload) => {
    if (token.exp < this.getTimeInSeconds()) {
      throw new InvalidSession("Refresh token expired");
    }
  };

  public getTimeInSeconds() {
    return Math.floor(new Date().getTime() / 1000);
  }
}
