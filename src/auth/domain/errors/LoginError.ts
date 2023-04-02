export class LoginError extends Error {
  message: string;

  constructor(message) {
    super();
    this.message = message;
  }
}
