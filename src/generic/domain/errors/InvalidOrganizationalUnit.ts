export class InvalidOrganizationalUnit extends Error {
  message: string;

  constructor(message) {
    super();
    this.message = message;
  }
}
