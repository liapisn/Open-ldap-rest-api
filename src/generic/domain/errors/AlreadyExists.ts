export class AlreadyExists extends Error {
  message: string;

  constructor(message) {
    super();
    this.message = message;
  }
}
