export interface PasswordHashModel {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
