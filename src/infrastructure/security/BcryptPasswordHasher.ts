import { hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";
import type { PasswordHasher } from "@/domain/services/PasswordHasher";

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 12) {
    this.saltRounds = saltRounds;
  }

  async hash(plainText: string): Promise<string> {
    return bcryptHash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcryptCompare(plainText, hash);
  }
}


