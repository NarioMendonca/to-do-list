import crypto from "node:crypto";
import env from "../infra/env/getEnvs.js";
import util from "node:util";

export type PayLoad = {
  encrypted: string;
  iv: string;
  authTag: string;
};

const randomBytesAsync = util.promisify(crypto.randomBytes);

export class Encryptor {
  async encrypt(text: string): Promise<PayLoad> {
    const cipheriv = await randomBytesAsync(12);
    const cipher = crypto.createCipheriv(
      "aes-128-gcm",
      env.ENCRYPTER_SECRET_KEY,
      cipheriv,
    );
    const encryptedData = Buffer.concat([cipher.update(text), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encrypted: encryptedData.toString("base64"),
      authTag: authTag.toString("base64"),
      iv: cipheriv.toString("base64"),
    };
  }

  async decrypt({ encrypted, iv, authTag }: PayLoad) {
    const decipher = crypto.createDecipheriv(
      "aes-128-gcm",
      env.ENCRYPTER_SECRET_KEY,
      Buffer.from(iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(authTag, "base64"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, "base64")),
      decipher.final(),
    ]);

    return decrypted.toString("utf-8");
  }
}
