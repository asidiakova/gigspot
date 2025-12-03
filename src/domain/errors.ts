export class DomainError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class EmailAlreadyInUseError extends DomainError {
  constructor(email: string) {
    super(`Email "${email}" is already in use`);
  }
}

export class NicknameAlreadyInUseError extends DomainError {
  constructor(nickname: string) {
    super(`Nickname "${nickname}" is already in use`);
  }
}

export class EventNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Event "${id}" not found`);
  }
}

export class EventAlreadyStartedError extends DomainError {
  constructor() {
    super("Event already started; editing is not allowed");
  }
}

export class EventInPastError extends DomainError {
  constructor() {
    super("Cannot attend a past event");
  }
}

export class IncorrectPasswordError extends DomainError {
  constructor() {
    super("Incorrect current password");
  }
}

