export class UserAlreadyExists extends Error {
  message: string;

  constructor(message) {
    super();
    this.message = message;
  }
}
