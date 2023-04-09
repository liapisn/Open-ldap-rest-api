export class UserNotFound extends Error {
  message: string;

  constructor(message) {
    super();
    this.message = message;
  }
}
