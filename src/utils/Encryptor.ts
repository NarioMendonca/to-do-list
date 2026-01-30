import crypto from "node:crypto";
import env from "../infra/env/getEnvs.js";
import util from "node:util";

const randomBytesAsync = util.promisify(crypto.randomBytes);

export class Encrytor {
  async encrypt(text: string) {
    const cipheriv = await randomBytesAsync(12);
    const cipher = crypto.createCipheriv(
      "aes-128-gcm",
      env.ENCRYPTER_SECRET_KEY,
      cipheriv,
    );
    const encryptedData = Buffer.concat([cipher.update(text), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encryptedData.toString("base64"),
      authTag: authTag.toString("base64"),
      cipheriv: cipheriv.toString("base64"),
    };
  }
}
