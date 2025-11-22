export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class EmailAlreadyInUseError extends DomainError {
  constructor(email: string) {
    super(`Email "${email}" is already in use`);
    this.name = "EmailAlreadyInUseError";
  }
}

export class NicknameAlreadyInUseError extends DomainError {
  constructor(nickname: string) {
    super(`Nickname "${nickname}" is already in use`);
    this.name = "NicknameAlreadyInUseError";
  }
}

