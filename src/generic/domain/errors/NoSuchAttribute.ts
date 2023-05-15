export class NoSuchAttribute extends Error {
  message: string;

  constructor(message) {
    super();
    this.message = message;
  }
}
