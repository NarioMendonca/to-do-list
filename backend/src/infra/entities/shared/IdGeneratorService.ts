import { randomUUID } from "node:crypto";
import { IdGenerator } from "../../../entities/shared/IdGenerator.js";

export class IdGeneratorService implements IdGenerator {
  generateUUID(): string {
    return randomUUID();
  }
}
